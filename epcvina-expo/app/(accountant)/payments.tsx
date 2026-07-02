import { useState, useEffect, useCallback, useRef } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Modal,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../../src/lib/supabase'
import { useFocusEffect } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { emitScrollVisibility } from './_layout'
import { useTabBarHeight } from '../../src/hooks/useTabBarHeight'

const INDIGO = '#4f46e5'

interface Payment {
  id: string
  amount: number
  payment_date: string
  method: string
  invoice_id: string
  invoice_number?: string
  customer_name?: string | null
  notes?: string
  created_at: string
}

const METHOD_MAP: Record<string, { label: string; icon: string }> = {
  cash: { label: 'Tiền mặt', icon: 'cash' },
  transfer: { label: 'Chuyển khoản', icon: 'card' },
  check: { label: 'Séc', icon: 'document-text' },
  other: { label: 'Khác', icon: 'ellipsis-horizontal' },
}

const METHOD_OPTIONS = [
  { id: 'cash', label: 'Tiền mặt' },
  { id: 'transfer', label: 'Chuyển khoản' },
  { id: 'check', label: 'Séc' },
  { id: 'other', label: 'Khác' },
]

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' VNĐ'

export default function PaymentsScreen() {
  const { contentPaddingBottom } = useTabBarHeight()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [unpaidInvoices, setUnpaidInvoices] = useState<any[]>([])

  // Create payment form state
  const [formAmount, setFormAmount] = useState('')
  const [formMethod, setFormMethod] = useState('cash')
  const [formInvoiceId, setFormInvoiceId] = useState('')
  const [formNotes, setFormNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const lastScrollY = useRef(0)
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y
    const scrollDiff = currentScrollY - lastScrollY.current
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current)
    if (Math.abs(scrollDiff) > 5) {
      if (scrollDiff > 0 && currentScrollY > 50) emitScrollVisibility(false)
      else if (scrollDiff < 0) emitScrollVisibility(true)
      lastScrollY.current = currentScrollY
    }
    scrollTimeout.current = setTimeout(() => emitScrollVisibility(true), 2000)
  }

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('payments')
        .select(`
          id,
          amount,
          payment_date,
          method,
          invoice_id,
          notes,
          created_at,
          invoices:invoice_id ( invoice_number, profiles:customer_id ( full_name ) )
        `)
        .order('payment_date', { ascending: false })
        .limit(50)

      if (error) throw error

      setPayments(
        (data || []).map((p: any) => ({
          id: p.id,
          amount: p.amount,
          payment_date: p.payment_date,
          method: p.method,
          invoice_id: p.invoice_id,
          invoice_number: p.invoices?.invoice_number,
          customer_name: p.invoices?.profiles?.full_name ?? null,
          notes: p.notes,
          created_at: p.created_at,
        }))
      )
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUnpaidInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('id, invoice_number, total_amount, payment_status')
        .neq('payment_status', 'paid')
        .neq('status', 'cancelled')
        .order('invoice_date', { ascending: false })
        .limit(20)

      if (!error && data) {
        setUnpaidInvoices(data)
      }
    } catch (error) {
      console.error('Error fetching unpaid invoices:', error)
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  useFocusEffect(
    useCallback(() => {
      if (!refreshing) fetchPayments()
    }, [refreshing])
  )

  const onRefresh = () => {
    setRefreshing(true)
    fetchPayments().finally(() => setRefreshing(false))
  }

  const openCreateModal = () => {
    fetchUnpaidInvoices()
    setFormAmount('')
    setFormMethod('cash')
    setFormInvoiceId('')
    setFormNotes('')
    setShowCreateModal(true)
  }

  const handleSubmitPayment = async () => {
    if (!formAmount || !formInvoiceId) return

    try {
      setSubmitting(true)

      const { error } = await supabase.from('payments').insert({
        amount: parseFloat(formAmount),
        payment_date: new Date().toISOString().split('T')[0],
        method: formMethod,
        invoice_id: formInvoiceId,
        notes: formNotes || null,
      })

      if (error) throw error

      setShowCreateModal(false)
      fetchPayments()
    } catch (error: any) {
      console.error('Error creating payment:', error)
      Alert.alert('Lỗi', error.message || 'Không thể ghi thu tiền')
    } finally {
      setSubmitting(false)
    }
  }



  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={INDIGO} />
        <Text style={styles.loadingText}>Đang tải thu tiền...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>Thu tiền</Text>
              <Text style={styles.headerSubtitle}>Ghi nhận thanh toán hóa đơn</Text>
            </View>
            <TouchableOpacity style={styles.createButton} onPress={openCreateModal}>
              <Ionicons name="add" size={22} color="white" />
              <Text style={styles.createButtonText}>Ghi thu</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Ionicons name="cash" size={20} color={INDIGO} />
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryLabel}>Tổng giao dịch</Text>
              <Text style={styles.summaryValue}>{payments.length}</Text>
            </View>
          </View>
          <View style={styles.summaryCard}>
            <Ionicons name="trending-up" size={20} color="#059669" />
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryLabel}>Tổng thu</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(payments.reduce((s, p) => s + (p.amount || 0), 0))}
              </Text>
            </View>
          </View>
        </View>

        {/* Payment List */}
        <View style={[styles.listContainer, { paddingBottom: contentPaddingBottom }]}>
          <Text style={styles.sectionTitle}>Lịch sử thu tiền</Text>
          {payments.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="cash-outline" size={48} color="#d1d5db" />
              <Text style={styles.emptyStateText}>Chưa có giao dịch thu tiền nào</Text>
            </View>
          ) : (
            payments.map((payment) => {
              const methodInfo = METHOD_MAP[payment.method] ?? METHOD_MAP.other
              return (
                <View key={payment.id} style={styles.paymentCard}>
                  <View style={styles.paymentLeft}>
                    <View style={[styles.paymentIconContainer, { backgroundColor: '#d1fae5' }]}>
                      <Ionicons name={methodInfo.icon as any} size={20} color="#059669" />
                    </View>
                    <View style={styles.paymentInfo}>
                      <Text style={styles.paymentInvoice} numberOfLines={1}>
                        {payment.invoice_number ?? `HĐ ${payment.invoice_id?.slice(0, 8)}`}
                      </Text>
                      <Text style={styles.paymentCustomer} numberOfLines={1}>
                        {payment.customer_name ?? 'Không rõ KH'}
                      </Text>
                      <View style={styles.paymentMeta}>
                        <Text style={styles.paymentMethod}>{methodInfo.label}</Text>
                        <Text style={styles.paymentDate}>
                          {new Date(payment.payment_date).toLocaleDateString('vi-VN')}
                        </Text>
                      </View>
                      {payment.notes ? (
                        <Text style={styles.paymentNotes} numberOfLines={1}>
                          {payment.notes}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                  <View style={styles.paymentRight}>
                    <Text style={styles.paymentAmount}>{formatCurrency(payment.amount)}</Text>
                  </View>
                </View>
              )
            })
          )}
        </View>
      </ScrollView>

      {/* Create Payment Modal */}
      <Modal
        visible={showCreateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ghi thu tiền</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Invoice selector */}
              <Text style={styles.formLabel}>Hóa đơn *</Text>
              {unpaidInvoices.length === 0 ? (
                <View style={styles.noInvoicesBox}>
                  <Text style={styles.noInvoicesText}>Không có hóa đơn chưa thanh toán</Text>
                </View>
              ) : (
                <ScrollView style={styles.invoiceSelector} nestedScrollEnabled>
                  {unpaidInvoices.map((inv) => (
                    <TouchableOpacity
                      key={inv.id}
                      style={[
                        styles.invoiceOption,
                        formInvoiceId === inv.id && styles.invoiceOptionSelected,
                      ]}
                      onPress={() => setFormInvoiceId(inv.id)}
                    >
                      <View style={styles.invoiceOptionLeft}>
                        <Ionicons
                          name={formInvoiceId === inv.id ? 'radio-button-on' : 'radio-button-off'}
                          size={20}
                          color={formInvoiceId === inv.id ? INDIGO : '#9ca3af'}
                        />
                        <View>
                          <Text style={styles.invoiceOptionNumber}>{inv.invoice_number}</Text>
                          <Text style={styles.invoiceOptionAmount}>
                            {formatCurrency(inv.total_amount)}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={[
                          styles.invoiceOptionBadge,
                          { backgroundColor: inv.payment_status === 'partial' ? '#fef3c7' : '#fee2e2' },
                        ]}
                      >
                        <Text
                          style={[
                            styles.invoiceOptionBadgeText,
                            {
                              color:
                                inv.payment_status === 'partial' ? '#d97706' : '#dc2626',
                            },
                          ]}
                        >
                          {inv.payment_status === 'partial' ? 'Một phần' : 'Chưa TT'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}

              {/* Amount */}
              <Text style={styles.formLabel}>Số tiền *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Nhập số tiền"
                placeholderTextColor="#9ca3af"
                keyboardType="decimal-pad"
                value={formAmount}
                onChangeText={setFormAmount}
              />

              {/* Method */}
              <Text style={styles.formLabel}>Phương thức</Text>
              <View style={styles.methodRow}>
                {METHOD_OPTIONS.map((m) => (
                  <TouchableOpacity
                    key={m.id}
                    style={[styles.methodChip, formMethod === m.id && styles.methodChipActive]}
                    onPress={() => setFormMethod(m.id)}
                  >
                    <Text
                      style={[styles.methodChipText, formMethod === m.id && styles.methodChipTextActive]}
                    >
                      {m.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Notes */}
              <Text style={styles.formLabel}>Ghi chú</Text>
              <TextInput
                style={[styles.formInput, { height: 80 }]}
                placeholder="Ghi chú (tùy chọn)"
                placeholderTextColor="#9ca3af"
                multiline
                value={formNotes}
                onChangeText={setFormNotes}
              />

              {/* Submit */}
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (!formAmount || !formInvoiceId || submitting) && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmitPayment}
                disabled={!formAmount || !formInvoiceId || submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.submitButtonText}>Xác nhận thu tiền</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef2ff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eef2ff',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#eef2ff',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#6b7280',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: INDIGO,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 4,
  },
  createButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryInfo: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 11,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  listContainer: {
    paddingHorizontal: 16,
    gap: 10,
  },
  emptyState: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    gap: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  paymentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    flex: 1,
  },
  paymentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentInfo: {
    flex: 1,
  },
  paymentInvoice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  paymentCustomer: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 4,
  },
  paymentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  paymentMethod: {
    fontSize: 11,
    color: '#6b7280',
  },
  paymentDate: {
    fontSize: 11,
    color: '#9ca3af',
  },
  paymentNotes: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 2,
  },
  paymentRight: {
    alignItems: 'flex-end',
  },
  paymentAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
    marginTop: 12,
  },
  formInput: {
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  noInvoicesBox: {
    backgroundColor: '#fef3c7',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  noInvoicesText: {
    fontSize: 13,
    color: '#d97706',
  },
  invoiceSelector: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
  },
  invoiceOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  invoiceOptionSelected: {
    backgroundColor: '#eef2ff',
  },
  invoiceOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  invoiceOptionNumber: {
    fontSize: 13,
    fontWeight: '500',
    color: '#111827',
  },
  invoiceOptionAmount: {
    fontSize: 11,
    color: '#6b7280',
  },
  invoiceOptionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  invoiceOptionBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  methodRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  methodChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
  },
  methodChipActive: {
    backgroundColor: INDIGO,
  },
  methodChipText: {
    fontSize: 13,
    color: '#374151',
  },
  methodChipTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: INDIGO,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
})