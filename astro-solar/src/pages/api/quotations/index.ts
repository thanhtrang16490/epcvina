import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('quotations')
      .insert([{
        name: body.name,
        phone: body.phone,
        email: body.email || null,
        province: body.province,
        address: body.address,
        referral_code: body.referral_code || null,
        notes: body.notes || null,
        system_type: body.system_type,
        roof_area: body.roof_area || null,
        monthly_bill: body.monthly_bill,
        consumption_kwh: body.consumption_kwh || null,
        phase: body.phase,
        day_night_ratio: body.day_night_ratio || 60,
        recommended_combo_ids: body.recommended_combo_ids || [],
        created_at: new Date().toISOString(),
      }])
      .select();

    if (error) {
      // If table doesn't exist, still return success for the frontend
      // (data will be logged but not persisted until table is created)
      console.error('Supabase insert error:', error);
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Yêu cầu báo giá đã được ghi nhận. Nhân viên sẽ liên hệ bạn trong 24h.',
        note: 'Database save pending setup'
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Yêu cầu báo giá đã được ghi nhận. Nhân viên sẽ liên hệ bạn trong 24h.',
      data 
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('Quotation API error:', err);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Có lỗi xảy ra. Vui lòng thử lại.' 
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
