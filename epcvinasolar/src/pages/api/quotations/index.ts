import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    
    // Log quotation request (in production, send to email or external service)
    console.log('📋 New Quotation Request:', {
      name: body.name,
      phone: body.phone,
      email: body.email,
      province: body.province,
      system_type: body.system_type,
      monthly_bill: body.monthly_bill,
      timestamp: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Yêu cầu báo giá đã được ghi nhận. Nhân viên sẽ liên hệ bạn trong 24h.',
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('Quotation API error:', err);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Có lỗi xảy ra. Vui lòng thử lại.' 
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
