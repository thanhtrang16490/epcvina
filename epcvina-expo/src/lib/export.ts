import { File, Paths } from 'expo-file-system'
import * as Sharing from 'expo-sharing'

export interface ExportData {
  headers: string[]
  rows: any[][]
  filename: string
}

export const exportToCSV = async (data: ExportData): Promise<void> => {
  try {
    // Create CSV content
    const csvContent = [
      data.headers.join(','),
      ...data.rows.map(row => row.map(cell => {
        // Escape commas and quotes
        const cellStr = String(cell || '')
        if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
          return `"${cellStr.replace(/"/g, '""')}"`
        }
        return cellStr
      }).join(','))
    ].join('\n')

    // Add BOM for UTF-8
    const bom = '\uFEFF'
    const fullContent = bom + csvContent

    // Save to file using new expo-file-system v19 API
    const file = new File(Paths.document, `${data.filename}.csv`)
    file.write(fullContent)

    // Share the file
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(file.uri, {
        mimeType: 'text/csv',
        dialogTitle: 'Xuất dữ liệu CSV'
      })
    } else {
      throw new Error('Sharing is not available on this device')
    }
  } catch (error) {
    console.error('Error exporting CSV:', error)
    throw error
  }
}

export const exportToJSON = async (data: any, filename: string): Promise<void> => {
  try {
    const jsonContent = JSON.stringify(data, null, 2)
    // Save to file using new expo-file-system v19 API
    const file = new File(Paths.document, `${filename}.json`)
    file.write(jsonContent)

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(file.uri, {
        mimeType: 'application/json',
        dialogTitle: 'Xuất dữ liệu JSON'
      })
    } else {
      throw new Error('Sharing is not available on this device')
    }
  } catch (error) {
    console.error('Error exporting JSON:', error)
    throw error
  }
}

// Format data for export
export const formatOrdersForExport = (orders: any[]): ExportData => {
  return {
    headers: ['Mã đơn', 'Khách hàng', 'Trạng thái', 'Tổng tiền', 'Ngày tạo'],
    rows: orders.map(order => [
      order.id,
      order.customers?.name || 'N/A',
      order.status,
      order.total_amount,
      new Date(order.created_at).toLocaleDateString('vi-VN')
    ]),
    filename: `orders_${new Date().toISOString().split('T')[0]}`
  }
}

export const formatCustomersForExport = (customers: any[]): ExportData => {
  return {
    headers: ['Mã KH', 'Tên', 'Email', 'Điện thoại', 'Địa chỉ', 'Ngày tạo'],
    rows: customers.map(customer => [
      customer.id,
      customer.name,
      customer.email || '',
      customer.phone || '',
      customer.address || '',
      new Date(customer.created_at).toLocaleDateString('vi-VN')
    ]),
    filename: `customers_${new Date().toISOString().split('T')[0]}`
  }
}

export const formatProductsForExport = (products: any[]): ExportData => {
  return {
    headers: ['Mã SP', 'Tên', 'Danh mục', 'Giá', 'Tồn kho', 'Đơn vị'],
    rows: products.map(product => [
      product.id,
      product.name,
      product.categories?.name || 'N/A',
      product.price,
      product.stock,
      product.unit
    ]),
    filename: `products_${new Date().toISOString().split('T')[0]}`
  }
}
