import { useState, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
  Switch,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../src/contexts/AuthContext'
import { supabase } from '../../src/lib/supabase'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

// ─── Types ───────────────────────────────────────────────────────────────────

interface TeamWithManager {
  id: string
  name: string
  manager_id: string
  status: 'active' | 'inactive'
  created_at: string
  manager?: { id: string; full_name: string } | null
  member_count: number
}

interface MemberWithProfile {
  id: string
  team_id: string
  sale_id: string
  status: 'active' | 'inactive'
  joined_at: string
  sale?: { id: string; full_name: string; email: string; cap_bac: string | null } | null
}

interface ProfileOption {
  id: string
  full_name: string
  email: string
  cap_bac: string | null
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function TeamManagementScreen() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [teams, setTeams] = useState<TeamWithManager[]>([])
  const [expandedTeamId, setExpandedTeamId] = useState<string | null>(null)
  const [teamMembers, setTeamMembers] = useState<MemberWithProfile[]>([])

  // Create / Edit modal
  const [showTeamModal, setShowTeamModal] = useState(false)
  const [editingTeam, setEditingTeam] = useState<TeamWithManager | null>(null)
  const [teamForm, setTeamForm] = useState({ name: '', manager_id: '', isActive: true })
  const [saving, setSaving] = useState(false)

  // Add member modal
  const [showAddMemberModal, setShowAddMemberModal] = useState(false)
  const [addingToTeamId, setAddingToTeamId] = useState<string | null>(null)
  const [availableSales, setAvailableSales] = useState<ProfileOption[]>([])
  const [selectedSaleId, setSelectedSaleId] = useState('')
  const [saleSearch, setSaleSearch] = useState('')

  // Manager search
  const [managerSearch, setManagerSearch] = useState('')
  const [managerOptions, setManagerOptions] = useState<ProfileOption[]>([])

  useEffect(() => {
    fetchTeams()
  }, [])

  // ─── Data fetching ─────────────────────────────────────────────────────────

  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase
        .from('sales_teams')
        .select('*, manager:profiles!sales_teams_manager_id_fkey(id, full_name)')
        .order('created_at', { ascending: false })

      if (error) throw error

      // Fetch member counts
      const teamsWithCounts = await Promise.all(
        (data || []).map(async (team) => {
          const { count } = await supabase
            .from('team_members')
            .select('*', { count: 'exact', head: true })
            .eq('team_id', team.id)
            .eq('status', 'active')
          return { ...team, member_count: count || 0 }
        })
      )

      setTeams(teamsWithCounts)
    } catch (error) {
      console.error('Error fetching teams:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const fetchTeamMembers = async (teamId: string) => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select(`*, sale:profiles!team_members_sale_id_fkey(id, full_name, email, cap_bac)`)
        .eq('team_id', teamId)

      if (error) throw error
      setTeamMembers(data || [])
    } catch (error) {
      console.error('Error fetching team members:', error)
    }
  }

  const fetchManagerOptions = async (search: string) => {
    try {
      let query = supabase
        .from('profiles')
        .select('id, full_name, email, cap_bac')
        .in('role', ['sale_admin', 'admin'])
        .order('full_name')

      if (search.trim()) {
        query = query.ilike('full_name', `%${search.trim()}%`)
      }

      const { data } = await query.limit(20)
      setManagerOptions(data || [])
    } catch (error) {
      console.error('Error fetching managers:', error)
    }
  }

  const fetchAvailableSales = async (teamId: string) => {
    try {
      // Get all sale profiles that are not already in this team
      const { data: existingMembers } = await supabase
        .from('team_members')
        .select('sale_id')
        .eq('team_id', teamId)

      const existingIds = (existingMembers || []).map((m) => m.sale_id)

      let query = supabase
        .from('profiles')
        .select('id, full_name, email, cap_bac')
        .in('role', ['sale', 'sale_admin'])
        .order('full_name')

      if (existingIds.length > 0) {
        query = query.not('id', 'in', `(${existingIds.join(',')})`)
      }

      const { data } = await query.limit(50)
      setAvailableSales(data || [])
    } catch (error) {
      console.error('Error fetching available sales:', error)
    }
  }

  // ─── Team CRUD ─────────────────────────────────────────────────────────────

  const handleOpenCreateTeam = () => {
    setEditingTeam(null)
    setTeamForm({ name: '', manager_id: '', isActive: true })
    setManagerSearch('')
    setManagerOptions([])
    setShowTeamModal(true)
  }

  const handleOpenEditTeam = (team: TeamWithManager) => {
    setEditingTeam(team)
    setTeamForm({
      name: team.name,
      manager_id: team.manager_id,
      isActive: team.status === 'active',
    })
    setManagerSearch(team.manager?.full_name || '')
    fetchManagerOptions(team.manager?.full_name || '')
    setShowTeamModal(true)
  }

  const handleSaveTeam = async () => {
    if (!teamForm.name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên nhóm')
      return
    }

    try {
      setSaving(true)

      if (editingTeam) {
        const { error } = await supabase
          .from('sales_teams')
          .update({
            name: teamForm.name.trim(),
            manager_id: teamForm.manager_id || null,
            status: teamForm.isActive ? 'active' : 'inactive',
          })
          .eq('id', editingTeam.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from('sales_teams').insert({
          name: teamForm.name.trim(),
          manager_id: teamForm.manager_id || null,
          status: teamForm.isActive ? 'active' : 'inactive',
        })

        if (error) throw error
      }

      setShowTeamModal(false)
      fetchTeams()
    } catch (error) {
      console.error('Error saving team:', error)
      Alert.alert('Lỗi', 'Không thể lưu nhóm')
    } finally {
      setSaving(false)
    }
  }

  // ─── Member actions ────────────────────────────────────────────────────────

  const handleExpandTeam = (teamId: string) => {
    if (expandedTeamId === teamId) {
      setExpandedTeamId(null)
      setTeamMembers([])
    } else {
      setExpandedTeamId(teamId)
      fetchTeamMembers(teamId)
    }
  }

  const handleOpenAddMember = (teamId: string) => {
    setAddingToTeamId(teamId)
    setSelectedSaleId('')
    setSaleSearch('')
    fetchAvailableSales(teamId)
    setShowAddMemberModal(true)
  }

  const handleAddMember = async () => {
    if (!selectedSaleId || !addingToTeamId) return

    try {
      const { error } = await supabase.from('team_members').insert({
        team_id: addingToTeamId,
        sale_id: selectedSaleId,
        status: 'active',
      })

      if (error) throw error

      setShowAddMemberModal(false)
      fetchTeamMembers(addingToTeamId)
      fetchTeams()
    } catch (error) {
      console.error('Error adding member:', error)
      Alert.alert('Lỗi', 'Không thể thêm thành viên')
    }
  }

  const handleRemoveMember = (member: MemberWithProfile) => {
    Alert.alert('Xác nhận', `Xóa ${member.sale?.full_name || 'thành viên'} khỏi nhóm?`, [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          try {
            const { error } = await supabase
              .from('team_members')
              .delete()
              .eq('id', member.id)

            if (error) throw error

            if (expandedTeamId) {
              fetchTeamMembers(expandedTeamId)
              fetchTeams()
            }
          } catch (error) {
            console.error('Error removing member:', error)
            Alert.alert('Lỗi', 'Không thể xóa thành viên')
          }
        },
      },
    ])
  }

  // ─── Refresh ───────────────────────────────────────────────────────────────

  const onRefresh = () => {
    setRefreshing(true)
    fetchTeams()
  }

  // ─── Render ────────────────────────────────────────────────────────────────

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
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quản lý nhóm</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleOpenCreateTeam}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {teams.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>Chưa có nhóm nào</Text>
            <Text style={styles.emptySubtitle}>Tạo nhóm mới để quản lý nhân viên</Text>
            <TouchableOpacity style={styles.emptyButton} onPress={handleOpenCreateTeam}>
              <Ionicons name="add" size={20} color="white" />
              <Text style={styles.emptyButtonText}>Tạo nhóm mới</Text>
            </TouchableOpacity>
          </View>
        ) : (
          teams.map((team) => (
            <View key={team.id} style={styles.teamCard}>
              {/* Team header row */}
              <TouchableOpacity
                style={styles.teamHeader}
                onPress={() => handleExpandTeam(team.id)}
                activeOpacity={0.7}
              >
                <View style={styles.teamInfo}>
                  <Text style={styles.teamName}>{team.name}</Text>
                  <View style={styles.teamMeta}>
                    <Text style={styles.teamManager}>
                      <Ionicons name="person-outline" size={12} color="#6b7280" />{' '}
                      {team.manager?.full_name || 'Chưa gán QL'}
                    </Text>
                    <Text style={styles.teamMemberCount}>
                      <Ionicons name="people-outline" size={12} color="#6b7280" />{' '}
                      {team.member_count} thành viên
                    </Text>
                  </View>
                </View>
                <View style={styles.teamRight}>
                  <View
                    style={[
                      styles.statusBadge,
                      team.status === 'active'
                        ? styles.statusBadgeActive
                        : styles.statusBadgeInactive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        team.status === 'active'
                          ? styles.statusTextActive
                          : styles.statusTextInactive,
                      ]}
                    >
                      {team.status === 'active' ? 'Hoạt động' : 'Ngưng'}
                    </Text>
                  </View>
                  <Ionicons
                    name={expandedTeamId === team.id ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#9ca3af"
                  />
                </View>
              </TouchableOpacity>

              {/* Expanded members list */}
              {expandedTeamId === team.id && (
                <View style={styles.membersSection}>
                  <View style={styles.membersHeader}>
                    <Text style={styles.membersTitle}>Thành viên</Text>
                    <TouchableOpacity
                      style={styles.addMemberBtn}
                      onPress={() => handleOpenAddMember(team.id)}
                    >
                      <Ionicons name="person-add-outline" size={16} color="#ef4444" />
                      <Text style={styles.addMemberBtnText}>Thêm</Text>
                    </TouchableOpacity>
                  </View>

                  {teamMembers.length === 0 ? (
                    <Text style={styles.noMembers}>Chưa có thành viên</Text>
                  ) : (
                    teamMembers.map((member) => (
                      <View key={member.id} style={styles.memberRow}>
                        <View style={styles.memberAvatar}>
                          <Text style={styles.memberAvatarText}>
                            {(member.sale?.full_name || '?')[0].toUpperCase()}
                          </Text>
                        </View>
                        <View style={styles.memberInfo}>
                          <Text style={styles.memberName}>
                            {member.sale?.full_name || 'Không xác định'}
                          </Text>
                          <Text style={styles.memberEmail}>{member.sale?.email || ''}</Text>
                        </View>
                        <View style={styles.memberRight}>
                          <View
                            style={[
                              styles.memberStatus,
                              member.status === 'active'
                                ? styles.memberStatusActive
                                : styles.memberStatusInactive,
                            ]}
                          >
                            <Text
                              style={[
                                styles.memberStatusText,
                                member.status === 'active'
                                  ? styles.memberStatusTextActive
                                  : styles.memberStatusTextInactive,
                              ]}
                            >
                              {member.status === 'active' ? 'Active' : 'Inactive'}
                            </Text>
                          </View>
                          <TouchableOpacity onPress={() => handleRemoveMember(member)}>
                            <Ionicons name="close-circle-outline" size={20} color="#ef4444" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))
                  )}

                  {/* Edit team button */}
                  <TouchableOpacity
                    style={styles.editTeamBtn}
                    onPress={() => handleOpenEditTeam(team)}
                  >
                    <Ionicons name="create-outline" size={16} color="#ef4444" />
                    <Text style={styles.editTeamBtnText}>Chỉnh sửa nhóm</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* ─── Create / Edit Team Modal ──────────────────────────────────────── */}
      <Modal visible={showTeamModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingTeam ? 'Chỉnh sửa nhóm' : 'Tạo nhóm mới'}
              </Text>
              <TouchableOpacity onPress={() => setShowTeamModal(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Team name */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  Tên nhóm <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  value={teamForm.name}
                  onChangeText={(t) => setTeamForm({ ...teamForm, name: t })}
                  placeholder="Nhập tên nhóm"
                  placeholderTextColor="#9ca3af"
                />
              </View>

              {/* Manager selector */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Quản lý nhóm</Text>
                <TextInput
                  style={styles.input}
                  value={managerSearch}
                  onChangeText={(t) => {
                    setManagerSearch(t)
                    setTeamForm({ ...teamForm, manager_id: '' })
                    fetchManagerOptions(t)
                  }}
                  placeholder="Tìm quản lý (sale_admin)..."
                  placeholderTextColor="#9ca3af"
                />
                {teamForm.manager_id === '' && managerSearch.length > 0 && (
                  <View style={styles.dropdownList}>
                    {managerOptions.map((m) => (
                      <TouchableOpacity
                        key={m.id}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setManagerSearch(m.full_name)
                          setTeamForm({ ...teamForm, manager_id: m.id })
                          setManagerOptions([])
                        }}
                      >
                        <Text style={styles.dropdownItemName}>{m.full_name}</Text>
                        <Text style={styles.dropdownItemEmail}>{m.email}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Active toggle */}
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Trạng thái hoạt động</Text>
                <Switch
                  value={teamForm.isActive}
                  onValueChange={(v) => setTeamForm({ ...teamForm, isActive: v })}
                  trackColor={{ false: '#d1d5db', true: '#fca5a5' }}
                  thumbColor={teamForm.isActive ? '#ef4444' : '#f3f4f6'}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowTeamModal(false)}
              >
                <Text style={styles.cancelBtnText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
                onPress={handleSaveTeam}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.saveBtnText}>{editingTeam ? 'Cập nhật' : 'Tạo nhóm'}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ─── Add Member Modal ──────────────────────────────────────────────── */}
      <Modal visible={showAddMemberModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Thêm thành viên</Text>
              <TouchableOpacity onPress={() => setShowAddMemberModal(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <TextInput
                style={styles.input}
                value={saleSearch}
                onChangeText={(t) => {
                  setSaleSearch(t)
                  // Filter locally
                }}
                placeholder="Tìm nhân viên..."
                placeholderTextColor="#9ca3af"
              />

              {availableSales.length === 0 ? (
                <Text style={styles.noResults}>Không có nhân viên khả dụng</Text>
              ) : (
                availableSales
                  .filter(
                    (s) =>
                      !saleSearch.trim() ||
                      s.full_name?.toLowerCase().includes(saleSearch.toLowerCase()) ||
                      s.email?.toLowerCase().includes(saleSearch.toLowerCase())
                  )
                  .map((sale) => (
                    <TouchableOpacity
                      key={sale.id}
                      style={[
                        styles.saleOption,
                        selectedSaleId === sale.id && styles.saleOptionSelected,
                      ]}
                      onPress={() => setSelectedSaleId(sale.id)}
                    >
                      <View style={styles.saleOptionAvatar}>
                        <Text style={styles.saleOptionAvatarText}>
                          {(sale.full_name || '?')[0].toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.saleOptionInfo}>
                        <Text style={styles.saleOptionName}>{sale.full_name}</Text>
                        <Text style={styles.saleOptionEmail}>{sale.email}</Text>
                      </View>
                      {selectedSaleId === sale.id && (
                        <Ionicons name="checkmark-circle" size={24} color="#ef4444" />
                      )}
                    </TouchableOpacity>
                  ))
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowAddMemberModal(false)}
              >
                <Text style={styles.cancelBtnText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.saveBtn,
                  (!selectedSaleId || saving) && styles.saveBtnDisabled,
                ]}
                onPress={handleAddMember}
                disabled={!selectedSaleId || saving}
              >
                {saving ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.saveBtnText}>Thêm</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
    color: '#6b7280',
    fontSize: 14,
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
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },

  // Empty state
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ef4444',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
    marginTop: 8,
  },
  emptyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  // Team card
  teamCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fee2e2',
    overflow: 'hidden',
  },
  teamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  teamInfo: {
    flex: 1,
    gap: 4,
  },
  teamName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  teamMeta: {
    gap: 2,
  },
  teamManager: {
    fontSize: 13,
    color: '#6b7280',
  },
  teamMemberCount: {
    fontSize: 13,
    color: '#6b7280',
  },
  teamRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeActive: {
    backgroundColor: '#dcfce7',
  },
  statusBadgeInactive: {
    backgroundColor: '#f3f4f6',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  statusTextActive: {
    color: '#16a34a',
  },
  statusTextInactive: {
    color: '#6b7280',
  },

  // Members section
  membersSection: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  membersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  membersTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  addMemberBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addMemberBtnText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#ef4444',
  },
  noMembers: {
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
    paddingVertical: 8,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f9fafb',
    gap: 10,
  },
  memberAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberAvatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ef4444',
  },
  memberInfo: {
    flex: 1,
    gap: 1,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  memberEmail: {
    fontSize: 12,
    color: '#9ca3af',
  },
  memberRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  memberStatus: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  memberStatusActive: {
    backgroundColor: '#dcfce7',
  },
  memberStatusInactive: {
    backgroundColor: '#f3f4f6',
  },
  memberStatusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  memberStatusTextActive: {
    color: '#16a34a',
  },
  memberStatusTextInactive: {
    color: '#6b7280',
  },
  editTeamBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 6,
    marginTop: 4,
  },
  editTeamBtnText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#ef4444',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
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
    fontWeight: '600',
    color: '#111827',
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  required: {
    color: '#ef4444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#f9fafb',
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    maxHeight: 160,
    marginTop: 4,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  dropdownItemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  dropdownItemEmail: {
    fontSize: 12,
    color: '#9ca3af',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cancelBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#ef4444',
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },

  // Add member modal
  noResults: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    paddingVertical: 20,
  },
  saleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    gap: 10,
    borderRadius: 8,
  },
  saleOptionSelected: {
    backgroundColor: '#fef2f2',
  },
  saleOptionAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saleOptionAvatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ef4444',
  },
  saleOptionInfo: {
    flex: 1,
  },
  saleOptionName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  saleOptionEmail: {
    fontSize: 12,
    color: '#9ca3af',
  },
})
