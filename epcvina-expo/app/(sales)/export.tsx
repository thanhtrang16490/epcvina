import { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../src/contexts/AuthContext'
import { supabase } from '../../src/lib/supabase'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { 
  exportToCSV, 
  formatOrdersForExport, 
  formatCustomersForExport, 
  formatProductsForExport 
} from '../../src/lib/export'

export default function ExportScreen() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState<string | null>(null)

  useEffect(() => {
    checkAccess()
  }, [])

  const checkAccess = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) {
      router.replace('/(auth)/login')
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authUser.id)
      .single()

    if (!profile || !['admin', 'sale_admin'].includes(profile.role)) {
      router.replace('/(sales)/dashboard')
    }
  }

  const handleExportOrders = async () => {
    try {
      setExporting('orders')
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customers (name)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      const exportData = formatOrdersForExport(data || [])
      await exportToCSV(exportData)
      Alert.alert('Thành công', 'Đã xuất dữ liệu đơn hàng')
    } catch (error: any) {
      console.error('Error exporting orders:', error)
      Alert.alert('Lỗi', error.message || 'Không thể xuất dữ liệu')
    } finally {
      setExporting(null)
    }
  }

  const handleExportCustomers = async () => {
    try {
      setExporting('customers')
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const exportData = formatCustomersForExport(data || [])
      await exportToCSV(exportData)
      Alert.alert('Thành công', 'Đã xuất dữ liệu khách hàng')
    } catch (error: any) {
      console.error('Error exporting customers:', error)
      Alert.alert('Lỗi', error.message || 'Không thể xuất dữ liệu')
    } finally {
      setExporting(null)
    }
  }

  const handleExportProducts = async () => {
    try {
      setExporting('products')
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (name)
        `)
        .order('name')

      if (error) throw error

      const exportData = formatProductsForExport(data || [])
      await exportToCSV(exportData)
      Alert.alert('Thành công', 'Đã xuất dữ liệu sản phẩm')
    } catch (error: any) {
      console.error('Error exporting products:', error)
      Alert.alert('Lỗi', error.message || 'Không thể xuất dữ liệu')
    } finally {
      setExporting(null)
    }
  }

  const handleExportAll = async () => {
    Alert.alert(
      'Xuất tất cả dữ liệu',
      'Bạn có muốn xuất tất cả dữ liệu (đơn hàng, khách hàng, sản phẩm)?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xuất',
          onPress: async () => {
            await handleExportOrders()
            await handleExportCustomers()
            await handleExportProducts()
          }
        }
      ]
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Xuất dữ liệu</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#175ead" />
          <Text style={styles.infoText}>
            Xuất dữ liệu sang file CSV để sử dụng trong Excel hoặc các ứng dụng khác
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chọn loại dữ liệu</Text>

          <ExportCard
            title="Đơn hàng"
            description="Xuất tất cả đơn hàng với thông tin chi tiết"
            icon="receipt"
            color="#10b981"
            onPress={handleExportOrders}
            loading={exporting === 'orders'}
          />

          <ExportCard
            title="Khách hàng"
            description="Xuất danh sách khách hàng và thông tin liên hệ"
            icon="people"
            color="#175ead"
            onPress={handleExportCustomers}
            loading={exporting === 'customers'}
          />

          <ExportCard
            title="Sản phẩm"
            description="Xuất danh sách sản phẩm và tồn kho"
            icon="cube"
            color="#f59e0b"
            onPress={handleExportProducts}
            loading={exporting === 'products'}
          />

          <TouchableOpacity
            style={styles.exportAllButton}
            onPress={handleExportAll}
            disabled={exporting !== null}
          >
            <Ionicons name="download" size={20} color="white" />
            <Text style={styles.exportAllButtonText}>Xuất tất cả</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lưu ý</Text>
          <View style={styles.noteCard}>
            <Text style={styles.noteText}>• File CSV có thể mở bằng Excel, Google Sheets</Text>
            <Text style={styles.noteText}>• Dữ liệu được mã hóa UTF-8 để hiển thị tiếng Việt</Text>
            <Text style={styles.noteText}>• File sẽ được lưu vào thư mục Downloads</Text>
            <Text style={styles.noteText}>• Bạn có thể chia sẻ file qua email hoặc ứng dụng khác</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

function ExportCard({ title, description, icon, color, onPress, loading }: any) {
  return (
    <TouchableOpacity
      style={styles.exportCard}
      onPress={onPress}
      disabled={loading}
    >
      <View style={[styles.exportIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <View style={styles.exportContent}>
        <Text style={styles.exportTitle}>{title}</Text>
        <Text style={styles.exportDescription}>{description}</Text>
      </View>
      {loading ? (
        <ActivityIndicator color={color} />
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  scrollView: {
    flex: 1,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dbeafe',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1e40af',
    lineHeight: 20,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  exportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  exportIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  exportContent: {
    flex: 1,
  },
  exportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  exportDescription: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  exportAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#175ead',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
  },
  exportAllButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  noteCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  noteText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 24,
  },
})
