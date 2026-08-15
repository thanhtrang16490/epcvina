export const locales = ['vi', 'en', 'zh', 'ja', 'ko'] as const;

export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, string> = {
  vi: 'VI',
  en: 'EN',
  zh: '中文',
  ja: '日本語',
  ko: '한국어',
};

export const localeNames: Record<Locale, string> = {
  vi: 'Tiếng Việt',
  en: 'English',
  zh: '中文',
  ja: '日本語',
  ko: '한국어',
};

type Messages = {
  nav: {
    home: string;
    solarHome: string;
    hybridBess: string;
    solarCi: string;
    charging: string;
    maintenance: string;
    capabilityProfile: string;
    contact: string;
    quote: string;
  };
  header: {
    more: string;
    toggleMenu: string;
    quoteShort: string;
  };
  home: {
    heroBadge: string;
    heroTitle1: string;
    heroTitle2: string;
    heroLead: string;
    heroSub: string;
    heroStat1: string;
    heroStat2: string;
    heroStat3: string;
    heroCtaCalc: string;
    heroCtaSolarCi: string;
    compareLabel: string;
    compareTitlePrefix: string;
    compareTitleSuffix: string;
    compareDesc: string;
    hybridLabel: string;
    onGridLabel: string;
    hybridPill: string;
    onGridPill: string;
    hybridPoints: [string, string, string, string, string];
    onGridPoints: [string, string, string, string, string];
    compareCtaHybrid: string;
    compareCtaHome: string;
    benefitsLabel: string;
    benefitsTitle: string;
    benefitsLead: string;
    processLabel: string;
    processTitle: string;
    processLead: string;
    reviewsTitle: string;
    reviewsLead: string;
    reviewsCta: string;
    faqTitle: string;
    faqLead: string;
    faqMore: string;
    ctaLabel: string;
    ctaTitle: string;
    ctaLead: string;
    ctaName: string;
    ctaPhone: string;
    ctaAddress: string;
    ctaBill: string;
    ctaNeed: string;
    ctaNeedPlaceholder: string;
    ctaSubmit: string;
    ctaSending: string;
    ctaSuccessTitle: string;
    ctaSuccessLead: string;
  };
  footer: {
    products: string;
    services: string;
    policies: string;
    solarHome: string;
    allCombos: string;
    onGridCombo: string;
    hybridCombo: string;
    solarModules: string;
    hybridInverter: string;
    bessBattery: string;
    calculator: string;
    office: string;
    privacy: string;
    terms: string;
    contact: string;
    consultant: string;
    technical: string;
    address: string;
    salesContactName: string;
    technicalContactName: string;
    aboutText: string;
    servicesLine: string;
    requestQuote: string;
    hybridBess: string;
    solarCi: string;
    news: string;
    paymentPolicy: string;
    warrantyPolicy: string;
    returnsPolicy: string;
    deliveryPolicy: string;
    copyright: string;
    legalName: string;
    businessRegistration: string;
    quickQuote: string;
  };
};

export const messages: Record<Locale, Messages> = {
  vi: {
    home: {
      heroBadge: 'Solar Home · Hybrid BESS · EV Charger',
      heroTitle1: 'Điện Mặt Trời Trọn Gói',
      heroTitle2: 'Cho Gia Đình, Công Nghiệp & EV',
      heroLead: 'Khảo sát 0đ, thiết kế theo nhu cầu thật và dẫn đúng lộ trình cho Solar Home, Solar C&I, Hybrid BESS và sạc EV.',
      heroSub: 'Thiết kế, thi công và bảo trì trọn gói theo tiêu chuẩn an toàn, bền vững.',
      heroStat1: 'Khảo sát 0đ',
      heroStat2: 'Thi công chuẩn',
      heroStat3: 'Bảo hành dài hạn',
      heroCtaCalc: 'Tính nhanh hiệu quả đầu tư',
      heroCtaSolarCi: 'Khám phá Solar C&I',
      compareLabel: 'Chọn hệ thống phù hợp',
      compareTitlePrefix: 'Hybrid',
      compareTitleSuffix: 'On-Grid',
      compareDesc: 'Thiết kế hệ thống điện mặt trời tối ưu theo nhu cầu sử dụng thực tế — giúp giảm chi phí điện và tối đa hiệu quả đầu tư.',
      hybridLabel: 'Có pin lưu trữ',
      onGridLabel: 'Hòa lưới trực tiếp',
      hybridPill: 'CÓ PIN LƯU TRỮ',
      onGridPill: 'HÒA LƯỚI TRỰC TIẾP',
      hybridPoints: ['Tích trữ điện để sử dụng khi cần', 'Duy trì nguồn điện khi mất lưới', 'Tối ưu tỷ lệ điện tự dùng', 'Đầu tư ban đầu cao hơn', 'Hoàn vốn dự kiến 5–7 năm'],
      onGridPoints: ['Không sử dụng pin lưu trữ', 'Vận hành đồng bộ với điện lưới', 'Chi phí đầu tư thấp hơn', 'Hiệu quả kinh tế, hoàn vốn nhanh', 'Hoàn vốn dự kiến 3–4 năm'],
      compareCtaHybrid: 'Xem Hybrid BESS',
      compareCtaHome: 'Xem Solar Home',
      benefitsLabel: 'Tại sao chọn EPCVINA Solar',
      benefitsTitle: 'Lợi Thế EPCVINA Solar',
      benefitsLead: 'Khác với các đơn vị lắp đặt thông thường, EPCVINA xuất phát từ nền tảng nhà thầu cơ điện (MEP) với hơn 10 năm kinh nghiệm trong lĩnh vực điện, nước, phòng cháy chữa cháy và điều hòa không khí. Chúng tôi không chỉ lắp đặt điện mặt trời — chúng tôi thiết kế, tính toán kỹ thuật, thi công an toàn và bảo trì dài hạn theo tiêu chuẩn cơ điện chuyên nghiệp.',
      processLabel: 'Quy trình triển khai',
      processTitle: '6 Bước Từ Tư Vấn Đến Vận Hành',
      processLead: 'Quy trình làm việc chuyên nghiệp, minh bạch và chuẩn cơ điện — từ lần liên hệ đầu tiên đến khi hệ thống vận hành ổn định.',
      reviewsTitle: 'Khách hàng nói gì về chúng tôi?',
      reviewsLead: 'Hơn 200+ công trình đã tin tưởng lắp đặt',
      reviewsCta: 'Trở thành khách hàng tiếp theo',
      faqTitle: 'Hỏi đáp',
      faqLead: 'Những câu hỏi thường gặp về điện mặt trời',
      faqMore: 'Tìm hiểu thêm',
      ctaLabel: 'Đăng ký tư vấn miễn phí',
      ctaTitle: 'Xem chi tiết Sơ Bộ Ngay Hôm Nay',
      ctaLead: 'Điền thông tin bên dưới — đội kỹ sư EPCVINA Solar sẽ liên hệ tư vấn và khảo sát miễn phí trong 24h.',
      ctaName: 'Họ và tên',
      ctaPhone: 'Số điện thoại',
      ctaAddress: 'Địa chỉ lắp đặt',
      ctaBill: 'Tiền điện trung bình/tháng',
      ctaNeed: 'Nhu cầu',
      ctaNeedPlaceholder: 'Chọn nhu cầu...',
      ctaSubmit: 'Đăng ký tư vấn miễn phí',
      ctaSending: 'Đang gửi...',
      ctaSuccessTitle: 'Đã nhận thông tin!',
      ctaSuccessLead: 'Cảm ơn bạn đã đăng ký. Chúng tôi sẽ liên hệ trong vòng 24 giờ để tư vấn và sắp xếp khảo sát miễn phí.',
    },
    nav: {
      home: 'Trang chủ',
      solarHome: 'Solar Home',
      hybridBess: 'Hybrid BESS',
      solarCi: 'Solar C&I',
      charging: 'Trạm sạc',
      maintenance: 'Bảo trì',
      capabilityProfile: 'Hồ sơ năng lực',
      contact: 'Liên hệ',
      quote: 'Nhận Báo Giá',
    },
    header: {
      more: 'Khác',
      toggleMenu: 'Mở menu',
      quoteShort: 'Báo giá',
    },
    footer: {
      products: 'Sản phẩm',
      services: 'Dịch vụ',
      policies: 'Chính sách',
      solarHome: 'Solar Home',
      allCombos: 'Tất cả combo',
      onGridCombo: 'Combo On-Grid',
      hybridCombo: 'Combo Hybrid',
      solarModules: 'Tấm quang năng',
      hybridInverter: 'Biến tần Hybrid',
      bessBattery: 'Pin lưu trữ BESS',
      calculator: 'Công cụ tính toán',
      office: 'Văn phòng',
      privacy: 'Chính sách bảo mật',
      terms: 'Điều khoản sử dụng',
      contact: 'Liên hệ',
      consultant: 'Phụ trách tư vấn',
      technical: 'Phụ trách kỹ thuật',
      address: 'Phòng 315, Khu thương mại – Chung cư Học viện Quốc phòng, Đường Xuân Tảo, Q. Tây Hồ, Hà Nội',
      salesContactName: 'Ms. Giang',
      technicalContactName: 'Mr. Thái',
      aboutText: 'Điện mặt trời an toàn từ chuyên gia cơ điện.',
      servicesLine: 'Tư vấn · Thiết kế · Lắp đặt · Bảo trì',
      requestQuote: 'Nhận báo giá',
      hybridBess: 'Hybrid & BESS',
      solarCi: 'Solar C&I',
      news: 'Tin tức',
      paymentPolicy: 'Chính sách thanh toán',
      warrantyPolicy: 'Chính sách bảo hành',
      returnsPolicy: 'Chính sách đổi trả',
      deliveryPolicy: 'Chính sách giao nhận',
      copyright: 'All rights reserved.',
      legalName: 'CÔNG TY CỔ PHẦN XÂY LẮP EPC VIỆT NAM (EPC VINA.,JSC)',
      businessRegistration: 'Giấy chứng nhận đăng ký doanh nghiệp số 0105313377 do Sở Kế hoạch và Đầu tư Thành phố Hà Nội cấp ngày 17/05/2011.',
      quickQuote: 'Báo giá nhanh',
    },
  },
  en: {
    home: {
      heroBadge: 'Solar Home · Hybrid BESS · EV Charger',
      heroTitle1: 'Turnkey Solar Power',
      heroTitle2: 'For Homes, Industry & EV',
      heroLead: 'Free site survey, solution-first design, and the right path for Solar Home, Solar C&I, Hybrid BESS, and EV charging.',
      heroSub: 'Design, installation, and maintenance delivered end-to-end with safety and durability in mind.',
      heroStat1: 'Free survey',
      heroStat2: 'Professional build',
      heroStat3: 'Long-term warranty',
      heroCtaCalc: 'Calculate ROI fast',
      heroCtaSolarCi: 'Explore Solar C&I',
      compareLabel: 'Choose the right system',
      compareTitlePrefix: 'Hybrid',
      compareTitleSuffix: 'On-Grid',
      compareDesc: 'We design solar systems around real usage needs to cut electricity costs and maximize investment efficiency.',
      hybridLabel: 'With battery storage',
      onGridLabel: 'Direct grid tie',
      hybridPill: 'BATTERY STORAGE',
      onGridPill: 'GRID-TIED',
      hybridPoints: ['Store power for later use', 'Keep power during outages', 'Maximize self-consumption', 'Higher upfront investment', 'Estimated payback 5–7 years'],
      onGridPoints: ['No battery storage required', 'Runs in sync with the grid', 'Lower upfront investment', 'Strong economics, faster payback', 'Estimated payback 3–4 years'],
      compareCtaHybrid: 'View Hybrid BESS',
      compareCtaHome: 'View Solar Home',
      benefitsLabel: 'Why choose EPCVINA Solar',
      benefitsTitle: 'EPCVINA Solar Advantages',
      benefitsLead: 'Unlike ordinary installers, EPCVINA comes from an MEP contractor background with 10+ years in electrical, plumbing, fire protection, and HVAC work. We do not just install solar systems; we engineer, execute safely, and support them long-term.',
      processLabel: 'Delivery process',
      processTitle: '6 Steps From Consultation to Operation',
      processLead: 'A professional, transparent, and MEP-standard workflow from the first contact until stable operation.',
      reviewsTitle: 'What customers say about us',
      reviewsLead: 'More than 200 projects have trusted EPCVINA',
      reviewsCta: 'Become our next customer',
      faqTitle: 'FAQ',
      faqLead: 'Common questions about solar power',
      faqMore: 'Learn more',
      ctaLabel: 'Free consultation signup',
      ctaTitle: 'Get a quick overview today',
      ctaLead: 'Fill in the form below and EPCVINA Solar engineers will contact you for free consultation and survey within 24 hours.',
      ctaName: 'Full name',
      ctaPhone: 'Phone number',
      ctaAddress: 'Installation address',
      ctaBill: 'Average monthly bill',
      ctaNeed: 'Need',
      ctaNeedPlaceholder: 'Choose your need...',
      ctaSubmit: 'Register for free consultation',
      ctaSending: 'Sending...',
      ctaSuccessTitle: 'Information received!',
      ctaSuccessLead: 'Thank you for signing up. We will contact you within 24 hours to consult and arrange a free survey.',
    },
    nav: {
      home: 'Home',
      solarHome: 'Solar Home',
      hybridBess: 'Hybrid BESS',
      solarCi: 'Solar C&I',
      charging: 'EV Charging',
      maintenance: 'Maintenance',
      capabilityProfile: 'Company Profile',
      contact: 'Contact',
      quote: 'Get Quote',
    },
    header: {
      more: 'More',
      toggleMenu: 'Toggle menu',
      quoteShort: 'Quote',
    },
    footer: {
      products: 'Products',
      services: 'Services',
      policies: 'Policies',
      solarHome: 'Solar Home',
      allCombos: 'All packages',
      onGridCombo: 'On-Grid package',
      hybridCombo: 'Hybrid package',
      solarModules: 'Solar modules',
      hybridInverter: 'Hybrid inverter',
      bessBattery: 'BESS battery',
      calculator: 'Calculator',
      office: 'Office',
      privacy: 'Privacy Policy',
      terms: 'Terms of Use',
      contact: 'Contact',
      consultant: 'Sales Contact',
      technical: 'Technical Contact',
      address: 'Room 315, Commercial Area - National Defense Academy Apartment, Xuan Tao Street, Tay Ho District, Hanoi',
      salesContactName: 'Ms. Giang',
      technicalContactName: 'Mr. Thai',
      aboutText: 'Safe solar power from MEP experts.',
      servicesLine: 'Consulting · Design · Installation · Maintenance',
      requestQuote: 'Get Quote',
      hybridBess: 'Hybrid & BESS',
      solarCi: 'Solar C&I',
      news: 'Blog',
      paymentPolicy: 'Payment Policy',
      warrantyPolicy: 'Warranty Policy',
      returnsPolicy: 'Returns Policy',
      deliveryPolicy: 'Delivery Policy',
      copyright: 'All rights reserved.',
      legalName: 'EPC VIET NAM CONSTRUCTION JOINT STOCK COMPANY (EPC VINA.,JSC)',
      businessRegistration: 'Enterprise registration certificate No. 0105313377 issued by the Hanoi Department of Planning and Investment on May 17, 2011.',
      quickQuote: 'Quick quote',
    },
  },
  zh: {
    home: { heroBadge: '家庭光伏 · 混合储能 · EV充电', heroTitle1: '交钥匙太阳能方案', heroTitle2: '面向家庭、工商业与EV', heroLead: '提供免费勘察、以方案为先的设计，并为家庭光伏、工商业光伏、混合储能与EV充电匹配合适路径。', heroSub: '从设计、施工到维护，全流程以安全与耐久为目标。', heroStat1: '免费勘察', heroStat2: '专业施工', heroStat3: '长期质保', heroCtaCalc: '快速测算收益', heroCtaSolarCi: '了解工商业光伏', compareLabel: '选择合适的系统', compareTitlePrefix: '混合储能', compareTitleSuffix: '并网', compareDesc: '我们依据真实用电需求设计光伏系统，帮助降低电费并提升投资效率。', hybridLabel: '带储能电池', onGridLabel: '直接并网', hybridPill: '带储能电池', onGridPill: '直接并网', hybridPoints: ['储电供后续使用', '停电时持续供电', '提升自用率', '前期投入较高', '预计回本 5–7 年'], onGridPoints: ['无需储能电池', '与电网同步运行', '前期投入更低', '经济性更好，回本更快', '预计回本 3–4 年'], compareCtaHybrid: '查看混合储能', compareCtaHome: '查看家庭光伏', benefitsLabel: '为什么选择 EPCVINA Solar', benefitsTitle: 'EPCVINA Solar 优势', benefitsLead: '不同于普通安装商，EPCVINA 源自机电总包（MEP）背景，拥有 10+ 年电气、给排水、消防与空调经验。我们不仅安装光伏，更负责工程设计、安全施工与长期支持。', processLabel: '交付流程', processTitle: '从咨询到运行的 6 个步骤', processLead: '专业、透明、符合 MEP 标准的流程，从首次联系到系统稳定运行。', reviewsTitle: '客户怎么评价我们', reviewsLead: '200+ 项目选择 EPCVINA', reviewsCta: '成为下一位客户', faqTitle: '常见问题', faqLead: '关于太阳能的常见问题', faqMore: '了解更多', ctaLabel: '免费咨询报名', ctaTitle: '今天就获取简要方案', ctaLead: '填写下方信息，EPCVINA Solar 工程师将在 24 小时内联系您，提供免费咨询与勘察。', ctaName: '姓名', ctaPhone: '电话', ctaAddress: '安装地址', ctaBill: '月均电费', ctaNeed: '需求', ctaNeedPlaceholder: '请选择需求...', ctaSubmit: '免费咨询报名', ctaSending: '发送中...', ctaSuccessTitle: '已收到信息！', ctaSuccessLead: '感谢您的报名，我们将在 24 小时内联系您，安排免费咨询和勘察。' },
    nav: {
      home: '首页',
      solarHome: '家庭光伏',
      hybridBess: '混合储能',
      solarCi: '工商业光伏',
      charging: '充电桩',
      maintenance: '运维',
      capabilityProfile: '公司简介',
      contact: '联系',
      quote: '获取报价',
    },
    header: {
      more: '更多',
      toggleMenu: '切换菜单',
      quoteShort: '报价',
    },
    footer: {
      products: '产品',
      services: '服务',
      policies: '政策',
      solarHome: '家庭光伏',
      allCombos: '全部方案',
      onGridCombo: '并网方案',
      hybridCombo: '混合方案',
      solarModules: '光伏组件',
      hybridInverter: '混合逆变器',
      bessBattery: '储能电池',
      calculator: '计算器',
      office: '办公室',
      privacy: '隐私政策',
      terms: '使用条款',
      contact: '联系',
      consultant: '销售联系人',
      technical: '技术联系人',
      address: '河内市西湖郡春桃街国防学院公寓商业区315室',
      salesContactName: 'Ms. Giang',
      technicalContactName: 'Mr. Thai',
      aboutText: '由机电专家提供的安全太阳能解决方案。',
      servicesLine: '咨询 · 设计 · 安装 · 维护',
      requestQuote: '获取报价',
      hybridBess: '混合储能',
      solarCi: '工商业光伏',
      news: '新闻',
      paymentPolicy: '付款政策',
      warrantyPolicy: '保修政策',
      returnsPolicy: '退换政策',
      deliveryPolicy: '配送政策',
      copyright: '版权所有。',
      legalName: 'EPC越南建设股份公司（EPC VINA.,JSC）',
      businessRegistration: '企业登记证编号 0105313377，由河内市计划与投资局于 2011 年 5 月 17 日颁发。',
      quickQuote: '快速报价',
    },
  },
  ja: {
    home: { heroBadge: '住宅用太陽光 · ハイブリッド蓄電 · EV充電', heroTitle1: '太陽光の一括導入', heroTitle2: '住宅・産業・EV向け', heroLead: '無料現地調査、ニーズ起点の設計、住宅用太陽光・産業用太陽光・ハイブリッド蓄電・EV充電に最適な導入ルートをご提案します。', heroSub: '設計・施工・保守を一貫対応し、安全性と耐久性を重視します。', heroStat1: '無料調査', heroStat2: '専門施工', heroStat3: '長期保証', heroCtaCalc: '投資効果をすぐ試算', heroCtaSolarCi: '産業用太陽光を見る', compareLabel: '適切なシステムを選ぶ', compareTitlePrefix: 'ハイブリッド', compareTitleSuffix: '系統連系', compareDesc: '実際の使用状況に合わせて太陽光システムを設計し、電気代削減と投資効率の最大化を実現します。', hybridLabel: '蓄電池あり', onGridLabel: '系統連系', hybridPill: '蓄電池あり', onGridPill: '系統連系', hybridPoints: ['電力を蓄えて活用', '停電時も電源を維持', '自家消費率を最適化', '初期投資は高め', '想定回収 5–7年'], onGridPoints: ['蓄電池不要', '電力系統と連携運転', '初期投資が低い', '高い費用対効果と早い回収', '想定回収 3–4年'], compareCtaHybrid: 'ハイブリッド蓄電を見る', compareCtaHome: '住宅用太陽光を見る', benefitsLabel: 'EPCVINA Solar を選ぶ理由', benefitsTitle: 'EPCVINA Solar の強み', benefitsLead: '一般的な施工会社と異なり、EPCVINA は MEP 総合工事会社として 10年以上の電気・給排水・消防・空調の実績があります。私たちは単に設置するだけでなく、設計・安全施工・長期保守まで担います。', processLabel: '導入プロセス', processTitle: '相談から運用までの 6 ステップ', processLead: '初回連絡から安定稼働まで、プロフェッショナルで透明性のある MEP 標準フローです。', reviewsTitle: 'お客様の声', reviewsLead: '200件以上の実績がEPCVINAを選択', reviewsCta: '次の顧客になる', faqTitle: 'よくある質問', faqLead: '太陽光に関するよくある質問', faqMore: '詳しく見る', ctaLabel: '無料相談申込', ctaTitle: '本日、簡易プランを確認', ctaLead: '下記フォームにご入力ください。EPCVINA Solar の技術者が 24 時間以内にご連絡し、無料相談と現地調査を行います。', ctaName: '氏名', ctaPhone: '電話番号', ctaAddress: '設置住所', ctaBill: '月平均電気代', ctaNeed: 'ご要望', ctaNeedPlaceholder: 'ご要望を選択してください...', ctaSubmit: '無料相談に申し込む', ctaSending: '送信中...', ctaSuccessTitle: '情報を受け取りました！', ctaSuccessLead: 'ご登録ありがとうございます。24時間以内にご連絡し、無料相談と調査を手配します。' },
    nav: {
      home: 'ホーム',
      solarHome: '住宅用太陽光',
      hybridBess: 'ハイブリッド蓄電',
      solarCi: '産業用太陽光',
      charging: 'EV充電',
      maintenance: '保守',
      capabilityProfile: '会社概要',
      contact: 'お問い合わせ',
      quote: '見積依頼',
    },
    header: {
      more: 'その他',
      toggleMenu: 'メニューを切り替え',
      quoteShort: '見積',
    },
    footer: {
      products: '製品',
      services: 'サービス',
      policies: 'ポリシー',
      solarHome: '住宅用太陽光',
      allCombos: 'すべてのプラン',
      onGridCombo: '系統連系プラン',
      hybridCombo: 'ハイブリッドプラン',
      solarModules: '太陽光モジュール',
      hybridInverter: 'ハイブリッドインバーター',
      bessBattery: '蓄電池',
      calculator: '計算ツール',
      office: 'オフィス',
      privacy: 'プライバシーポリシー',
      terms: '利用規約',
      contact: 'お問い合わせ',
      consultant: '営業担当',
      technical: '技術担当',
      address: 'ハノイ市タイホー区スアンタオ通り 国防学院アパート 商業区315号室',
      salesContactName: 'Ms. Giang',
      technicalContactName: 'Mr. Thai',
      aboutText: 'MEP専門家による安全な太陽光発電。',
      servicesLine: 'ご相談 · 設計 · 施工 · 保守',
      requestQuote: '見積依頼',
      hybridBess: 'ハイブリッド蓄電',
      solarCi: '産業用太陽光',
      news: 'ニュース',
      paymentPolicy: '支払いポリシー',
      warrantyPolicy: '保証ポリシー',
      returnsPolicy: '返品ポリシー',
      deliveryPolicy: '配送ポリシー',
      copyright: 'All rights reserved.',
      legalName: 'EPCベトナム建設株式会社（EPC VINA.,JSC）',
      businessRegistration: '企業登録証番号 0105313377、2011年5月17日、ハノイ市計画投資局発行。',
      quickQuote: '見積を取得',
    },
  },
  ko: {
    home: { heroBadge: '가정용 태양광 · 하이브리드 ESS · EV 충전', heroTitle1: '태양광 턴키 솔루션', heroTitle2: '주택 · 산업 · EV용', heroLead: '무료 현장조사, 수요 중심 설계, 가정용 태양광·산업용 태양광·하이브리드 ESS·EV 충전에 적합한 도입 경로를 제안합니다.', heroSub: '설계, 시공, 유지보수를 일괄 제공하며 안전성과 내구성을 중시합니다.', heroStat1: '무료 조사', heroStat2: '전문 시공', heroStat3: '장기 보증', heroCtaCalc: '투자효율 빠르게 계산', heroCtaSolarCi: '산업용 태양광 보기', compareLabel: '적합한 시스템 선택', compareTitlePrefix: '하이브리드', compareTitleSuffix: '온그리드', compareDesc: '실제 사용 패턴에 맞춰 태양광 시스템을 설계해 전기요금을 줄이고 투자효율을 높입니다.', hybridLabel: '배터리 포함', onGridLabel: '계통연계', hybridPill: '배터리 포함', onGridPill: '계통연계', hybridPoints: ['전력을 저장해 활용', '정전 시에도 전원 유지', '자가소비율 최적화', '초기 투자비가 높음', '예상 회수 5–7년'], onGridPoints: ['배터리 불필요', '전력망과 연동 운영', '초기 투자비 낮음', '경제성이 높고 회수 빠름', '예상 회수 3–4년'], compareCtaHybrid: '하이브리드 ESS 보기', compareCtaHome: '가정용 태양광 보기', benefitsLabel: '왜 EPCVINA Solar인가', benefitsTitle: 'EPCVINA Solar의 강점', benefitsLead: '일반 시공업체와 달리 EPCVINA는 MEP 종합공사 배경을 가진 회사로 10년 이상의 전기·배관·소방·공조 경험을 보유하고 있습니다. 단순 설치가 아니라 설계, 안전 시공, 장기 유지보수까지 책임집니다.', processLabel: '진행 절차', processTitle: '상담에서 운영까지 6단계', processLead: '첫 문의부터 안정 운영까지, 전문적이고 투명한 MEP 표준 프로세스입니다.', reviewsTitle: '고객이 말하는 EPCVINA', reviewsLead: '200건 이상의 실적이 EPCVINA를 선택하게 합니다', reviewsCta: '다음 고객이 되기', faqTitle: '자주 묻는 질문', faqLead: '태양광 관련 자주 묻는 질문', faqMore: '더 보기', ctaLabel: '무료 상담 신청', ctaTitle: '오늘 간단한 제안을 받아보세요', ctaLead: '아래 정보를 입력하시면 EPCVINA Solar 엔지니어가 24시간 내 연락드려 무료 상담과 현장조사를 진행합니다.', ctaName: '이름', ctaPhone: '전화번호', ctaAddress: '설치 주소', ctaBill: '월 평균 전기요금', ctaNeed: '요구사항', ctaNeedPlaceholder: '요구사항을 선택하세요...', ctaSubmit: '무료 상담 신청', ctaSending: '전송 중...', ctaSuccessTitle: '정보를 받았습니다!', ctaSuccessLead: '신청해 주셔서 감사합니다. 24시간 내 연락드려 무료 상담과 조사를 진행합니다.' },
    nav: {
      home: '홈',
      solarHome: '가정용 태양광',
      hybridBess: '하이브리드 ESS',
      solarCi: '산업용 태양광',
      charging: '전기차 충전',
      maintenance: '유지보수',
      capabilityProfile: '회사소개',
      contact: '문의',
      quote: '견적 요청',
    },
    header: {
      more: '더보기',
      toggleMenu: '메뉴 열기',
      quoteShort: '견적',
    },
    footer: {
      products: '제품',
      services: '서비스',
      policies: '정책',
      solarHome: '가정용 태양광',
      allCombos: '전체 패키지',
      onGridCombo: '온그리드 패키지',
      hybridCombo: '하이브리드 패키지',
      solarModules: '태양광 모듈',
      hybridInverter: '하이브리드 인버터',
      bessBattery: 'ESS 배터리',
      calculator: '계산기',
      office: '사무실',
      privacy: '개인정보처리방침',
      terms: '이용약관',
      contact: '문의',
      consultant: '영업 담당',
      technical: '기술 담당',
      address: '하노이시 떠이호구 쑤언떠오 거리 국방아카데미 아파트 상업구역 315호실',
      salesContactName: 'Ms. Giang',
      technicalContactName: 'Mr. Thai',
      aboutText: '전기설비 전문가가 제공하는 안전한 태양광 솔루션.',
      servicesLine: '상담 · 설계 · 시공 · 유지보수',
      requestQuote: '견적 요청',
      hybridBess: '하이브리드 ESS',
      solarCi: '산업용 태양광',
      news: '뉴스',
      paymentPolicy: '결제 정책',
      warrantyPolicy: '보증 정책',
      returnsPolicy: '반품 정책',
      deliveryPolicy: '배송 정책',
      copyright: 'All rights reserved.',
      legalName: 'EPC 베트남 건설 주식회사 (EPC VINA.,JSC)',
      businessRegistration: '사업자등록증 번호 0105313377, 2011년 5월 17일 하노이 기획투자국 발급.',
      quickQuote: '빠른 견적',
    },
  },
};

export function getLocaleFromPathname(pathname: string): Locale {
  const prefix = pathname.split('/')[1];
  return (locales as readonly string[]).includes(prefix) ? (prefix as Locale) : 'vi';
}
