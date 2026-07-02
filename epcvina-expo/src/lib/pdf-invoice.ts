/**
 * PDF Invoice Generator
 * Tạo hóa đơn PDF từ dữ liệu đơn hàng dùng expo-print + expo-sharing
 */

import * as Print from 'expo-print'
import * as Sharing from 'expo-sharing'
import { errorTracker } from './error-tracking'

export interface InvoiceOrder {
  id: number
  created_at: string
  status: string
  total_amount: number
  discount_amount?: number
  notes?: string
  customer?: {
    full_name?: string
    phone?: string
    address?: string
    email?: string
  } | null
  sale?: {
    full_name?: string
    phone?: string
  } | null
}

export interface InvoiceItem {
  id: number
  quantity: number
  price_at_order: number
  products?: {
    name?: string
    code?: string
  } | null
}

const statusLabels: Record<string, string> = {
  draft: 'Đơn nháp',
  ordered: 'Đặt hàng',
  shipping: 'Giao hàng',
  paid: 'Thanh toán',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' đ'
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Tạo HTML template cho hóa đơn
 */
function generateInvoiceHTML(order: InvoiceOrder, items: InvoiceItem[]): string {
  const subtotal = order.total_amount
  const discount = order.discount_amount || 0
  const total = subtotal - discount

  const itemsHTML = items.map((item, index) => `
    <tr style="background: ${index % 2 === 0 ? '#f9fafb' : 'white'}">
      <td style="padding: 10px 12px; font-size: 13px; color: #374151;">
        ${item.products?.name || 'Sản phẩm'}
        ${item.products?.code ? `<br><span style="font-size: 11px; color: #9ca3af;">Mã: ${item.products.code}</span>` : ''}
      </td>
      <td style="padding: 10px 12px; text-align: center; font-size: 13px; color: #374151;">${item.quantity}</td>
      <td style="padding: 10px 12px; text-align: right; font-size: 13px; color: #374151;">${formatCurrency(item.price_at_order)}</td>
      <td style="padding: 10px 12px; text-align: right; font-size: 13px; font-weight: 600; color: #111827;">${formatCurrency(item.price_at_order * item.quantity)}</td>
    </tr>
  `).join('')

  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hóa đơn #${order.id}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #111827; background: white; padding: 32px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #e5e7eb; }
    .company { }
    .company-name { font-size: 24px; font-weight: 800; color: #175ead; letter-spacing: -0.5px; }
    .company-sub { font-size: 12px; color: #6b7280; margin-top: 4px; }
    .invoice-info { text-align: right; }
    .invoice-title { font-size: 28px; font-weight: 700; color: #111827; }
    .invoice-number { font-size: 14px; color: #6b7280; margin-top: 4px; }
    .invoice-date { font-size: 13px; color: #6b7280; margin-top: 2px; }
    .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; background: #dbeafe; color: #1d4ed8; margin-top: 8px; }
    
    .info-section { display: flex; gap: 24px; margin-bottom: 28px; }
    .info-box { flex: 1; background: #f9fafb; border-radius: 12px; padding: 16px; border: 1px solid #e5e7eb; }
    .info-box-title { font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; }
    .info-name { font-size: 15px; font-weight: 600; color: #111827; margin-bottom: 4px; }
    .info-detail { font-size: 13px; color: #6b7280; margin-bottom: 2px; }
    
    .table-section { margin-bottom: 24px; }
    .table-title { font-size: 14px; font-weight: 700; color: #111827; margin-bottom: 12px; }
    table { width: 100%; border-collapse: collapse; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb; }
    thead { background: #175ead; }
    thead th { padding: 12px; text-align: left; font-size: 12px; font-weight: 600; color: white; text-transform: uppercase; letter-spacing: 0.5px; }
    thead th:not(:first-child) { text-align: center; }
    thead th:last-child { text-align: right; }
    
    .summary { margin-left: auto; width: 280px; background: #f9fafb; border-radius: 12px; padding: 16px; border: 1px solid #e5e7eb; }
    .summary-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; color: #6b7280; }
    .summary-divider { height: 1px; background: #e5e7eb; margin: 12px 0; }
    .summary-total { display: flex; justify-content: space-between; font-size: 16px; font-weight: 700; color: #111827; }
    .summary-total-amount { color: #175ead; font-size: 18px; }
    
    .notes-section { margin-top: 20px; padding: 16px; background: #fffbeb; border-radius: 12px; border: 1px solid #fde68a; }
    .notes-title { font-size: 12px; font-weight: 700; color: #92400e; margin-bottom: 6px; }
    .notes-text { font-size: 13px; color: #78350f; }
    
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; }
    .footer-text { font-size: 12px; color: #9ca3af; }
    .footer-brand { font-size: 13px; font-weight: 600; color: #175ead; margin-top: 4px; }
  </style>
</head>
<body>
  <!-- Header -->
  <div class="header">
    <div class="company">
      <div class="company-name">EPCVINA</div>
      <div class="company-sub">Hệ thống quản lý bán hàng</div>
    </div>
    <div class="invoice-info">
      <div class="invoice-title">HÓA ĐƠN</div>
      <div class="invoice-number">#${order.id}</div>
      <div class="invoice-date">${formatDate(order.created_at)}</div>
      <div class="status-badge">${statusLabels[order.status] || order.status}</div>
    </div>
  </div>

  <!-- Customer & Sale Info -->
  <div class="info-section">
    <div class="info-box">
      <div class="info-box-title">Khách hàng</div>
      ${order.customer ? `
        <div class="info-name">${order.customer.full_name || 'Khách lẻ'}</div>
        ${order.customer.phone ? `<div class="info-detail">📞 ${order.customer.phone}</div>` : ''}
        ${order.customer.email ? `<div class="info-detail">✉️ ${order.customer.email}</div>` : ''}
        ${order.customer.address ? `<div class="info-detail">📍 ${order.customer.address}</div>` : ''}
      ` : '<div class="info-detail">Khách lẻ (không có thông tin)</div>'}
    </div>
    <div class="info-box">
      <div class="info-box-title">Nhân viên phụ trách</div>
      ${order.sale ? `
        <div class="info-name">${order.sale.full_name || 'N/A'}</div>
        ${order.sale.phone ? `<div class="info-detail">📞 ${order.sale.phone}</div>` : ''}
      ` : '<div class="info-detail">Không có thông tin</div>'}
    </div>
  </div>

  <!-- Items Table -->
  <div class="table-section">
    <div class="table-title">Chi tiết sản phẩm (${items.length} mặt hàng)</div>
    <table>
      <thead>
        <tr>
          <th style="width: 45%">Sản phẩm</th>
          <th style="width: 15%">Số lượng</th>
          <th style="width: 20%">Đơn giá</th>
          <th style="width: 20%">Thành tiền</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHTML}
      </tbody>
    </table>
  </div>

  <!-- Summary -->
  <div class="summary">
    <div class="summary-row">
      <span>Tạm tính</span>
      <span>${formatCurrency(subtotal)}</span>
    </div>
    ${discount > 0 ? `
    <div class="summary-row">
      <span>Giảm giá</span>
      <span style="color: #ef4444;">-${formatCurrency(discount)}</span>
    </div>
    ` : ''}
    <div class="summary-divider"></div>
    <div class="summary-total">
      <span>Tổng cộng</span>
      <span class="summary-total-amount">${formatCurrency(total)}</span>
    </div>
  </div>

  <!-- Notes -->
  ${order.notes ? `
  <div class="notes-section">
    <div class="notes-title">📝 Ghi chú</div>
    <div class="notes-text">${order.notes}</div>
  </div>
  ` : ''}

  <!-- Footer -->
  <div class="footer">
    <div class="footer-text">Cảm ơn quý khách đã tin tưởng sử dụng dịch vụ của chúng tôi!</div>
    <div class="footer-brand">EPCVINA — epcvina.com</div>
  </div>
</body>
</html>
  `
}

/**
 * Xuất hóa đơn PDF và chia sẻ
 * @returns true nếu thành công
 */
export async function exportInvoicePDF(
  order: InvoiceOrder,
  items: InvoiceItem[]
): Promise<boolean> {
  try {
    const html = generateInvoiceHTML(order, items)

    // Tạo PDF từ HTML
    const { uri } = await Print.printToFileAsync({
      html,
      base64: false,
    })

    // Kiểm tra sharing có khả dụng không
    const canShare = await Sharing.isAvailableAsync()
    if (!canShare) {
      errorTracker.logWarning('Sharing not available on this device', {
        action: 'exportInvoicePDF',
      })
      return false
    }

    // Chia sẻ file PDF
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: `Hóa đơn #${order.id}`,
      UTI: 'com.adobe.pdf',
    })

    return true
  } catch (error) {
    errorTracker.logError(error as Error, { action: 'exportInvoicePDF', orderId: order.id })
    return false
  }
}

/**
 * In trực tiếp (mở print dialog)
 */
export async function printInvoice(
  order: InvoiceOrder,
  items: InvoiceItem[]
): Promise<void> {
  try {
    const html = generateInvoiceHTML(order, items)
    await Print.printAsync({ html })
  } catch (error) {
    errorTracker.logError(error as Error, { action: 'printInvoice', orderId: order.id })
  }
}
