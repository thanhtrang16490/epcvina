import { View, Text, StyleSheet } from 'react-native'
import QuickActionButton from './QuickActionButton'
import { LAYOUT } from '../../constants/layout'
import { COLORS } from '../../constants/colors'

const { PADDING: SPACING } = LAYOUT

interface QuickActionsProps {
  onNewOrder: () => void
  onViewProducts: () => void
  onViewCustomers: () => void
  onViewReports: () => void
}

/**
 * Component hiển thị quick action buttons
 * @param onNewOrder - Handler cho tạo đơn hàng mới
 * @param onViewProducts - Handler cho xem sản phẩm
 * @param onViewCustomers - Handler cho xem khách hàng
 * @param onViewReports - Handler cho xem báo cáo
 */
export default function QuickActions({
  onNewOrder,
  onViewProducts,
  onViewCustomers,
  onViewReports,
}: QuickActionsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Thao tác nhanh</Text>
      <View style={styles.actionsGrid}>
        <QuickActionButton
          title="Tạo đơn hàng"
          icon="add-circle"
          color={COLORS.PRIMARY.DEFAULT}
          iconColor="white"
          onPress={onNewOrder}
        />
        <QuickActionButton
          title="Xem sản phẩm"
          icon="cube"
          color={COLORS.SUCCESS.DEFAULT}
          iconColor="white"
          onPress={onViewProducts}
        />
        <QuickActionButton
          title="Khách hàng"
          icon="people"
          color={COLORS.WARNING.DEFAULT}
          iconColor="white"
          onPress={onViewCustomers}
        />
        <QuickActionButton
          title="Báo cáo"
          icon="stats-chart"
          color={COLORS.INFO.DEFAULT}
          iconColor="white"
          onPress={onViewReports}
        />
      </View>
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
  actionsGrid: {
    gap: SPACING.SMALL,
  },
})
