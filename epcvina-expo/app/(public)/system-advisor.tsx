import { useMemo, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

type SystemGoal = 'tiet_kiem' | 'o_dinh' | 'kinh_doanh'

const OPTIONS: Array<{
  id: SystemGoal
  title: string
  subtitle: string
  icon: keyof typeof Ionicons.glyphMap
  accent: string
  background: string
}> = [
  {
    id: 'tiet_kiem',
    title: 'Tiết kiệm điện',
    subtitle: 'Giảm hóa đơn hàng tháng, ưu tiên hoàn vốn nhanh',
    icon: 'flash',
    accent: '#175ead',
    background: '#dbeafe',
  },
  {
    id: 'o_dinh',
    title: 'Ổn định sử dụng',
    subtitle: 'Ưu tiên độ bền, vận hành an toàn và dễ bảo trì',
    icon: 'shield-checkmark',
    accent: '#10b981',
    background: '#d1fae5',
  },
  {
    id: 'kinh_doanh',
    title: 'Kinh doanh / xưởng',
    subtitle: 'Công suất lớn, tối ưu theo tải và khả năng mở rộng',
    icon: 'business',
    accent: '#f59e0b',
    background: '#fef3c7',
  },
]

export default function SystemAdvisorScreen() {
  const [goal, setGoal] = useState<SystemGoal>('tiet_kiem')
  const [monthlyBill, setMonthlyBill] = useState('')
  const [roofArea, setRoofArea] = useState('')

  const monthlyBillValue = Number(monthlyBill.replace(/[^\d]/g, ''))
  const roofAreaValue = Number(roofArea.replace(/[^\d]/g, ''))

  const suggestion = useMemo(() => {
    if (goal === 'kinh_doanh') {
      return {
        title: 'Giải pháp hệ thống công suất lớn',
        description: 'Phù hợp nhà xưởng, cửa hàng, hoặc mô hình cần mở rộng theo giai đoạn.',
        points: ['Khảo sát tải điện thực tế', 'Ưu tiên inverter và tấm pin dễ scale', 'Tính phương án bảo trì định kỳ'],
      }
    }

    if (goal === 'o_dinh') {
      return {
        title: 'Giải pháp vận hành ổn định',
        description: 'Phù hợp gia đình hoặc công trình cần hoạt động bền bỉ, ít phải can thiệp.',
        points: ['Chọn thiết bị có bảo hành rõ ràng', 'Tối ưu an toàn điện và chống sét', 'Ưu tiên cấu hình đơn giản, dễ theo dõi'],
      }
    }

    return {
      title: 'Giải pháp tiết kiệm chi phí',
      description: 'Phù hợp khách hàng muốn tối ưu tiền điện và hoàn vốn trong thời gian hợp lý.',
      points: ['Ước lượng công suất theo hóa đơn điện', 'Ưu tiên cấu hình vừa đủ nhu cầu', 'Cân nhắc khả năng mở rộng sau này'],
    }
  }, [goal])

  const estimatedCapacity = useMemo(() => {
    if (goal === 'kinh_doanh') return '10-50 kWp'
    if (goal === 'o_dinh') return '3-10 kWp'
    return '5-15 kWp'
  }, [goal])

  const billLabel = monthlyBillValue > 0 ? `${monthlyBillValue.toLocaleString('vi-VN')} đ/tháng` : 'Chưa nhập'
  const roofLabel = roofAreaValue > 0 ? `${roofAreaValue} m²` : 'Chưa nhập'

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <View style={styles.heroBadge}>
            <Ionicons name="sunny" size={16} color="#175ead" />
            <Text style={styles.heroBadgeText}>EPCVINA Solar Advisor</Text>
          </View>
          <Text style={styles.title}>Tư vấn hệ thống điện mặt trời</Text>
          <Text style={styles.subtitle}>
            Chọn mục tiêu sử dụng để xem gợi ý cấu hình phù hợp. Trang này hoạt động công khai, không cần đăng nhập.
          </Text>
          <View style={styles.heroStats}>
            <View style={styles.heroStatCard}>
              <Text style={styles.heroStatLabel}>Công suất gợi ý</Text>
              <Text style={styles.heroStatValue}>{estimatedCapacity}</Text>
            </View>
            <View style={styles.heroStatCard}>
              <Text style={styles.heroStatLabel}>Phong cách EPCVINA</Text>
              <Text style={styles.heroStatValue}>Gọn, rõ, dễ mở rộng</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Mục tiêu của bạn</Text>
          <View style={styles.optionGrid}>
            {OPTIONS.map(option => {
              const active = goal === option.id
              return (
                <TouchableOpacity
                  key={option.id}
                  style={[styles.optionCard, active && { borderColor: option.accent, backgroundColor: option.background }]}
                  onPress={() => setGoal(option.id)}
                  activeOpacity={0.85}
                >
                  <View style={[styles.optionIcon, { backgroundColor: option.background }]}>
                    <Ionicons name={option.icon} size={22} color={option.accent} />
                  </View>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Thông tin tham khảo</Text>
          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Hóa đơn điện/tháng</Text>
              <TextInput
                value={monthlyBill}
                onChangeText={setMonthlyBill}
                keyboardType="numeric"
                placeholder="Ví dụ: 2500000"
                placeholderTextColor="#9ca3af"
                style={styles.input}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Diện tích mái</Text>
              <TextInput
                value={roofArea}
                onChangeText={setRoofArea}
                keyboardType="numeric"
                placeholder="Ví dụ: 80"
                placeholderTextColor="#9ca3af"
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.assessmentPillRow}>
            <View style={styles.assessmentPill}>
              <Text style={styles.assessmentPillLabel}>Hóa đơn điện</Text>
              <Text style={styles.assessmentPillValue}>{billLabel}</Text>
            </View>
            <View style={styles.assessmentPill}>
              <Text style={styles.assessmentPillLabel}>Diện tích mái</Text>
              <Text style={styles.assessmentPillValue}>{roofLabel}</Text>
            </View>
          </View>
        </View>

        <View style={styles.highlightCard}>
          <View style={styles.highlightHeader}>
            <Ionicons name="sparkles" size={20} color="#0f766e" />
            <Text style={styles.highlightTitle}>{suggestion.title}</Text>
          </View>
          <Text style={styles.highlightDescription}>{suggestion.description}</Text>
          <View style={styles.pointList}>
            {suggestion.points.map(point => (
              <View key={point} style={styles.pointRow}>
                <View style={styles.pointDot} />
                <Text style={styles.pointText}>{point}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.ctaRow}>
          <TouchableOpacity style={styles.primaryCta} onPress={() => router.push('/(public)/products')}>
            <Ionicons name="cube" size={18} color="#fff" />
            <Text style={styles.primaryCtaText}>Xem sản phẩm</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryCta} onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.secondaryCtaText}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  assessmentPill: {
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    gap: 4,
    padding: 12,
  },
  assessmentPillLabel: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
  },
  assessmentPillRow: {
    flexDirection: 'row',
    gap: 10,
  },
  assessmentPillValue: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#fff',
    borderColor: '#e2e8f0',
    borderRadius: 24,
    borderWidth: 1,
    gap: 14,
    padding: 16,
  },
  content: {
    gap: 16,
    padding: 20,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: 12,
  },
  hero: {
    gap: 10,
    paddingVertical: 8,
  },
  heroBadge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#dbeafe',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  heroBadgeText: {
    color: '#175ead',
    fontSize: 12,
    fontWeight: '700',
  },
  heroStatCard: {
    backgroundColor: '#fff',
    borderColor: '#dbeafe',
    borderRadius: 18,
    borderWidth: 1,
    flexGrow: 1,
    gap: 4,
    minWidth: 150,
    padding: 14,
  },
  heroStatLabel: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
  },
  heroStatValue: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '800',
  },
  heroStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingTop: 4,
  },
  highlightCard: {
    backgroundColor: '#ecfeff',
    borderColor: '#a5f3fc',
    borderRadius: 24,
    borderWidth: 1,
    gap: 10,
    padding: 16,
  },
  highlightDescription: {
    color: '#0f172a',
    fontSize: 14,
    lineHeight: 21,
  },
  highlightHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  highlightTitle: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '800',
  },
  input: {
    backgroundColor: '#f8fafc',
    borderColor: '#cbd5e1',
    borderRadius: 16,
    borderWidth: 1,
    color: '#0f172a',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  inputGroup: {
    gap: 8,
  },
  inputRow: {
    gap: 12,
  },
  label: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '700',
  },
  optionCard: {
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
    borderRadius: 20,
    borderWidth: 1,
    gap: 8,
    padding: 14,
  },
  optionGrid: {
    gap: 12,
  },
  optionIcon: {
    alignItems: 'center',
    borderRadius: 12,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  optionSubtitle: {
    color: '#64748b',
    fontSize: 13,
    lineHeight: 19,
  },
  optionTitle: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '700',
  },
  pointDot: {
    backgroundColor: '#0f766e',
    borderRadius: 999,
    height: 8,
    marginTop: 6,
    width: 8,
  },
  pointList: {
    gap: 8,
  },
  pointRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 8,
  },
  pointText: {
    color: '#0f172a',
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
  },
  primaryCta: {
    alignItems: 'center',
    backgroundColor: '#175ead',
    borderRadius: 16,
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 48,
  },
  primaryCtaText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  safeArea: {
    backgroundColor: '#f5f9ff',
    flex: 1,
  },
  secondaryCta: {
    alignItems: 'center',
    backgroundColor: '#e2e8f0',
    borderRadius: 16,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 18,
  },
  secondaryCtaText: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '700',
  },
  sectionTitle: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '800',
  },
  subtitle: {
    color: '#475569',
    fontSize: 15,
    lineHeight: 22,
  },
  title: {
    color: '#0f172a',
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
  },
})
