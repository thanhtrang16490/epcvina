import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert, FlatList, Modal, Animated, Image } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../../src/lib/supabase'
import { useAuth } from '../../src/contexts/AuthContext'
import SuccessModal from '../../src/components/SuccessModal'
import { useDebounce } from '../../src/hooks/useDebounce'
import { sendLocalNotification } from '../../src/hooks/usePushNotifications'
import { calculateOrderTotal, validateDiscount, generateOrderNumber } from '../../src/lib/pricing'
import type { DiscountType, GiftPolicy, GiftItem, CustomerSpecialPrice } from '../../src/types'

// Import selling components
import { CartItem } from '../../src/components/selling'
import CustomerSelector from '../../src/components/selling/CustomerSelector'
import ProductGrid from '../../src/components/selling/ProductGrid'
import QuantityModal from '../../src/components/selling/QuantityModal'
import DiscountSection from '../../src/components/selling/DiscountSection'
import GiftSection from '../../src/components/selling/GiftSection'
import OrderConfirmModal from '../../src/components/selling/OrderConfirmModal'

export default function SellingScreen() {
  const { user } = useAuth()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [cart, setCart] = useState<any[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [quickSearchQuery, setQuickSearchQuery] = useState('')
  const [customerSearchQuery, setCustomerSearchQuery] = useState('')
  const [userRole, setUserRole] = useState<string>('')
  
  // Debounced search queries for better performance
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
  const debouncedQuickSearchQuery = useDebounce(quickSearchQuery, 300)
  const debouncedCustomerSearchQuery = useDebounce(customerSearchQuery, 300)
  
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [showProductSheet, setShowProductSheet] = useState(false)
  const [showQuickSearchResults, setShowQuickSearchResults] = useState(false)
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null)
  const [editingQuantity, setEditingQuantity] = useState<number | null>(null)
  const [tempQuantity, setTempQuantity] = useState('')
  const [showQuantityModal, setShowQuantityModal] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [orderNotes, setOrderNotes] = useState('')
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; translateY: Animated.Value; opacity: Animated.Value }>>([])
  const toastIdCounter = useRef(0)

  // Discount state
  const [discountType, setDiscountType] = useState<DiscountType>('percentage')
  const [discountValue, setDiscountValue] = useState(0)
  const [discountNotes, setDiscountNotes] = useState('')

  // Gift state
  const [giftItems, setGiftItems] = useState<GiftItem[]>([])
  const [giftPolicies, setGiftPolicies] = useState<GiftPolicy[]>([])

  // Special pricing state
  const [customerSpecialPrices, setCustomerSpecialPrices] = useState<Map<string, number>>(new Map())

  // Order confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  // Auto show/hide quick search results based on debounced query
  useEffect(() => {
    if (debouncedQuickSearchQuery && debouncedQuickSearchQuery.trim().length >= 2) {
      setShowQuickSearchResults(true)
    } else {
      setShowQuickSearchResults(false)
    }
  }, [debouncedQuickSearchQuery])

  // Auto-detect gifts when cart or policies change
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    const autoGifts: GiftItem[] = []

    for (const policy of giftPolicies) {
      if (policy.effective_from && policy.effective_from > today) continue
      if (policy.effective_to && policy.effective_to < today) continue

      const cartItem = cart.find(item => String(item.id) === String(policy.trigger_product_id))
      if (!cartItem || !policy.min_quantity || cartItem.quantity < policy.min_quantity) continue

      const multiplier = Math.floor(cartItem.quantity / policy.min_quantity)

      autoGifts.push({
        policy_id: policy.id,
        policy_name: policy.name,
        product_id: String(policy.gift_product_id),
        product_name: policy.gift_product?.name || '',
        product_code: policy.gift_product?.code || '',
        quantity: (policy.gift_quantity ?? 0) * multiplier,
        unit_value: policy.gift_product?.price || 0,
        unit: policy.gift_product?.unit,
        auto: true,
      })
    }

    setGiftItems(prev => [
      ...prev.filter(g => !g.auto),
      ...autoGifts,
    ])
  }, [cart, giftPolicies])

  const addToastNotification = useCallback((message: string) => {
    const id = toastIdCounter.current++
    const translateY = new Animated.Value(-100)
    const opacity = new Animated.Value(0)

    const newToast = { id, message, translateY, opacity }
    setToasts(prev => [...prev, newToast])

    // Slide in from top
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()

    // Auto dismiss after 2 seconds
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      })
    }, 2000)
  }, [])

  const fetchData = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser) {
        router.replace('/(auth)/login')
        return
      }

      // Fetch profile to check role
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authUser.id)
        .single()

      if (!profileData || !['sale', 'admin', 'sale_admin'].includes(profileData.role)) {
        router.replace('/(auth)/login')
        return
      }

      setUserRole(profileData.role)
      const isSaleAdmin = profileData.role === 'sale_admin'

      // For Sale Admin, fetch managed sales IDs
      let managedSaleIds: string[] = []
      if (isSaleAdmin) {
        const { data: managedSales } = await supabase
          .from('profiles')
          .select('id')
          .eq('manager_id', authUser.id)
        managedSaleIds = managedSales?.map(s => s.id) || []
      }

      // Fetch products
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .gt('stock', 0)
        .order('name')
      
      setProducts(productsData || [])

      // Fetch categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .order('name')
      
      setCategories(categoriesData || [])

      // Fetch customers (profiles with role=customer)
      let customersQuery = supabase
        .from('profiles')
        .select('id, full_name, phone, role, created_at')
        .eq('role', 'customer')
        .order('full_name', { ascending: true, nullsFirst: false })

      const { data: customersData, error: customersError } = await customersQuery
      
      if (customersError) {
        console.error('Error loading customers:', customersError)
      }
      
      setCustomers(customersData || [])

      // Fetch active gift policies
      const { data: policiesData } = await supabase
        .from('gift_policies')
        .select('*, trigger_product:products!gift_policies_trigger_product_id_fkey(id, name, code), gift_product:products!gift_policies_gift_product_id_fkey(id, name, code, price, unit)')
        .eq('is_active', true)
      setGiftPolicies((policiesData as GiftPolicy[]) || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load customer special prices when customer is selected
  const loadCustomerSpecialPrices = useCallback(async (customerId: string) => {
    try {
      const now = new Date().toISOString()
      const { data, error } = await supabase
        .from('customer_special_prices')
        .select('*')
        .eq('customer_id', customerId)
        .eq('is_active', true)
        .lte('effective_from', now)
        .or(`effective_to.is.null,effective_to.gte.${now}`)

      if (error) {
        // Table may not exist — return empty instead of crashing
        console.warn('customer_special_prices query failed:', error.message)
        setCustomerSpecialPrices(new Map())
        return
      }

      const priceMap = new Map<string, number>()
      ;(data || []).forEach((p: any) => {
        const finalPrice = p.price_type === 'fixed'
          ? p.price_value
          : 0 // For percentage type, we'll need the base price
        priceMap.set(p.product_id.toString(), finalPrice)
      })

      // For percentage-type special prices, compute from product base price
      ;(data || []).forEach((p: any) => {
        if (p.price_type === 'percentage') {
          const product = products.find(prod => String(prod.id) === String(p.product_id))
          if (product) {
            const computedPrice = product.price * (1 - p.price_value / 100)
            priceMap.set(p.product_id.toString(), Math.round(computedPrice))
          }
        }
      })

      setCustomerSpecialPrices(priceMap)
    } catch (error) {
      console.error('Error loading customer special prices:', error)
      setCustomerSpecialPrices(new Map())
    }
  }, [products])

  // Get final price for a product (considering special pricing)
  const getProductFinalPrice = useCallback((product: any): number => {
    if (selectedCustomer && customerSpecialPrices.has(String(product.id))) {
      return customerSpecialPrices.get(String(product.id))!
    }
    return product.price
  }, [selectedCustomer, customerSpecialPrices])

  // Handle customer selection with special price loading
  const handleSelectCustomer = useCallback(async (customer: any) => {
    setSelectedCustomer(customer)
    if (customer.id) {
      await loadCustomerSpecialPrices(customer.id)
    }
  }, [loadCustomerSpecialPrices])

  const handleClearCustomer = useCallback(() => {
    setSelectedCustomer(null)
    setCustomerSpecialPrices(new Map())
  }, [])

  const addToCart = useCallback((product: any) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id)
      // Apply special price if available
      const specialPrice = customerSpecialPrices.has(String(product.id))
        ? customerSpecialPrices.get(String(product.id))!
        : null
      const hasSpecialPrice = specialPrice !== null

      if (existingItem) {
        addToastNotification(`Đã tăng số lượng "${product.name}"`)
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock), special_price: specialPrice, has_special_price: hasSpecialPrice }
            : item
        )
      } else {
        addToastNotification(`Đã thêm "${product.name}" vào giỏ`)
        return [...prevCart, { ...product, quantity: 1, special_price: specialPrice, has_special_price: hasSpecialPrice }]
      }
    })
  }, [addToastNotification, customerSpecialPrices])

  const updateQuantity = useCallback((productId: number, delta: number) => {
    setCart(prevCart => prevCart.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + delta
        if (newQuantity <= 0) return null
        if (newQuantity > item.stock) return item
        return { ...item, quantity: newQuantity }
      }
      return item
    }).filter(Boolean) as any[])
  }, [])

  const setQuantityDirectly = useCallback((productId: number, quantity: number) => {
    setCart(prevCart => prevCart.map(item => {
      if (item.id === productId) {
        if (quantity <= 0) return null
        if (quantity > item.stock) {
          Alert.alert('Thông báo', `Số lượng tối đa: ${item.stock}`)
          return { ...item, quantity: item.stock }
        }
        return { ...item, quantity }
      }
      return item
    }).filter(Boolean) as any[])
  }, [])

  const handleQuantityEdit = useCallback((item: any) => {
    setEditingItem(item)
    setTempQuantity(item.quantity.toString())
    setShowQuantityModal(true)
  }, [])

  const handleQuantitySubmit = useCallback(() => {
    if (!editingItem) return
    
    const quantity = parseInt(tempQuantity)
    if (!isNaN(quantity) && quantity > 0) {
      setQuantityDirectly(editingItem.id, quantity)
    }
    setShowQuantityModal(false)
    setEditingItem(null)
    setTempQuantity('')
  }, [tempQuantity, editingItem, setQuantityDirectly])

  // Subtotal using special prices when applicable
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const price = getProductFinalPrice(item)
      return sum + (price * item.quantity)
    }, 0)
  }, [cart, getProductFinalPrice])

  // Discount calculation
  const { discount_amount, total_amount } = useMemo(() => {
    return calculateOrderTotal(subtotal, discountValue > 0 ? discountType : null, discountValue)
  }, [subtotal, discountType, discountValue])

  const getTotalAmount = useCallback(() => {
    return total_amount
  }, [total_amount])

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ' đ'
  }, [])

  const handleDiscountValueChange = useCallback((value: number) => {
    const validation = validateDiscount(userRole, discountType, value, subtotal)
    if (!validation.valid) {
      Alert.alert('Lỗi', validation.error)
      return
    }
    setDiscountValue(value)
  }, [userRole, discountType, subtotal])

  const handleAddManualGift = useCallback((gift: GiftItem) => {
    setGiftItems(prev => [...prev, gift])
    addToastNotification(`Đã thêm quà "${gift.product_name}"`)
  }, [addToastNotification])

  const handleRemoveManualGift = useCallback((index: number) => {
    setGiftItems(prev => prev.filter((_, i) => i !== index))
  }, [])

  // Show confirmation modal instead of directly creating order
  const handleCompleteOrder = useCallback(() => {
    if (cart.length === 0) {
      Alert.alert('Lỗi', 'Vui lòng thêm sản phẩm vào đơn hàng')
      return
    }
    setShowConfirmModal(true)
  }, [cart.length])

  // Actual order creation after confirmation
  const handleConfirmOrder = async () => {
    try {
      setIsCreatingOrder(true)
      const finalAmount = total_amount

      // Generate order number
      const orderNumber = generateOrderNumber()

      // Create order with discount
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{
          customer_id: selectedCustomer?.id || null,
          sale_id: user?.id,
          status: 'draft',
          order_number: orderNumber,
          subtotal,
          discount_type: discountValue > 0 ? discountType : null,
          discount_value: discountValue > 0 ? discountValue : null,
          discount_amount: discountValue > 0 ? discount_amount : null,
          discount_notes: discountNotes || null,
          total_amount: finalAmount,
          ...(orderNotes.trim() ? { notes: orderNotes.trim() } : {}),
        }])
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items with special prices
      const orderItems = cart.map(item => ({
        order_id: orderData.id,
        product_id: item.id,
        quantity: item.quantity,
        price_at_order: getProductFinalPrice(item),
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      // Create gift order if any gifts
      if (giftItems.length > 0) {
        const { data: giftOrder, error: giftOrderError } = await supabase
          .from('gift_orders')
          .insert({
            parent_order_id: orderData.id,
            customer_id: selectedCustomer?.id || null,
            gift_date: new Date().toISOString().split('T')[0],
            status: 'draft',
            total_value: giftItems.reduce((s, g) => s + g.unit_value * g.quantity, 0),
            notes: giftItems.filter(g => g.auto).map(g => g.policy_name).join(', ') || 'Quà tặng thủ công',
            created_by: user?.id,
          })
          .select()
          .single()

        if (giftOrderError) {
          console.error('Gift order error:', giftOrderError)
        } else if (giftOrder) {
          const { error: giftItemsError } = await supabase
            .from('gift_order_items')
            .insert(giftItems.map(g => ({
              gift_order_id: giftOrder.id,
              product_id: parseInt(g.product_id),
              quantity: g.quantity,
              unit_value: g.unit_value,
            })))

          if (giftItemsError) {
            console.error('Gift items error:', giftItemsError)
          }
        }
      }

      // Send local notification
      await sendLocalNotification(
        '✅ Đơn hàng đã tạo!',
        `Đơn #${orderData.id}${selectedCustomer ? ` - ${selectedCustomer.full_name}` : ''} · ${formatCurrency(finalAmount)}`,
        { screen: '/(sales)/orders', orderId: orderData.id }
      )

      // Close confirm modal and show success
      setShowConfirmModal(false)
      setCreatedOrderId(orderData.id)
      setShowSuccessModal(true)
    } catch (error: any) {
      console.error('Error creating order:', error)
      Alert.alert('Lỗi', error.message || 'Có lỗi khi tạo đơn hàng')
      setShowConfirmModal(false)
    } finally {
      setIsCreatingOrder(false)
    }
  }

  const resetOrder = useCallback(() => {
    setCart([])
    setSelectedCustomer(null)
    setOrderNotes('')
    setCreatedOrderId(null)
    setDiscountValue(0)
    setDiscountNotes('')
    setDiscountType('percentage')
    setGiftItems([])
    setCustomerSpecialPrices(new Map())
  }, [])

  const handleViewOrder = () => {
    setShowSuccessModal(false)
    resetOrder()
    router.push('/(sales)/orders')
  }

  const handleCreateAnother = () => {
    setShowSuccessModal(false)
    resetOrder()
  }

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false)
    resetOrder()
  }

  const filteredProducts = useMemo(() => {
    let filtered = products
    
    // Filter by category
    if (activeCategory !== 'all') {
      const categoryId = parseInt(activeCategory)
      filtered = filtered.filter(p => {
        if (!p.category_id) return false
        return p.category_id === categoryId
      })
    }
    
    // Filter by search query - use debounced value
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase()
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.code?.toLowerCase().includes(query)
      )
    }
    
    return filtered
  }, [products, activeCategory, debouncedSearchQuery])

  const quickSearchResults = useMemo(() => {
    if (!debouncedQuickSearchQuery || debouncedQuickSearchQuery.trim().length < 2) {
      return []
    }
    
    const query = debouncedQuickSearchQuery.toLowerCase().trim()
    const filtered = products.filter(p => {
      const nameMatch = p.name?.toLowerCase().includes(query)
      const codeMatch = p.code?.toLowerCase().includes(query)
      const hasStock = p.stock > 0
      
      return (nameMatch || codeMatch) && hasStock
    })
    
    return filtered.slice(0, 5)
  }, [products, debouncedQuickSearchQuery])

  const renderProductItem = useCallback(({ item: product }: { item: any }) => {
    const hasSpecialPrice = selectedCustomer && customerSpecialPrices.has(String(product.id))
    const finalPrice = hasSpecialPrice ? customerSpecialPrices.get(String(product.id))! : product.price

    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => addToCart(product)}
        activeOpacity={0.7}
      >
        {product.image_url ? (
          <Image
            source={{ uri: product.image_url }}
            style={styles.productImage}
            resizeMode="cover"
            defaultSource={require('../../assets/icon.png')}
          />
        ) : (
          <View style={styles.productIcon}>
            <Ionicons name="cube" size={24} color="#175ead" />
          </View>
        )}
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        {hasSpecialPrice ? (
          <View style={styles.productSpecialPriceRow}>
            <Text style={styles.productOrigPrice}>{formatCurrency(product.price)}</Text>
            <View style={styles.productSpecialPriceContainer}>
              <Text style={styles.productSpecialPrice}>{formatCurrency(finalPrice)}</Text>
              <View style={styles.productSpecialBadge}>
                <Text style={styles.productSpecialBadgeText}>Ưu đãi</Text>
              </View>
            </View>
          </View>
        ) : (
          <Text style={styles.productPrice}>{formatCurrency(product.price)}</Text>
        )}
        <Text style={styles.productStock}>Còn: {product.stock}</Text>
      </TouchableOpacity>
    )
  }, [addToCart, selectedCustomer, customerSpecialPrices, formatCurrency])

  const renderCategoryItem = useCallback(({ item: cat }: { item: any }) => {
    return (
      <TouchableOpacity
        style={[styles.categoryChip, activeCategory === cat.id.toString() && styles.categoryChipActive]}
        onPress={() => setActiveCategory(cat.id.toString())}
      >
        <Text style={[styles.categoryText, activeCategory === cat.id.toString() && styles.categoryTextActive]}>
          {cat.name} ({cat.count})
        </Text>
      </TouchableOpacity>
    )
  }, [activeCategory])

  const categoriesWithProducts = useMemo(() => {
    const categoriesWithCount = categories
      .map(cat => ({
        ...cat,
        count: products.filter(p => p.category_id === cat.id).length
      }))
      .filter(cat => cat.count > 0)
    
    return [{ id: 'all', name: 'Tất cả', count: products.length }, ...categoriesWithCount]
  }, [categories, products])

  const keyExtractor = useCallback((item: any) => item.id.toString(), [])

  const getFilteredCustomers = useMemo(() => {
    if (debouncedCustomerSearchQuery === ' ') {
      return customers.slice(0, 10)
    }
    
    if (!debouncedCustomerSearchQuery || debouncedCustomerSearchQuery.trim().length < 2) return []
    
    const query = debouncedCustomerSearchQuery.toLowerCase().trim()
    const filtered = customers.filter(c => {
      const name = c.full_name?.toLowerCase() || ''
      const phone = c.phone?.toLowerCase() || ''
      
      return name.includes(query) || phone.includes(query)
    })
    
    return filtered.slice(0, 10)
  }, [customers, debouncedCustomerSearchQuery])

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#175ead" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    )
  }

  return (
    <>
      {/* Toast notifications - global, above everything */}
      {toasts.map((toast, index) => (
        <Animated.View
          key={toast.id}
          style={[
            styles.toast,
            {
              top: insets.top + 16 + (index * 72),
              transform: [{ translateY: toast.translateY }],
              opacity: toast.opacity,
            },
          ]}
        >
          <Ionicons name="checkmark-circle" size={20} color="white" />
          <Text style={styles.toastText}>{toast.message}</Text>
        </Animated.View>
      ))}

      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bán hàng</Text>
        <TouchableOpacity
          onPress={handleCompleteOrder}
          disabled={cart.length === 0 || isCreatingOrder}
          style={[styles.doneButton, (cart.length === 0 || isCreatingOrder) && styles.doneButtonDisabled]}
        >
          <Text style={[styles.doneButtonText, (cart.length === 0 || isCreatingOrder) && styles.doneButtonTextDisabled]}>
            {isCreatingOrder ? 'Đang tạo...' : 'Xong'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Customer Selector Component */}
        <CustomerSelector
          customers={customers}
          selectedCustomer={selectedCustomer}
          searchQuery={customerSearchQuery}
          onSearchChange={setCustomerSearchQuery}
          onSelectCustomer={handleSelectCustomer}
          onClearSelection={handleClearCustomer}
          filteredCustomers={getFilteredCustomers}
        />

        {/* Cart Items or Empty State */}
        {cart.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="cart-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>Đơn này bạn bán hàng gì?</Text>
            <Text style={styles.emptyText}>
              Nhấn nút bên dưới để chọn sản phẩm
            </Text>
          </View>
        ) : (
          <View style={styles.cartContainer}>
            {cart.map((item) => {
              const finalPrice = getProductFinalPrice(item)
              const hasSpecialPrice = selectedCustomer && customerSpecialPrices.has(String(item.id))

              return (
                <CartItem
                  key={item.id}
                  item={{
                    ...item,
                    special_price: hasSpecialPrice ? finalPrice : null,
                    has_special_price: !!hasSpecialPrice,
                  }}
                  onPress={() => handleQuantityEdit(item)}
                  onDecrease={(e) => {
                    e.stopPropagation()
                    updateQuantity(item.id, -1)
                  }}
                  onIncrease={(e) => {
                    e.stopPropagation()
                    updateQuantity(item.id, 1)
                  }}
                  formatCurrency={formatCurrency}
                />
              )
            })}

            {/* Notes */}
            <View style={styles.notesCard}>
              <View style={styles.notesHeader}>
                <Ionicons name="document-text-outline" size={18} color="#6b7280" />
                <Text style={styles.notesLabel}>Ghi chú đơn hàng</Text>
              </View>
              <TextInput
                style={styles.notesInput}
                placeholder="Thêm ghi chú cho đơn hàng (tùy chọn)..."
                placeholderTextColor="#9ca3af"
                value={orderNotes}
                onChangeText={setOrderNotes}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                maxLength={500}
              />
              {orderNotes.length > 0 && (
                <Text style={styles.notesCount}>{orderNotes.length}/500</Text>
              )}
            </View>

            {/* Pricing Summary */}
            <View style={styles.totalCard}>
              {/* Subtotal */}
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tạm tính</Text>
                <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
              </View>

              {/* Gift Section */}
              <GiftSection
                giftItems={giftItems}
                products={products}
                onRemoveManualGift={handleRemoveManualGift}
                onAddManualGift={handleAddManualGift}
                formatCurrency={formatCurrency}
              />

              {/* Discount Section */}
              <DiscountSection
                discountType={discountType}
                discountValue={discountValue}
                discountAmount={discount_amount}
                discountNotes={discountNotes}
                subtotal={subtotal}
                onDiscountTypeChange={setDiscountType}
                onDiscountValueChange={handleDiscountValueChange}
                onDiscountNotesChange={setDiscountNotes}
                formatCurrency={formatCurrency}
              />

              {/* Final Total */}
              <View style={styles.finalTotalRow}>
                <Text style={styles.finalTotalLabel}>Tổng cộng</Text>
                <Text style={styles.finalTotalAmount}>{formatCurrency(total_amount)}</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Bar - Compact Product Selection */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.compactProductButton}
          onPress={() => setShowProductSheet(true)}
        >
          <Ionicons name="grid" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.quickSearchWrapper}>
          <View style={styles.quickSearchContainer}>
            <Ionicons name="search" size={20} color="#9ca3af" />
            <TextInput
              style={styles.quickSearchInput}
              placeholder="Tìm sản phẩm nhanh..."
              value={quickSearchQuery}
              onChangeText={setQuickSearchQuery}
              onBlur={() => {
                setTimeout(() => {
                  setShowQuickSearchResults(false)
                }, 200)
              }}
              placeholderTextColor="#9ca3af"
            />
            {quickSearchQuery.length > 0 && (
              <TouchableOpacity onPress={() => {
                setQuickSearchQuery('')
                setShowQuickSearchResults(false)
              }}>
                <Ionicons name="close-circle" size={20} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>
          
          {/* Quick Search Results */}
          {showQuickSearchResults && (
            <View style={styles.quickSearchResults}>
              {quickSearchResults.length > 0 ? (
                quickSearchResults.map((product) => {
                  const hasSpecialPrice = selectedCustomer && customerSpecialPrices.has(String(product.id))
                  const finalPrice = hasSpecialPrice ? customerSpecialPrices.get(String(product.id))! : product.price

                  return (
                    <TouchableOpacity
                      key={product.id}
                      style={styles.quickSearchResultItem}
                      onPress={() => {
                        addToCart(product)
                      }}
                    >
                      {product.image_url ? (
                        <Image
                          source={{ uri: product.image_url }}
                          style={styles.quickResultImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={styles.quickResultIcon}>
                          <Ionicons name="cube" size={20} color="#175ead" />
                        </View>
                      )}
                      <View style={styles.quickResultInfo}>
                        <Text style={styles.quickResultName} numberOfLines={1}>
                          {product.name}
                        </Text>
                        <View style={styles.quickResultMeta}>
                          {hasSpecialPrice ? (
                            <>
                              <Text style={styles.quickResultOrigPrice}>{formatCurrency(product.price)}</Text>
                              <Text style={styles.quickResultPrice}>{formatCurrency(finalPrice)}</Text>
                              <View style={styles.quickResultSpecialBadge}>
                                <Text style={styles.quickResultSpecialBadgeText}>Ưu đãi</Text>
                              </View>
                            </>
                          ) : (
                            <>
                              <Text style={styles.quickResultPrice}>
                                {formatCurrency(product.price)}
                              </Text>
                              <Text style={styles.quickResultStock}>
                                • Còn: {product.stock}
                              </Text>
                            </>
                          )}
                        </View>
                      </View>
                      <Ionicons name="add-circle" size={24} color="#175ead" />
                    </TouchableOpacity>
                  )
                })
              ) : (
                <View style={styles.quickSearchEmpty}>
                  <Text style={styles.quickSearchEmptyText}>
                    Không tìm thấy sản phẩm
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>

      {/* Product Sheet Modal */}
      <Modal
        visible={showProductSheet}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowProductSheet(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setShowProductSheet(false)}
          />
          <View style={styles.productSheet}>
            {/* Header */}
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Chọn sản phẩm ({products.length})</Text>
              <TouchableOpacity onPress={() => setShowProductSheet(false)}>
                <Ionicons name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>

            {/* Product Grid Component */}
            <ProductGrid
              products={filteredProducts}
              categories={categories}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              onAddToCart={addToCart}
              formatCurrency={formatCurrency}
            />
          </View>
        </View>
      </Modal>

      {/* Order Confirmation Modal */}
      <OrderConfirmModal
        visible={showConfirmModal}
        customerName={selectedCustomer?.full_name || null}
        cartItems={cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          special_price: customerSpecialPrices.has(String(item.id)) ? getProductFinalPrice(item) : null,
          has_special_price: customerSpecialPrices.has(String(item.id)),
          unit: item.unit,
        }))}
        giftItems={giftItems}
        subtotal={subtotal}
        discountType={discountValue > 0 ? discountType : null}
        discountValue={discountValue}
        discountAmount={discount_amount}
        finalAmount={total_amount}
        isCreating={isCreatingOrder}
        onConfirm={handleConfirmOrder}
        onCancel={() => setShowConfirmModal(false)}
        formatCurrency={formatCurrency}
      />

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccessModal}
        title="Đơn hàng đã tạo!"
        message={`Đơn hàng nháp đã được tạo thành công với tổng giá trị ${formatCurrency(total_amount)}`}
        onClose={handleCloseSuccessModal}
        primaryButton={{
          text: 'Xem đơn hàng',
          onPress: handleViewOrder
        }}
        secondaryButton={{
          text: 'Tạo đơn mới',
          onPress: handleCreateAnother
        }}
      />

      {/* Quantity Edit Modal */}
      <QuantityModal
        visible={showQuantityModal}
        item={editingItem}
        tempQuantity={tempQuantity}
        onTempQuantityChange={setTempQuantity}
        onSubmit={handleQuantitySubmit}
        onDelete={() => {
          if (editingItem) {
            updateQuantity(editingItem.id, -editingItem.quantity)
          }
          setShowQuantityModal(false)
          setEditingItem(null)
        }}
        onClose={() => {
          setShowQuantityModal(false)
          setEditingItem(null)
          setTempQuantity('')
        }}
        formatCurrency={formatCurrency}
      />
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f0f9ff',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  doneButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  doneButtonDisabled: {
    opacity: 0.5,
  },
  doneButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#175ead',
  },
  doneButtonTextDisabled: {
    color: '#9ca3af',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  showAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#175ead',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  cartContainer: {
    gap: 12,
  },
  notesCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  notesInput: {
    fontSize: 14,
    color: '#111827',
    minHeight: 72,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 10,
    lineHeight: 20,
  },
  notesCount: {
    fontSize: 11,
    color: '#9ca3af',
    textAlign: 'right',
    marginTop: 4,
  },
  totalCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  finalTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
  },
  finalTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  finalTotalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  compactProductButton: {
    width: 56,
    height: 56,
    backgroundColor: '#175ead',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#175ead',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  quickSearchWrapper: {
    flex: 1,
    position: 'relative',
  },
  quickSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  quickSearchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  quickSearchResults: {
    position: 'absolute',
    bottom: 64,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    maxHeight: 300,
  },
  quickSearchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  quickResultIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#dbeafe',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickResultImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  quickResultInfo: {
    flex: 1,
  },
  quickResultName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  quickResultMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quickResultPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: '#175ead',
  },
  quickResultOrigPrice: {
    fontSize: 11,
    color: '#9ca3af',
    textDecorationLine: 'line-through',
  },
  quickResultSpecialBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  quickResultSpecialBadgeText: {
    fontSize: 8,
    fontWeight: '600',
    color: '#1d4ed8',
  },
  quickResultStock: {
    fontSize: 12,
    color: '#6b7280',
  },
  quickSearchEmpty: {
    padding: 16,
    alignItems: 'center',
  },
  quickSearchEmptyText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  productSheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '82%',
    overflow: 'hidden',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  productCard: {
    width: '31%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f3f4f6',
  },
  productIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#dbeafe',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  productName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#175ead',
    marginBottom: 2,
  },
  productSpecialPriceRow: {
    alignItems: 'center',
    gap: 2,
    marginBottom: 2,
  },
  productOrigPrice: {
    fontSize: 9,
    color: '#9ca3af',
    textDecorationLine: 'line-through',
  },
  productSpecialPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  productSpecialPrice: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#175ead',
  },
  productSpecialBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 3,
    paddingVertical: 0.5,
    borderRadius: 3,
  },
  productSpecialBadgeText: {
    fontSize: 7,
    fontWeight: '600',
    color: '#1d4ed8',
  },
  productStock: {
    fontSize: 10,
    color: '#6b7280',
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: '#175ead',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  categoryTextActive: {
    color: 'white',
  },
  toast: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: '#10b981',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  toastText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
})
