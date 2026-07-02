import { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  Modal,
  TextInput,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../src/contexts/AuthContext'
import { supabase } from '../../src/lib/supabase'
import { Ionicons } from '@expo/vector-icons'

// ─── Types ───────────────────────────────────────────────────────────────────

type ApprovalStatus = 'pending' | 'approved' | 'rejected'
type ApprovalType = 'discount' | 'order' | 'price_change'

interface ApprovalRequest {
  id: string
  type: ApprovalType
  requester_id: string
  status: ApprovalStatus
  data: Record<string, unknown> | null
  notes: string | null
  reviewer_id: string | null
  reviewed_at: string | null
  created_at: string
  requester?: { id: string; full_name: string } | null
  reviewer?: { id: string; full_name: string } | null
}

interface ProfileLookup {
  [key: string]: string
}

// ─── Constants ───────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<ApprovalType, { label: string; color: string; bg: string; icon: keyof typeof Ionicons.glyphMap }> = {
  discount: { label: 'Chiết khấu', color: '#7c3aed', bg: '#f5f3ff', icon: 'pricetag' },
  order: { label: 'Đơn hàng', color: '#2563eb', bg: '#eff6ff', icon: 'receipt' },
  price_change: { label: 'Thay đổi giá', color: '#ea580c', bg: '#fff7ed', icon: 'swap-vertical' },
}

const STATUS_CONFIG: Record<ApprovalStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'Chờ duyệt', color: '#d97706', bg: '#fef3c7' },
  approved: { label: 'Đã duyệt', color: '#16a34a', bg: '#dcfce7' },
  rejected: { label: 'Từ chối', color: '#dc2626', bg: '#fee2e2' },
}

const TABS: { key: ApprovalStatus; label: string }[] = [
  { key: 'pending', label: 'Chờ duyệt' },
  { key: 'approved', label: 'Đã duyệt' },
  { key: 'rejected', label: 'Từ chối' },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

function getRelativeTime(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diffMs = now - then
  const diffMin = Math.floor(diffMs / 60000)
  const diffHr = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24)

  if (diffMin < 1) return 'Vừa xong'
  if (diffMin < 60) return `${diffMin} phút trước`
  if (diffHr < 24) return `${diffHr} giờ trước`
  if (diffDay < 7) return `${diffDay} ngày trước`
  return new Date(dateStr).toLocaleDateString('vi-VN')
}

function getTypeLabel(type: string): string {
  return TYPE_CONFIG[type as ApprovalType]?.label ?? type
}

function getDescription(request: ApprovalRequest): string {
  const data = request.data
  if (!data) return request.notes || 'Không có mô tả'

  switch (request.type) {
    case 'discount':
      return `Yêu cầu chiết khấu${data.customer_name ? ` cho ${data.customer_name}` : ''}${data.percentage ? ` ${data.percentage}%` : ''}`
    case 'order':
      return `Đơn hàng${data.order_code ? ` ${data.order_code}` : ''}${data.customer_name ? ` - ${data.customer_name}` : ''}`
    case 'price_change':
      return `Thay đổi giá${data.product_name ? ` sản phẩm ${data.product_name}` : ''}`
    default:
      return request.notes || 'Không có mô tả'
  }
}

function getAmount(request: ApprovalRequest): number | null {
  if (!request.data) return null
  const amount = request.data.amount as number | undefined
  return amount != null ? amount : null
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ApprovalsScreen() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [tableExists, setTableExists] = useState(true)
  const [requests, setRequests] = useState<ApprovalRequest[]>([])
  const [activeTab, setActiveTab] = useState<ApprovalStatus>('pending')
  const [profiles, setProfiles] = useState<ProfileLookup>({})

  // Reject modal
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('approval_requests')
        .select('*, requester:profiles!approval_requests_requester_id_fkey(id, full_name), reviewer:profiles!approval_requests_reviewer_id_fkey(id, full_name)')
        .order('created_at', { ascending: false })

      if (error) {
        // If the table doesn't exist, Supabase returns an error like
        // "relation 'approval_requests' does not exist"
        if (error.message?.includes('does not exist') || error.code === '42P01') {
          setTableExists(false)
        } else {
          throw error
        }
        return
      }

      setTableExists(true)
      const rows = (data || []) as ApprovalRequest[]
      setRequests(rows)

      // Build profile lookup from fetched data
      const lookup: ProfileLookup = {}
      for (const r of rows) {
        if (r.requester?.id && r.requester?.full_name) {
          lookup[r.requester.id] = r.requester.full_name
        }
        if (r.reviewer?.id && r.reviewer?.full_name) {
          lookup[r.reviewer.id] = r.reviewer.full_name
        }
      }
      setProfiles(lookup)
    } catch (error) {
      console.error('Error fetching approvals:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  const onRefresh = () => {
    setRefreshing(true)
    fetchRequests()
  }

  // ─── Actions ───────────────────────────────────────────────────────────────

  const handleApprove = async (id: string) => {
    if (!user) return
    Alert.alert('Xác nhận duyệt', 'Bạn có chắc chắn muốn duyệt yêu cầu này?', [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'Duyệt',
        style: 'default',
        onPress: async () => {
          setSubmitting(true)
          try {
            const { error } = await supabase
              .from('approval_requests')
              .update({
                status: 'approved',
                reviewer_id: user.id,
                reviewed_at: new Date().toISOString(),
              })
              .eq('id', id)
            if (error) throw error
            setRequests((prev) =>
              prev.map((r) => (r.id === id ? { ...r, status: 'approved' as ApprovalStatus, reviewer_id: user.id, reviewed_at: new Date().toISOString() } : r))
            )
          } catch (error) {
            console.error('Error approving request:', error)
            Alert.alert('Lỗi', 'Không thể duyệt yêu cầu. Vui lòng thử lại.')
          } finally {
            setSubmitting(false)
          }
        },
      },
    ])
  }

  const openRejectModal = (id: string) => {
    setRejectingId(id)
    setRejectReason('')
    setShowRejectModal(true)
  }

  const handleReject = async () => {
    if (!user || !rejectingId) return
    setSubmitting(true)
    try {
      const { error } = await supabase
        .from('approval_requests')
        .update({
          status: 'rejected',
          reviewer_id: user.id,
          reviewed_at: new Date().toISOString(),
          notes: rejectReason.trim() || null,
        })
        .eq('id', rejectingId)
      if (error) throw error
      setRequests((prev) =>
        prev.map((r) =>
          r.id === rejectingId
            ? { ...r, status: 'rejected' as ApprovalStatus, reviewer_id: user.id, reviewed_at: new Date().toISOString(), notes: rejectReason.trim() || null }
            : r
        )
      )
      setShowRejectModal(false)
      setRejectingId(null)
      setRejectReason('')
    } catch (error) {
      console.error('Error rejecting request:', error)
      Alert.alert('Lỗi', 'Không thể từ chối yêu cầu. Vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  // ─── Derived data ──────────────────────────────────────────────────────────

  const pendingCount = requests.filter((r) => r.status === 'pending').length
  const filteredRequests = requests.filter((r) => r.status === activeTab)

  // ─── Render ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ef4444" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="checkmark-done" size={24} color="#ef4444" />
          <Text style={styles.headerTitle}>Phê duyệt</Text>
          {pendingCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{pendingCount}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Status Tabs */}
      <View style={styles.tabBar}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key
          const count = requests.filter((r) => r.status === tab.key).length
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
                {tab.label}
              </Text>
              {count > 0 && (
                <View style={[styles.tabCount, isActive && styles.activeTabCount]}>
                  <Text style={[styles.tabCountText, isActive && styles.activeTabCountText]}>
                    {count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )
        })}
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {!tableExists ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="construct" size={48} color="#d1d5db" />
            <Text style={styles.emptyTitle}>Tính năng đang phát triển</Text>
            <Text style={styles.emptySubtitle}>
              Bảng phê duyệt chưa được tạo. Vui lòng liên hệ quản trị viên.
            </Text>
          </View>
        ) : filteredRequests.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons
              name={activeTab === 'pending' ? 'checkmark-circle-outline' : activeTab === 'approved' ? 'checkmark-done-circle' : 'close-circle'}
              size={48}
              color="#d1d5db"
            />
            <Text style={styles.emptyTitle}>
              {activeTab === 'pending'
                ? 'Không có yêu cầu chờ duyệt'
                : activeTab === 'approved'
                  ? 'Chưa có yêu cầu nào được duyệt'
                  : 'Chưa có yêu cầu nào bị từ chối'}
            </Text>
            <Text style={styles.emptySubtitle}>Kéo xuống để làm mới</Text>
          </View>
        ) : (
          filteredRequests.map((request) => (
            <ApprovalCard
              key={request.id}
              request={request}
              profiles={profiles}
              onApprove={handleApprove}
              onReject={openRejectModal}
              submitting={submitting}
            />
          ))
        )}
      </ScrollView>

      {/* Reject Modal */}
      <Modal visible={showRejectModal} transparent animationType="fade" onRequestClose={() => setShowRejectModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Từ chối yêu cầu</Text>
              <TouchableOpacity onPress={() => setShowRejectModal(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalLabel}>Lý do từ chối</Text>
            <TextInput
              style={styles.modalInput}
              value={rejectReason}
              onChangeText={setRejectReason}
              placeholder="Nhập lý do từ chối..."
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={3}
              autoFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowRejectModal(false)}
              >
                <Text style={styles.modalCancelText}>Huỷ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalRejectBtn, submitting && styles.disabledBtn]}
                onPress={handleReject}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.modalRejectText}>Từ chối</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ApprovalCard({
  request,
  profiles,
  onApprove,
  onReject,
  submitting,
}: {
  request: ApprovalRequest
  profiles: ProfileLookup
  onApprove: (id: string) => void
  onReject: (id: string) => void
  submitting: boolean
}) {
  const typeConf = TYPE_CONFIG[request.type] || TYPE_CONFIG.order
  const statusConf = STATUS_CONFIG[request.status]
  const amount = getAmount(request)
  const requesterName = request.requester?.full_name || profiles[request.requester_id] || 'Không xác định'
  const reviewerName = request.reviewer?.full_name || (request.reviewer_id ? profiles[request.reviewer_id] : null)

  return (
    <View style={styles.card}>
      {/* Card Header: type badge + status */}
      <View style={styles.cardHeader}>
        <View style={[styles.typeBadge, { backgroundColor: typeConf.bg }]}>
          <Ionicons name={typeConf.icon} size={14} color={typeConf.color} />
          <Text style={[styles.typeBadgeText, { color: typeConf.color }]}>{typeConf.label}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusConf.bg }]}>
          <Text style={[styles.statusBadgeText, { color: statusConf.color }]}>{statusConf.label}</Text>
        </View>
      </View>

      {/* Requester */}
      <View style={styles.cardRow}>
        <Ionicons name="person-outline" size={16} color="#6b7280" />
        <Text style={styles.cardLabel}>Người yêu cầu:</Text>
        <Text style={styles.cardValue}>{requesterName}</Text>
      </View>

      {/* Description */}
      <Text style={styles.cardDescription}>{getDescription(request)}</Text>

      {/* Amount */}
      {amount != null && (
        <View style={styles.cardRow}>
          <Ionicons name="cash-outline" size={16} color="#6b7280" />
          <Text style={styles.cardLabel}>Số tiền:</Text>
          <Text style={styles.cardAmount}>{formatVND(amount)}</Text>
        </View>
      )}

      {/* Notes */}
      {request.notes && request.status !== 'rejected' && (
        <View style={styles.cardRow}>
          <Ionicons name="document-text-outline" size={16} color="#6b7280" />
          <Text style={styles.cardLabel}>Ghi chú:</Text>
          <Text style={styles.cardValue} numberOfLines={2}>{request.notes}</Text>
        </View>
      )}

      {/* Rejection reason */}
      {request.status === 'rejected' && request.notes && (
        <View style={styles.rejectionReason}>
          <Ionicons name="alert-circle-outline" size={14} color="#dc2626" />
          <Text style={styles.rejectionText} numberOfLines={2}>{request.notes}</Text>
        </View>
      )}

      {/* Footer: date + reviewer */}
      <View style={styles.cardFooter}>
        <View style={styles.cardRow}>
          <Ionicons name="time-outline" size={14} color="#9ca3af" />
          <Text style={styles.cardDate}>{getRelativeTime(request.created_at)}</Text>
        </View>
        {reviewerName && (
          <View style={styles.cardRow}>
            <Ionicons name="checkmark-circle-outline" size={14} color="#9ca3af" />
            <Text style={styles.cardReviewer}>bởi {reviewerName}</Text>
          </View>
        )}
      </View>

      {/* Action buttons for pending */}
      {request.status === 'pending' && (
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[styles.approveBtn, submitting && styles.disabledBtn]}
            onPress={() => onApprove(request.id)}
            disabled={submitting}
          >
            <Ionicons name="checkmark-circle" size={18} color="white" />
            <Text style={styles.approveBtnText}>Duyệt</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.rejectBtn, submitting && styles.disabledBtn]}
            onPress={() => onReject(request.id)}
            disabled={submitting}
          >
            <Ionicons name="close-circle" size={18} color="white" />
            <Text style={styles.rejectBtnText}>Từ chối</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fef2f2',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fef2f2',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  badge: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fef2f2',
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 6,
  },
  activeTab: {
    backgroundColor: '#ef4444',
    borderColor: '#ef4444',
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  activeTabLabel: {
    color: 'white',
  },
  tabCount: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  activeTabCount: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  tabCountText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  activeTabCountText: {
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 32,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 64,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9ca3af',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#d1d5db',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardLabel: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  cardValue: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '500',
    flex: 1,
  },
  cardDescription: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    lineHeight: 20,
  },
  cardAmount: {
    fontSize: 14,
    color: '#ef4444',
    fontWeight: '700',
  },
  rejectionReason: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: '#fef2f2',
    padding: 10,
    borderRadius: 8,
  },
  rejectionText: {
    fontSize: 13,
    color: '#dc2626',
    flex: 1,
    fontStyle: 'italic',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  cardDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  cardReviewer: {
    fontSize: 12,
    color: '#9ca3af',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 6,
  },
  approveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#16a34a',
    paddingVertical: 10,
    borderRadius: 10,
  },
  approveBtnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  rejectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#dc2626',
    paddingVertical: 10,
    borderRadius: 10,
  },
  rejectBtnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  disabledBtn: {
    opacity: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    gap: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#111827',
    textAlignVertical: 'top',
    minHeight: 80,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  modalRejectBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#dc2626',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  modalRejectText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
})
