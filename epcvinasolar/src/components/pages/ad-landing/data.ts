/**
 * Landing Page Data - Real Combos & Projects from Content Collection
 */

export interface Combo {
  title: string;
  slug: string;
  system_type: 'on-grid' | 'hybrid';
  phase: string;
  power_kw: number;
  battery_kwh?: number;
  investment_million_vnd: number;
  production_min_kwh: number;
  production_max_kwh: number;
  payback_years: number;
  payback_label: string;
  roof_area_m2?: number;
}

export interface Project {
  title: string;
  customer: string;
  capacity: string;
  system_type: string;
  location: string;
  completion_date: string;
  annual_savings_vnd?: number;
  payback_years?: number;
  testimonial?: {
    quote: string;
    rating: number;
    aspect: string;
  };
  image: string;
  is_featured: boolean;
}

export const POPULAR_COMBOS: Combo[] = [
  {
    title: 'On-Grid 5 kWp 1 pha',
    slug: 'on-grid-5kw-1pha',
    system_type: 'on-grid',
    phase: '1-phase',
    power_kw: 5,
    investment_million_vnd: 60,
    production_min_kwh: 350,
    production_max_kwh: 450,
    payback_years: 4.25,
    payback_label: '4 năm 3 tháng',
  },
  {
    title: 'Hy-Brid 8.8 kWp 1pha – 10.24 kWh',
    slug: 'hybrid-8.8kw-1pha-10kwh',
    system_type: 'hybrid',
    phase: '1-phase',
    power_kw: 8.75,
    battery_kwh: 10.24,
    investment_million_vnd: 148.3,
    production_min_kwh: 700,
    production_max_kwh: 1000,
    payback_years: 4.83,
    payback_label: '4 năm 10 tháng',
    roof_area_m2: 37.8,
  },
  {
    title: 'Hy-Brid 5 kWp 1pha – 10 kWh',
    slug: 'hybrid-5kw-1pha-10kwh',
    system_type: 'hybrid',
    phase: '1-phase',
    power_kw: 5,
    battery_kwh: 10,
    investment_million_vnd: 85,
    production_min_kwh: 400,
    production_max_kwh: 500,
    payback_years: 4.5,
    payback_label: '4 năm 6 tháng',
    roof_area_m2: 25,
  },
  {
    title: 'On-Grid 8.8 kWp 1 pha',
    slug: 'on-grid-8.8kw-1pha',
    system_type: 'on-grid',
    phase: '1-phase',
    power_kw: 8.8,
    investment_million_vnd: 105,
    production_min_kwh: 700,
    production_max_kwh: 850,
    payback_years: 4.5,
    payback_label: '4 năm 6 tháng',
  },
  {
    title: 'Hy-Brid 10.7 kWp 1pha – 16 kWh',
    slug: 'hybrid-10.7kw-1pha-16kwh',
    system_type: 'hybrid',
    phase: '1-phase',
    power_kw: 10.7,
    battery_kwh: 16,
    investment_million_vnd: 219,
    production_min_kwh: 900,
    production_max_kwh: 1100,
    payback_years: 5.2,
    payback_label: '5 năm 2 tháng',
    roof_area_m2: 45,
  },
];

export const FEATURED_PROJECTS: Project[] = [
  {
    title: 'Dự án 15 kWp - Chị Hà Hà Đông',
    customer: 'Chị Hà',
    capacity: '15 kWp',
    system_type: 'Hybrid',
    location: 'Hà Đông - Hà Nội',
    completion_date: 'T7.2024',
    annual_savings_vnd: 45000000,
    payback_years: 3.5,
    testimonial: {
      quote: 'Từ khi lắp điện mặt trời, hóa đơn điện giảm hẳn. Buổi tối có pin lưu trữ nên không lo mất điện. Đội ngũ thi công chuyên nghiệp, nhiệt tình.',
      rating: 5,
      aspect: 'Tiết kiệm chi phí & Dịch vụ tốt',
    },
    image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&q=80',
    is_featured: true,
  },
  {
    title: 'Dự án 22 kWp - Chú Thanh Hải Dương',
    customer: 'Chú Thanh',
    capacity: '22 kWp',
    system_type: 'Hybrid',
    location: 'TP. Hải Dương',
    completion_date: 'T6.2024',
    testimonial: {
      quote: 'Công trình phức tạp nhưng đội ngũ thi công rất chuyên nghiệp. Lắp trên cao 6m mà vẫn an toàn, nhanh chóng. Giờ không lo mất điện với 20kWh pin lưu trữ!',
      rating: 5,
      aspect: 'Thi công phức tạp & Chuyên nghiệp',
    },
    image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&q=80',
    is_featured: true,
  },
  {
    title: 'Dự án 7.5 kWp - Anh Linh Dương Nội',
    customer: 'Anh Linh',
    capacity: '7.5 kWp',
    system_type: 'Hybrid',
    location: 'Dương Nội - Hà Nội',
    completion_date: 'T9.2024',
    image: 'https://images.unsplash.com/photo-1611365892117-00d741f29fc0?w=800&q=80',
    is_featured: false,
  },
  {
    title: 'Dự án 6.5 kWp - Anh Tùng Tây Tựu',
    customer: 'Anh Tùng',
    capacity: '6.5 kWp',
    system_type: 'Hybrid',
    location: 'Tây Tựu - Hà Nội',
    completion_date: 'T12.2024',
    image: 'https://images.unsplash.com/photo-1508514170780-25e970e0094a?w=800&q=80',
    is_featured: false,
  },
];

export const FAQ_DATA = [
  { q: 'Điện mặt trời có hiệu quả không?', a: 'Có. Trung bình giảm 70-85% hóa đơn điện. Hệ thống hoạt động 25-30 năm, hoàn vốn trong 3-5 năm.' },
  { q: 'Nhà tôi có phù hợp không?', a: 'Hầu hết các mái nhà đều lắp được. Chúng tôi khảo sát miễn phí để đánh giá chính xác.' },
  { q: 'Bao lâu hoàn vốn?', a: 'Trung bình 3-5 năm cho On-Grid, 5-7 năm cho Hybrid. Sau đó sử dụng điện miễn phí 20+ năm.' },
  { q: 'Mất điện có dùng được không?', a: 'Hệ On-Grid sẽ ngắt khi mất điện (an toàn). Hệ Hybrid có pin lưu trữ nên vẫn dùng được.' },
  { q: 'Có thể sạc xe điện không?', a: 'Có. Chúng tôi tích hợp EV Charger vào hệ Hybrid, sạc miễn phí từ năng lượng mặt trời.' },
  { q: 'Mưa nhiều có đủ điện không?', a: 'Tấm pin vẫn sản xuất điện khi mưa (giảm 10-20%). Hệ thống được thiết kế dựa trên dữ liệu thời tiết địa phương.' },
  { q: 'Có phải bảo trì thường xuyên không?', a: 'Không. Chỉ cần vệ sinh tấm pin 2-4 lần/năm. Chúng tôi bảo hành 25 năm hiệu suất.' },
  { q: '15 kWp phù hợp với đối tượng nào?', a: 'Phù hợp gia đình sử dụng điện 3-5 triệu/tháng, diện tích mái 80-100m2, muốn tiết kiệm 70-90% hóa đơn điện.' },
  { q: 'Pin lưu trữ có cần thiết không?', a: 'Pin lưu trữ giúp dự phòng khi mất điện và sử dụng điện vào buổi tối. Đặc biệt hữu ích cho khu vực hay mất điện.' },
  { q: 'Bảo hành các thiết bị bao lâu?', a: 'Tấm pin bảo hành 25 năm hiệu suất, biến tần 5-10 năm, pin lưu trữ 5 năm. EPCVINA hỗ trợ kỹ thuật trọn đời.' },
  { q: 'Thi công có ảnh hưởng sinh hoạt không?', a: 'Không. Thi công nhanh 1-2 ngày, không ảnh hưởng đến sinh hoạt hàng ngày.' },
  { q: 'Có được hỗ trợ vay ngân hàng không?', a: 'Hiện tại chúng tôi không hỗ trợ trả góp. Khách hàng thanh toán theo tiến độ hợp đồng.' },
  { q: 'Hệ thống có tự động ngắt khi sự cố?', a: 'Có. Hệ thống có nhiều lớp bảo vệ: chống quá tải, chống đoản mạch, chống sét, tiếp địa an toàn.' },
  { q: 'Có thể mở rộng hệ thống sau này không?', a: 'Có. Hệ Hybrid cho phép thêm pin lưu trữ hoặc mở rộng tấm pin sau này.' },
  { q: 'Quy trình thanh toán như thế nào?', a: '30% đặt cọc, 40% khi giao thiết bị, 30% sau nghiệm thu. Minh bạch từng hạng mục.' },
];
