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
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../src/contexts/AuthContext'
import { supabase } from '../../src/lib/supabase'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

// ─── Constants ───────────────────────────────────────────────────────────────

const CAP_BAC_LEVELS = [
  { key: 'manager', label: 'Quản lý', icon: 'ribbon' as const, color: '#e11d48', bg: '#ffe4e6' },
  { key: 'leader', label: 'Trưởng nhóm', icon: 'star' as const, color: '#7c3aed', bg: '#f3e8ff' },
  { key: 'senior', label: 'Cao cấp', icon: 'flash' as const, color: '#2563eb', bg: '#dbeafe' },
  { key: 'junior', label: 'Nhân viên', icon: 'person' as const, color: '#6b7280', bg: '#f3f4f6' },
]

const CAP_BAC_MAP: Record<string, { label: string; color: string; bg: string }> = {
  manager: { label: 'Manager', color: '#e11d48', bg: '#ffe4e6' },
  leader: { label: 'Leader', color: '#7c3aed', bg: '#f3e8ff' },
  senior: { label: 'Senior', color: '#2563eb', bg: '#dbeafe' },
  junior: { label: 'Junior', color: '#6b7280', bg: '#f3f4f6' },
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface SalesPerson {
  id: string
  full_name: string
  email: string
  cap_bac: string | null
  role: string
  region_id: string | null
  region_name: string | null
  team_id: string | null
  team_name: string | null
  subordinate_count: number
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function HierarchyScreen() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [salesPeople, setSalesPeople] = useState<SalesPerson[]>([])
  const [regionFilter, setRegionFilter] = useState<string | null>(null)
  const [regions, setRegions] = useState<{ id: string; name: string }[]>([])

  // Edit cap_bac modal
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingPerson, setEditingPerson] = useState<SalesPerson | null>(null)
  const [selectedCapBac, setSelectedCapBac] = useState<string>('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch sales profiles with region info
      const { data: profilesData, error } = await supabase
        .from('profiles')
        .select(`id, full_name, email, cap_bac, role, region_id, regions:region_id(id, name)`)
        .in('role', ['sale', 'sale_admin'])
        .order('full_name')

      if (error) throw error

      // Fetch team memberships
      const { data: teamMembersData } = await supabase
        .from('team_members')
        .select('sale_id, team_id, sales_teams:sales_teams(id, name)')
        .eq('status', 'active')

      const teamMap: Record<string, { team_id: string; team_name: string }> = {}
      ;(teamMembersData || []).forEach((tm: any) => {
        if (tm.sale_id) {
          teamMap[tm.sale_id] = {
            team_id: tm.team_id,
            team_name: tm.sales_teams?.name || null,
          }
        }
      })

      // Build sales people list
      const people: SalesPerson[] = (profilesData || []).map((p: any) => ({
        id: p.id,
        full_name: p.full_name || 'Không xác định',
        email: p.email || '',
        cap_bac: p.cap_bac || null,
        role: p.role,
        region_id: p.region_id || null,
        region_name: p.regions?.name || null,
        team_id: teamMap[p.id]?.team_id || null,
        team_name: teamMap[p.id]?.team_name || null,
        subordinate_count: 0, // Will count below
      }))

      // Count subordinates: for managers/leaders, count people in their team
      const managerIds = people
        .filter((p) => p.cap_bac === 'manager' || p.cap_bac === 'leader')
        .map((p) => p.id)

      if (managerIds.length > 0) {
        const { data: subordinateData } = await supabase
          .from('team_members')
          .select('team_id, sales_teams!team_members_team_id_fkey(manager_id)')
          .eq('status', 'active')

        ;(subordinateData || []).forEach((sub: any) => {
          const managerId = sub.sales_teams?.manager_id
          if (managerId) {
            const person = people.find((p) => p.id === managerId)
            if (person) {
              person.subordinate_count += 1
            }
          }
        })
      }

      setSalesPeople(people)

      // Extract unique regions
      const uniqueRegions = Array.from(
        new Map(
          people
            .filter((p) => p.region_id && p.region_name)
            .map((p) => [p.region_id, { id: p.region_id!, name: p.region_name! }])
        ).values()
      )
      setRegions(uniqueRegions as { id: string; name: string }[])
    } catch (error) {
      console.error('Error fetching hierarchy:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    fetchData()
  }

  // ─── Edit cap_bac ─────────────────────────────────────────────────────────

  const handleOpenEdit = (person: SalesPerson) => {
    setEditingPerson(person)
    setSelectedCapBac(person.cap_bac || 'junior')
    setShowEditModal(true)
  }

  const handleSaveCapBac = async () => {
    if (!editingPerson) return

    try {
      setSaving(true)
      const { error } = await supabase
        .from('profiles')
        .update({ cap_bac: selectedCapBac })
        .eq('id', editingPerson.id)

      if (error) throw error

      setShowEditModal(false)
      fetchData()
    } catch (error) {
      console.error('Error updating cap_bac:', error)
      Alert.alert('Lỗi', 'Không thể cập nhật cấp bậc')
    } finally {
      setSaving(false)
    }
  }

  // ─── Filtered data ────────────────────────────────────────────────────────

  const filteredPeople = regionFilter
    ? salesPeople.filter((p) => p.region_id === regionFilter)
    : salesPeople

  const getPeopleByLevel = (levelKey: string) =>
    filteredPeople.filter((p) => (p.cap_bac || 'junior') === levelKey)

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
        <Text style={styles.headerTitle}>Cấp bậc kinh doanh</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Region filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
        <TouchableOpacity
          style={[styles.filterChip, !regionFilter && styles.filterChipActive]}
          onPress={() => setRegionFilter(null)}
        >
          <Text style={[styles.filterChipText, !regionFilter && styles.filterChipTextActive]}>
            Tất cả
          </Text>
        </TouchableOpacity>
        {regions.map((r) => (
          <TouchableOpacity
            key={r.id}
            style={[styles.filterChip, regionFilter === r.id && styles.filterChipActive]}
            onPress={() => setRegionFilter(r.id)}
          >
            <Text
              style={[styles.filterChipText, regionFilter === r.id && styles.filterChipTextActive]}
            >
              {r.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {CAP_BAC_LEVELS.map((level) => {
          const peopleInLevel = getPeopleByLevel(level.key)
          if (peopleInLevel.length === 0 && regionFilter) return null

          return (
            <View key={level.key} style={styles.levelSection}>
              {/* Level header */}
              <View style={styles.levelHeader}>
                <View style={[styles.levelIcon, { backgroundColor: level.bg }]}>
                  <Ionicons name={level.icon} size={18} color={level.color} />
                </View>
                <Text style={styles.levelTitle}>{level.label}</Text>
                <View style={[styles.levelCount, { backgroundColor: level.bg }]}>
                  <Text style={[styles.levelCountText, { color: level.color }]}>
                    {peopleInLevel.length}
                  </Text>
                </View>
              </View>

              {/* People cards */}
              {peopleInLevel.length === 0 ? (
                <Text style={styles.emptyLevel}>Chưa có nhân viên ở cấp này</Text>
              ) : (
                <View style={styles.peopleGrid}>
                  {peopleInLevel.map((person) => {
                    const cb = CAP_BAC_MAP[person.cap_bac || ''] || {
                      label: person.cap_bac || '—',
                      color: '#6b7280',
                      bg: '#f3f4f6',
                    }
                    return (
                      <TouchableOpacity
                        key={person.id}
                        style={styles.personCard}
                        onPress={() => handleOpenEdit(person)}
                        activeOpacity={0.7}
                      >
                        {/* Avatar */}
                        <View style={[styles.personAvatar, { backgroundColor: cb.bg }]}>
                          <Text style={[styles.personAvatarText, { color: cb.color }]}>
                            {person.full_name[0]?.toUpperCase() || '?'}
                          </Text>
                        </View>

                        {/* Name */}
                        <Text style={styles.personName} numberOfLines={1}>
                          {person.full_name}
                        </Text>

                        {/* Cap_bac badge */}
                        <View style={[styles.capBacBadge, { backgroundColor: cb.bg }]}>
                          <Text style={[styles.capBacBadgeText, { color: cb.color }]}>
                            {cb.label}
                          </Text>
                        </View>

                        {/* Region */}
                        <Text style={styles.personDetail} numberOfLines={1}>
                          <Ionicons name="location-outline" size={11} color="#9ca3af" />{' '}
                          {person.region_name || 'Chưa phân vùng'}
                        </Text>

                        {/* Team */}
                        <Text style={styles.personDetail} numberOfLines={1}>
                          <Ionicons name="people-outline" size={11} color="#9ca3af" />{' '}
                          {person.team_name || 'Chưa có nhóm'}
                        </Text>

                        {/* Subordinates */}
                        {person.subordinate_count > 0 && (
                          <Text style={styles.personDetail}>
                            <Ionicons name="git-branch-outline" size={11} color="#9ca3af" />{' '}
                            {person.subordinate_count} cấp dưới
                          </Text>
                        )}

                        {/* Edit hint */}
                        <View style={styles.editHint}>
                          <Ionicons name="pencil-outline" size={12} color="#ef4444" />
                          <Text style={styles.editHintText}>Sửa cấp bậc</Text>
                        </View>
                      </TouchableOpacity>
                    )
                  })}
                </View>
              )}
            </View>
          )
        })}
      </ScrollView>

      {/* ─── Edit Cap Bac Modal ────────────────────────────────────────────── */}
      <Modal visible={showEditModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Thay đổi cấp bậc</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              {/* Person info */}
              {editingPerson && (
                <View style={styles.editPersonInfo}>
                  <View style={styles.editPersonAvatar}>
                    <Text style={styles.editPersonAvatarText}>
                      {editingPerson.full_name[0]?.toUpperCase() || '?'}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.editPersonName}>{editingPerson.full_name}</Text>
                    <Text style={styles.editPersonEmail}>{editingPerson.email}</Text>
                  </View>
                </View>
              )}

              <Text style={styles.selectLabel}>Chọn cấp bậc mới</Text>
              {CAP_BAC_LEVELS.map((level) => (
                <TouchableOpacity
                  key={level.key}
                  style={[
                    styles.levelOption,
                    selectedCapBac === level.key && styles.levelOptionSelected,
                  ]}
                  onPress={() => setSelectedCapBac(level.key)}
                >
                  <View style={[styles.levelOptionIcon, { backgroundColor: level.bg }]}>
                    <Ionicons name={level.icon} size={18} color={level.color} />
                  </View>
                  <Text style={styles.levelOptionLabel}>{level.label}</Text>
                  {selectedCapBac === level.key && (
                    <Ionicons name="checkmark-circle" size={22} color="#ef4444" />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.cancelBtnText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
                onPress={handleSaveCapBac}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.saveBtnText}>Cập nhật</Text>
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

  // Filter bar
  filterBar: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#ef4444',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6b7280',
  },
  filterChipTextActive: {
    color: 'white',
  },

  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 20,
  },

  // Level section
  levelSection: {
    gap: 10,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  levelIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  levelCount: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  levelCountText: {
    fontSize: 12,
    fontWeight: '700',
  },
  emptyLevel: {
    fontSize: 13,
    color: '#9ca3af',
    paddingLeft: 40,
  },

  // People grid
  peopleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingLeft: 8,
  },
  personCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    minWidth: '47%',
    flex: 1,
    maxWidth: '50%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fee2e2',
    gap: 4,
  },
  personAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  personAvatarText: {
    fontSize: 18,
    fontWeight: '700',
  },
  personName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
  capBacBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 2,
  },
  capBacBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  personDetail: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
  },
  editHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 4,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  editHintText: {
    fontSize: 10,
    color: '#ef4444',
    fontWeight: '500',
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
  editPersonInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  editPersonAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editPersonAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ef4444',
  },
  editPersonName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  editPersonEmail: {
    fontSize: 13,
    color: '#6b7280',
  },
  selectLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 10,
  },
  levelOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 10,
  },
  levelOptionSelected: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  levelOptionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelOptionLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
    flex: 1,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
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
})
