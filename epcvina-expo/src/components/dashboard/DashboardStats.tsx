import { View, Text, ScrollView, StyleSheet } from 'react-native'
import MetricCard from './MetricCard'
import { LAYOUT } from '../../constants/layout'
import { COLORS } from '../../constants/colors'

const { PADDING: SPACING } = LAYOUT

interface DashboardStatsProps {
  stats: {
    orderedCount: number
    lowStockCount: number
    customerCount: number
    totalRevenue: number
  }
  role?: string
}

/**
 * Component hiển thị statistics cards
 * @param stats - Object chứa các metrics
 * @param role - Role của user (để customize display)
 */
export default function DashboardStats({ stats, role }: DashboardStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Thống kê</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.statsContainer}
      >
        <MetricCard
          title="Đơn hàng"
          icon="cart-outline"
          value={stats.orderedCount}
          color={COLORS.PRIMARY.DEFAULT}
          bg={COLORS.PRIMARY.LIGHT}
        />
        <MetricCard
          title="Sản phẩm sắp hết"
          icon="alert-circle-outline"
          value={stats.lowStockCount}
          color={COLORS.WARNING.DEFAULT}
          bg={COLORS.WARNING.LIGHT}
        />
        <MetricCard
          title="Khách hàng"
          icon="people-outline"
          value={stats.customerCount}
          color={COLORS.SUCCESS.DEFAULT}
          bg={COLORS.SUCCESS.LIGHT}
        />
        <MetricCard
          title="Doanh thu"
          icon="cash-outline"
          value={formatCurrency(stats.totalRevenue)}
          color={COLORS.INFO.DEFAULT}
          bg={COLORS.INFO.LIGHT}
        />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.LARGE,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: SPACING.MEDIUM,
    color: '#333',
  },
  statsContainer: {
    gap: SPACING.MEDIUM,
    paddingRight: SPACING.MEDIUM,
  },
})
