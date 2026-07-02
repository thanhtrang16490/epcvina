/**
 * Generate db.json for epcvina-expo from epcvinasolar data
 * Extracts all products from content collections + data files
 */
import fs from 'fs'
import path from 'path'

const SOLAR_DIR = path.resolve('../epcvinasolar/src')
const OUTPUT = path.resolve('src/data/db.json')

// ─── Parse YAML frontmatter ──────────────────────────────────────────────────

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return {}
  const yaml = match[1]
  const result = {}
  let currentKey = ''
  let currentObj = null
  let currentArr = null

  for (const line of yaml.split('\n')) {
    // Key: value
    const kvMatch = line.match(/^(\w[\w_]*):\s+(.*)$/)
    if (kvMatch) {
      currentKey = kvMatch[1]
      let val = kvMatch[2].trim()
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1)
      if (val === 'true') val = true
      else if (val === 'false') val = false
      else if (!isNaN(val) && val !== '') val = Number(val)
      result[currentKey] = val
      currentObj = null
      currentArr = null
      continue
    }
    // Nested key under specifications:
    const nestedMatch = line.match(/^\s+"([^"]+)":\s+"?([^"]*)"?\s*$/)
    if (nestedMatch && currentKey) {
      if (!result[currentKey] || typeof result[currentKey] !== 'object') result[currentKey] = {}
      result[currentKey][nestedMatch[1]] = nestedMatch[2]
      continue
    }
    // Array item: - "value"
    const arrMatch = line.match(/^\s+-\s+"?([^"]*)"?\s*$/)
    if (arrMatch && currentKey) {
      if (!Array.isArray(result[currentKey])) result[currentKey] = []
      result[currentKey].push(arrMatch[1])
      continue
    }
    // Key with no value (multiline description)
    const keyOnly = line.match(/^(\w[\w_]*):\s*$/)
    if (keyOnly) {
      currentKey = keyOnly[1]
      result[currentKey] = ''
      continue
    }
    // Continuation of multiline value
    if (currentKey && line.startsWith('  ') && !line.includes(':')) {
      if (typeof result[currentKey] === 'string') {
        result[currentKey] += (result[currentKey] ? ' ' : '') + line.trim()
      }
    }
  }
  return result
}

// ─── Read all product markdown files ─────────────────────────────────────────

function readProducts() {
  const productsDir = path.join(SOLAR_DIR, 'content/products')
  const products = []
  const categories = fs.readdirSync(productsDir)

  for (const cat of categories) {
    const catDir = path.join(productsDir, cat)
    if (!fs.statSync(catDir).isDirectory()) continue

    const files = fs.readdirSync(catDir).filter(f => f.endsWith('.md'))
    for (const file of files) {
      const content = fs.readFileSync(path.join(catDir, file), 'utf-8')
      const fm = parseFrontmatter(content)
      const slug = path.basename(file, '.md')

      products.push({
        id: slug,
        name: fm.name || slug,
        slug,
        brand: fm.brand || '',
        category: fm.category || cat,
        model: fm.model || '',
        description: (fm.description || '').slice(0, 200),
        specifications: fm.specifications || {},
        features: fm.features || [],
        warranty_years: fm.warranty_years || (fm.warranty ? parseInt(fm.warranty) : 10),
        unit_price: fm.price || 0,
        main_image: fm.main_image || '',
        image_url: fm.main_image || '',
        image: fm.main_image || '',
        is_available: fm.is_available !== false,
        show_on_homepage: fm.show_on_homepage || false,
        product_type: fm.product_type || (cat.includes('panel') ? 'panel' : cat.includes('inverter') ? 'inverter' : 'accessory'),
        phase: fm.phase || null,
        voltage: fm.voltage || null,
        stock: Math.floor(Math.random() * 300) + 20,
        created_at: '2024-01-01T00:00:00Z',
        deleted_at: null,
      })
    }
  }
  return products
}

// ─── Categories ──────────────────────────────────────────────────────────────

const categories = [
  { id: 1, name: 'Tấm quang năng', slug: 'panel', description: 'Tấm pin năng lượng mặt trời', created_at: '2024-01-01T00:00:00Z' },
  { id: 2, name: 'Hệ khung nhôm', slug: 'mounting', description: 'Hệ thống khung nhôm lắp đặt', created_at: '2024-01-01T00:00:00Z' },
  { id: 3, name: 'Hệ dây điện', slug: 'wiring', description: 'Dây điện và cáp DC', created_at: '2024-01-01T00:00:00Z' },
  { id: 4, name: 'Tủ điện', slug: 'cabinet', description: 'Tủ điện DC/AC', created_at: '2024-01-01T00:00:00Z' },
  { id: 5, name: 'Biến tần On-Grid 1 Pha', slug: 'on-grid-1phase', description: '', created_at: '2024-01-01T00:00:00Z' },
  { id: 6, name: 'Biến tần On-Grid 3 Pha', slug: 'on-grid-3phase-lv', description: '', created_at: '2024-01-01T00:00:00Z' },
  { id: 7, name: 'Biến tần Hybrid 1 Pha', slug: 'hybrid-1phase', description: '', created_at: '2024-01-01T00:00:00Z' },
  { id: 8, name: 'Biến tần Hybrid 3 Pha', slug: 'hybrid-3phase-lv', description: '', created_at: '2024-01-01T00:00:00Z' },
  { id: 9, name: 'Biến tần Hybrid', slug: 'hybrid-inverter', description: '', created_at: '2024-01-01T00:00:00Z' },
  { id: 10, name: 'Pin lưu trữ áp thấp', slug: 'lv-battery', description: '', created_at: '2024-01-01T00:00:00Z' },
  { id: 11, name: 'Pin lưu trữ áp cao', slug: 'hv-battery', description: '', created_at: '2024-01-01T00:00:00Z' },
]

// ─── Brands ──────────────────────────────────────────────────────────────────

const brands = [
  { id: 'brand-001', name: 'AIKO', country: 'China', logo_url: '', website: 'https://www.aikosolar.com', is_active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: 'brand-002', name: 'Canadian Solar', country: 'Canada', logo_url: '', website: 'https://www.canadiansolar.com', is_active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: 'brand-003', name: 'JA Solar', country: 'China', logo_url: '', website: 'https://www.jasolar.com', is_active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: 'brand-004', name: 'Longi', country: 'China', logo_url: '', website: 'https://www.longi.com', is_active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: 'brand-005', name: 'Sharp', country: 'Japan', logo_url: '', website: 'https://www.sharp.com', is_active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: 'brand-006', name: 'SAJ', country: 'China', logo_url: '', website: 'https://www.saj-electric.com', is_active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: 'brand-007', name: 'Hope Trek', country: 'China', logo_url: '', website: '', is_active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: 'brand-008', name: 'Huawei', country: 'China', logo_url: '', website: 'https://www.huawei.com', is_active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: 'brand-009', name: 'Deye', country: 'China', logo_url: '', website: 'https://www.deyeinverter.com', is_active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: 'brand-010', name: 'QUANG MINH TECH', country: 'Vietnam', logo_url: '', website: '', is_active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: 'brand-011', name: 'Leader', country: 'Vietnam', logo_url: '', website: '', is_active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: 'brand-012', name: 'Genix Green', country: 'Vietnam', logo_url: '', website: '', is_active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: 'brand-013', name: 'Growatt', country: 'China', logo_url: '', website: 'https://www.ginlong.com', is_active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: 'brand-014', name: 'Pylontech', country: 'China', logo_url: '', website: 'https://www.pylontech.com.cn', is_active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: 'brand-015', name: 'GPG Solar', country: 'Vietnam', logo_url: '', website: '', is_active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: 'brand-016', name: 'EPCVINA', country: 'Vietnam', logo_url: '', website: 'https://epcvina.com', is_active: true, created_at: '2024-01-01T00:00:00Z' },
]

// ─── Mock business data ──────────────────────────────────────────────────────

const MOCK_USER_ID = 'mock-admin-001'
const now = new Date()
const daysAgo = (d) => new Date(now.getTime() - d * 86400000).toISOString()

const profiles = [
  { id: MOCK_USER_ID, full_name: 'Admin EPCVINA', phone: '0901234567', role: 'admin', email: 'admin@epcvina.com', manager_id: null, created_at: '2024-01-01T00:00:00Z' },
  { id: 'mock-sale-001', full_name: 'Nguyễn Văn An', phone: '0912345601', role: 'sale', email: 'an.nv@epcvina.com', manager_id: MOCK_USER_ID, created_at: '2024-01-15T00:00:00Z' },
  { id: 'mock-sale-002', full_name: 'Trần Thị Bình', phone: '0912345602', role: 'sale', email: 'binh.tt@epcvina.com', manager_id: MOCK_USER_ID, created_at: '2024-02-01T00:00:00Z' },
  { id: 'mock-sale-admin-001', full_name: 'Phạm Văn Đạt', phone: '0912345606', role: 'sale_admin', email: 'dat.pv@epcvina.com', manager_id: null, created_at: '2024-01-05T00:00:00Z' },
  { id: 'mock-warehouse-001', full_name: 'Lê Văn Cường', phone: '0912345603', role: 'warehouse', email: 'cuong.lv@epcvina.com', manager_id: null, created_at: '2024-01-10T00:00:00Z' },
  { id: 'mock-accountant-001', full_name: 'Phạm Thị Dung', phone: '0912345604', role: 'accountant', email: 'dung.pt@epcvina.com', manager_id: null, created_at: '2024-01-10T00:00:00Z' },
  { id: 'mock-director-001', full_name: 'Hoàng Văn Em', phone: '0912345605', role: 'director', email: 'em.hv@epcvina.com', manager_id: null, created_at: '2024-01-01T00:00:00Z' },
  { id: 'mock-customer-001', full_name: 'Công ty ABC', phone: '0987654301', role: 'customer', email: 'contact@abc.com', manager_id: null, created_at: '2024-03-01T00:00:00Z' },
  { id: 'mock-customer-002', full_name: 'Công ty XYZ', phone: '0987654302', role: 'customer', email: 'info@xyz.com', manager_id: null, created_at: '2024-03-15T00:00:00Z' },
]

const customers = [
  { id: 'cust-001', name: 'Công ty ABC', full_name: 'Công ty TNHH ABC', phone: '0987654301', email: 'contact@abc.com', address: 'Hà Nội', assigned_to: 'mock-sale-001', user_id: 'mock-customer-001', created_at: '2024-03-01T00:00:00Z', updated_at: '2024-03-01T00:00:00Z' },
  { id: 'cust-002', name: 'Công ty XYZ', full_name: 'Công ty CP XYZ', phone: '0987654302', email: 'info@xyz.com', address: 'TP.HCM', assigned_to: 'mock-sale-001', user_id: 'mock-customer-002', created_at: '2024-03-15T00:00:00Z', updated_at: '2024-03-15T00:00:00Z' },
  { id: 'cust-003', name: 'Nhà máy DEF', full_name: 'Nhà máy DEF', phone: '0987654303', email: 'purchase@def.com', address: 'Bắc Ninh', assigned_to: 'mock-sale-002', user_id: null, created_at: '2024-04-01T00:00:00Z', updated_at: '2024-04-01T00:00:00Z' },
  { id: 'cust-004', name: 'Trường ĐH GHI', full_name: 'Trường Đại học GHI', phone: '0987654304', email: 'admin@ghi.edu.vn', address: 'Hà Nội', assigned_to: 'mock-sale-002', user_id: null, created_at: '2024-04-15T00:00:00Z', updated_at: '2024-04-15T00:00:00Z' },
  { id: 'cust-005', name: 'Bệnh viện JKL', full_name: 'Bệnh viện JKL', phone: '0987654305', email: 'supply@jklhospital.vn', address: 'Hải Phòng', assigned_to: MOCK_USER_ID, user_id: null, created_at: '2024-05-01T00:00:00Z', updated_at: '2024-05-01T00:00:00Z' },
  { id: 'cust-006', name: 'KS Thanh Hà', full_name: 'Khách sạn Thanh Hà', phone: '0987654306', email: 'lethanha@thanha.vn', address: 'Hà Nội', assigned_to: 'mock-sale-001', user_id: null, created_at: '2024-05-15T00:00:00Z', updated_at: '2024-05-15T00:00:00Z' },
  { id: 'cust-007', name: 'NM May Hải Phòng', full_name: 'Nhà máy may Hải Phòng', phone: '0987654307', email: 'info@nmhayhp.vn', address: 'Hải Phòng', assigned_to: 'mock-sale-002', user_id: null, created_at: '2024-06-01T00:00:00Z', updated_at: '2024-06-01T00:00:00Z' },
]

const orders = [
  { id: 'order-001', customer_id: 'cust-001', customer_name: 'Công ty ABC', sale_id: 'mock-sale-001', total_amount: 125000000, status: 'completed', notes: 'Giao hàng thành công', created_at: daysAgo(1), updated_at: daysAgo(1) },
  { id: 'order-002', customer_id: 'cust-002', customer_name: 'Công ty XYZ', sale_id: 'mock-sale-001', total_amount: 89000000, status: 'ordered', notes: '', created_at: daysAgo(0), updated_at: daysAgo(0) },
  { id: 'order-003', customer_id: 'cust-003', customer_name: 'Nhà máy DEF', sale_id: 'mock-sale-002', total_amount: 250000000, status: 'shipping', notes: 'Đang giao', created_at: daysAgo(2), updated_at: daysAgo(1) },
  { id: 'order-004', customer_id: 'cust-004', customer_name: 'Trường ĐH GHI', sale_id: 'mock-sale-002', total_amount: 45000000, status: 'paid', notes: '', created_at: daysAgo(3), updated_at: daysAgo(2) },
  { id: 'order-005', customer_id: 'cust-005', customer_name: 'Bệnh viện JKL', sale_id: MOCK_USER_ID, total_amount: 320000000, status: 'completed', notes: '', created_at: daysAgo(5), updated_at: daysAgo(3) },
  { id: 'order-006', customer_id: 'cust-001', customer_name: 'Công ty ABC', sale_id: 'mock-sale-001', total_amount: 67000000, status: 'completed', notes: '', created_at: daysAgo(10), updated_at: daysAgo(8) },
  { id: 'order-007', customer_id: 'cust-003', customer_name: 'Nhà máy DEF', sale_id: 'mock-sale-002', total_amount: 180000000, status: 'ordered', notes: 'Đơn hàng gấp', created_at: daysAgo(0), updated_at: daysAgo(0) },
  { id: 'order-008', customer_id: 'cust-002', customer_name: 'Công ty XYZ', sale_id: 'mock-sale-001', total_amount: 95000000, status: 'completed', notes: '', created_at: daysAgo(15), updated_at: daysAgo(12) },
  { id: 'order-009', customer_id: 'cust-004', customer_name: 'Trường ĐH GHI', sale_id: 'mock-sale-002', total_amount: 55000000, status: 'draft', notes: '', created_at: daysAgo(0), updated_at: daysAgo(0) },
  { id: 'order-010', customer_id: 'cust-005', customer_name: 'Bệnh viện JKL', sale_id: MOCK_USER_ID, total_amount: 410000000, status: 'completed', notes: '', created_at: daysAgo(20), updated_at: daysAgo(18) },
  { id: 'order-011', customer_id: 'cust-006', customer_name: 'KS Thanh Hà', sale_id: 'mock-sale-001', total_amount: 78000000, status: 'completed', notes: '', created_at: daysAgo(25), updated_at: daysAgo(22) },
  { id: 'order-012', customer_id: 'cust-007', customer_name: 'NM May Hải Phòng', sale_id: 'mock-sale-002', total_amount: 520000000, status: 'completed', notes: '', created_at: daysAgo(30), updated_at: daysAgo(28) },
]

const notifications = [
  { id: 'notif-001', user_id: MOCK_USER_ID, title: 'Đơn hàng mới', body: 'Công ty XYZ vừa đặt hàng 89 triệu đồng', type: 'order', read: false, data: { orderId: 'order-002' }, created_at: daysAgo(0) },
  { id: 'notif-002', user_id: MOCK_USER_ID, title: 'Cảnh báo tồn kho', body: 'Inverter Huawei SUN2000 sắp hết hàng (còn 20)', type: 'alert', read: false, data: { productId: 'prod-006' }, created_at: daysAgo(1) },
  { id: 'notif-003', user_id: MOCK_USER_ID, title: 'Cập nhật hệ thống', body: 'Hệ thống sẽ bảo trì lúc 22:00 tối nay', type: 'system', read: true, data: {}, created_at: daysAgo(2) },
  { id: 'notif-004', user_id: MOCK_USER_ID, title: 'Thanh toán thành công', body: 'Trường ĐH GHI đã thanh toán 45 triệu', type: 'order', read: true, data: { orderId: 'order-004' }, created_at: daysAgo(2) },
  { id: 'notif-005', user_id: MOCK_USER_ID, title: 'Đơn hàng hoàn thành', body: 'Đơn hàng Công ty ABC đã giao thành công', type: 'order', read: true, data: { orderId: 'order-001' }, created_at: daysAgo(1) },
  { id: 'notif-006', user_id: MOCK_USER_ID, title: 'Khách hàng mới', body: 'Nhà máy may Hải Phòng đã đăng ký', type: 'system', read: false, data: { customerId: 'cust-007' }, created_at: daysAgo(0) },
]

const sales_teams = [
  { id: 'team-001', name: 'Nhóm kinh doanh Miền Bắc', manager_id: MOCK_USER_ID, created_at: '2024-01-01T00:00:00Z' },
  { id: 'team-002', name: 'Nhóm kinh doanh Miền Nam', manager_id: 'mock-sale-admin-001', created_at: '2024-02-01T00:00:00Z' },
]

const team_members = [
  { id: 'tm-001', team_id: 'team-001', sale_id: 'mock-sale-001', status: 'active', joined_at: '2024-01-15T00:00:00Z' },
  { id: 'tm-002', team_id: 'team-001', sale_id: 'mock-sale-002', status: 'active', joined_at: '2024-02-01T00:00:00Z' },
]

const discount_policies = [
  { id: 'disc-001', name: 'Giảm giá đại lý 10%', customer_id: null, product_group: 'panel', region: null, discount_type: 'percentage', discount_value: 10, effective_from: '2024-01-01', effective_to: '2024-12-31', is_active: true, notes: 'Áp dụng cho đơn hàng > 100 tấm', created_by: MOCK_USER_ID, created_at: '2024-01-01T00:00:00Z' },
  { id: 'disc-002', name: 'Giảm giá dự án 5%', customer_id: 'cust-001', product_group: null, region: null, discount_type: 'percentage', discount_value: 5, effective_from: '2024-06-01', effective_to: '2024-12-31', is_active: true, notes: null, created_by: MOCK_USER_ID, created_at: '2024-06-01T00:00:00Z' },
]

const gift_policies = [
  { id: 'gift-001', name: 'Tặng dây cáp khi mua 100+ tấm', trigger_product_id: 1, min_quantity: 100, gift_product_id: 10, gift_quantity: 50, is_active: true, effective_from: '2024-01-01', effective_to: '2024-12-31', notes: 'Áp dụng cho tấm pin', created_by: MOCK_USER_ID, created_at: '2024-01-01T00:00:00Z', trigger_product: { id: 1, name: 'Canadian Solar 720W', code: 'CS7N-720' }, gift_product: { id: 10, name: 'Dây cáp DC 4mm²', code: 'CBL-DC4', price: 15000, unit: 'Mét' } },
]

const customer_special_prices = [
  { id: 1, customer_id: 'cust-001', product_id: 1, price_type: 'percentage', price_value: 8, effective_from: '2024-01-01', effective_to: '2024-12-31', is_active: true, created_by: MOCK_USER_ID, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', notes: 'Giá đặc biệt cho ABC' },
]

// ─── Build & write ───────────────────────────────────────────────────────────

console.log('Reading products from epcvinasolar...')
const products = readProducts()
console.log(`Found ${products.length} products`)

const db = {
  products,
  categories,
  brands,
  profiles,
  customers,
  orders,
  notifications,
  sales_teams,
  team_members,
  discount_policies,
  gift_policies,
  customer_special_prices,
  _meta: {
    generated_at: new Date().toISOString(),
    source: 'epcvinasolar',
    product_count: products.length,
  }
}

fs.writeFileSync(OUTPUT, JSON.stringify(db, null, 2))
console.log(`✅ Written to ${OUTPUT}`)
console.log(`   Products: ${products.length}`)
console.log(`   Categories: ${categories.length}`)
console.log(`   Brands: ${brands.length}`)
console.log(`   Orders: ${orders.length}`)
console.log(`   Customers: ${customers.length}`)
