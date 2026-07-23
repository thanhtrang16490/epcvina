import { Ionicons } from '@expo/vector-icons'
import { useMemo, useState } from 'react'
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { localCombos, LocalCombo } from '../../src/data/combos'

type ComboFilter = 'all' | 'on-grid' | 'hybrid'

const FILTERS: Array<{ id: ComboFilter; label: string }> = [
  { id: 'all', label: 'Tất cả' },
  { id: 'on-grid', label: 'Hòa lưới' },
  { id: 'hybrid', label: 'Hybrid' },
]

export default function PublicCombosScreen() {
  const [filter, setFilter] = useState<ComboFilter>('all')
  const combos = useMemo(() => localCombos
    .filter(item => item.is_active && (filter === 'all' || item.system_type === filter))
    .sort((a, b) => a.display_order - b.display_order), [filter])

  return (
    <View style={styles.screen}>
      <FlatList
        data={combos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <ComboCard combo={item} />}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.eyebrow}>GIẢI PHÁP TRỌN BỘ</Text>
            <Text style={styles.title}>Combo điện mặt trời</Text>
            <Text style={styles.subtitle}>Cấu hình tham khảo theo công suất, pin lưu trữ và ngân sách đầu tư.</Text>
            <View style={styles.filters}>{FILTERS.map(item => <Pressable key={item.id} onPress={() => setFilter(item.id)} style={[styles.filter, filter === item.id && styles.filterActive]}><Text style={[styles.filterText, filter === item.id && styles.filterTextActive]}>{item.label}</Text></Pressable>)}</View>
          </View>
        }
      />
    </View>
  )
}

function ComboCard({ combo }: { combo: LocalCombo }) {
  const isHybrid = combo.system_type === 'hybrid'
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconBox, isHybrid && styles.iconBoxHybrid]}><Ionicons name={isHybrid ? 'battery-charging' : 'sunny'} size={23} color={isHybrid ? '#2563EB' : '#D97706'} /></View>
        <View style={styles.cardCopy}><Text style={styles.type}>{isHybrid ? 'HYBRID · CÓ LƯU TRỮ' : 'ON-GRID · HÒA LƯỚI'}</Text><Text style={styles.name}>{combo.name}</Text></View>
      </View>
      <View style={styles.metrics}>
        <Metric label="Công suất" value={`${combo.power_kw} kWp`} />
        <Metric label="Sản lượng/tháng" value={`${combo.production_min_kwh}–${combo.production_max_kwh} kWh`} />
        <Metric label="Diện tích mái" value={`~${combo.roof_area_m2 ?? 'Cần KS'} m²`} />
        <Metric label="Hoàn vốn" value={combo.payback_label} />
      </View>
      {combo.battery_kwh ? <View style={styles.battery}><Ionicons name="battery-half" size={17} color="#1D4ED8" /><Text style={styles.batteryText}>Pin lưu trữ {combo.battery_kwh} kWh</Text></View> : null}
      <View style={styles.priceRow}><Text style={styles.priceLabel}>Đầu tư tham khảo</Text><Text style={styles.price}>{combo.investment_million_vnd.toLocaleString('vi-VN')} triệu</Text></View>
    </View>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return <View style={styles.metric}><Text style={styles.metricValue}>{value}</Text><Text style={styles.metricLabel}>{label}</Text></View>
}

const styles = StyleSheet.create({
  battery: { alignItems: 'center', alignSelf: 'flex-start', backgroundColor: '#EFF6FF', borderRadius: 14, flexDirection: 'row', gap: 6, paddingHorizontal: 10, paddingVertical: 7 },
  batteryText: { color: '#1D4ED8', fontSize: 12, fontWeight: '700' },
  card: { backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', borderRadius: 22, borderWidth: 1, gap: 14, marginBottom: 13, padding: 16 },
  cardCopy: { flex: 1 },
  cardHeader: { alignItems: 'center', flexDirection: 'row', gap: 12 },
  content: { padding: 16, paddingBottom: 28 },
  eyebrow: { color: '#D97706', fontSize: 10, fontWeight: '900', letterSpacing: 0.8 },
  filter: { backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', borderRadius: 18, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 9 },
  filterActive: { backgroundColor: '#175EAD', borderColor: '#175EAD' },
  filterText: { color: '#64748B', fontSize: 13, fontWeight: '700' },
  filterTextActive: { color: '#FFFFFF' },
  filters: { flexDirection: 'row', gap: 8, marginTop: 5 },
  header: { gap: 7, marginBottom: 17 },
  iconBox: { alignItems: 'center', backgroundColor: '#FFF7ED', borderRadius: 15, height: 46, justifyContent: 'center', width: 46 },
  iconBoxHybrid: { backgroundColor: '#EFF6FF' },
  metric: { backgroundColor: '#F8FAFC', borderRadius: 13, gap: 3, padding: 10, width: '48%' },
  metricLabel: { color: '#64748B', fontSize: 10 },
  metricValue: { color: '#0F172A', fontSize: 13, fontWeight: '800' },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between' },
  name: { color: '#111827', fontSize: 16, fontWeight: '900', lineHeight: 22, marginTop: 3 },
  price: { color: '#15803D', fontSize: 17, fontWeight: '900' },
  priceLabel: { color: '#64748B', fontSize: 12 },
  priceRow: { alignItems: 'center', borderTopColor: '#F1F5F9', borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between', paddingTop: 13 },
  screen: { backgroundColor: '#F8FAFC', flex: 1 },
  subtitle: { color: '#64748B', fontSize: 14, lineHeight: 21 },
  title: { color: '#0F172A', fontSize: 27, fontWeight: '900' },
  type: { color: '#64748B', fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
})
