import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    
    // TODO: Send quotation request to email or external service

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
