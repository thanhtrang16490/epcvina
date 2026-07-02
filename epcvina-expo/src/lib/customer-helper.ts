import { supabase } from './supabase'
import { User } from '../types'
import { errorTracker } from './error-tracking'

/**
 * Get or create customer record for a user
 * This handles the case where a user with role 'customer' doesn't have a corresponding
 * customer record in the customers table yet.
 */
export async function getOrCreateCustomer(user: User): Promise<string | null> {
  try {
    console.log('[CustomerHelper] Getting customer for user:', user.id)
    
    // Validate user role
    if (user.role !== 'customer') {
      console.error('[CustomerHelper] User is not a customer, role:', user.role)
      return null
    }
    
    // Try to get existing customer record
    let { data: customerData, error: customerError } = await supabase
      .from('customers')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (customerError) {
      console.error('[CustomerHelper] Error fetching customer:', customerError)
      errorTracker.logError(customerError, { action: 'getOrCreateCustomer.fetch' })
      return null
    }

    // If customer exists, return it
    if (customerData) {
      console.log('[CustomerHelper] Found existing customer:', customerData.id)
      return customerData.id
    }

    // Customer doesn't exist, try to create one
    console.log('[CustomerHelper] Customer record not found, attempting to create...')
    
    // Ensure we have required data
    if (!user.email && !user.phone) {
      console.error('[CustomerHelper] Cannot create customer: no email or phone')
      return null
    }
    
    const newCustomerData = {
      user_id: user.id,
      email: user.email || `${user.id}@customer.local`,
      full_name: user.full_name || 'Khách hàng',
      phone: user.phone || null,
    }
    
    console.log('[CustomerHelper] Inserting customer with data:', newCustomerData)
    
    const { data: newCustomer, error: createError } = await supabase
      .from('customers')
      .insert([newCustomerData])
      .select('id')
      .single()

    if (createError) {
      console.error('[CustomerHelper] Error creating customer:', {
        message: createError.message,
        details: createError.details,
        hint: createError.hint,
        code: createError.code,
      })
      
      // If it's a unique constraint violation, try to fetch again
      // (race condition: another request might have created it)
      if (createError.code === '23505') {
        console.log('[CustomerHelper] Unique constraint violation, retrying fetch...')
        const { data: retryData, error: retryError } = await supabase
          .from('customers')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle()
        
        if (!retryError && retryData) {
          console.log('[CustomerHelper] Found customer on retry:', retryData.id)
          return retryData.id
        }
      }
      
      errorTracker.logError(createError, { 
        action: 'getOrCreateCustomer.create',
        userId: user.id,
        userRole: user.role,
      })
      return null
    }

    if (!newCustomer) {
      console.error('[CustomerHelper] Customer created but no data returned')
      return null
    }

    console.log('[CustomerHelper] Customer record created successfully:', newCustomer.id)
    return newCustomer.id
  } catch (error) {
    console.error('[CustomerHelper] Unexpected error:', error)
    errorTracker.logError(error as Error, { 
      action: 'getOrCreateCustomer',
      userId: user.id,
    })
    return null
  }
}
