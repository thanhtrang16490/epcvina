import { Ionicons } from '@expo/vector-icons'
import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'

const PROJECTS = [
  { title: 'Hệ Hybrid 15 kWp', customer: 'Gia đình chị Hà', location: 'Hà Đông, Hà Nội', saving: 'Tiết kiệm khoảng 45 triệu/năm', image: 'https://epcvina.com/du-an/15kw-hybrid-chi-ha.webp' },
  { title: 'Hệ Hybrid 22 kWp', customer: 'Gia đình chú Thanh', location: 'TP. Hải Dương', saving: 'Pin lưu trữ 20 kWh', image: 'https://epcvina.com/du-an/22kw-hybrid-chu-thanh.webp' },
  { title: 'Hệ Hybrid 7,5 kWp', customer: 'Gia đình anh Linh', location: 'Dương Nội, Hà Nội', saving: 'Tối ưu điện ban ngày và dự phòng', image: 'https://epcvina.com/du-an/7-5kw-hybrid-anh-linh.webp' },
  { title: 'Hệ On-Grid 10 kWp', customer: 'Gia đình chị Hương', location: 'Hưng Yên', saving: 'Ưu tiên hoàn vốn nhanh', image: 'https://epcvina.com/du-an/10kw-on-grid-chi-huong.webp' },
]

export default function PublicProjectsScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>CÔNG TRÌNH THỰC TẾ</Text>
        <Text style={styles.title}>Dự án EPCVINA Solar</Text>
        <Text style={styles.subtitle}>Các hệ thống đã triển khai cho nhà dân, được thiết kế theo mái và nhu cầu sử dụng thực tế.</Text>
      </View>
      {PROJECTS.map(project => (
        <View key={project.title + project.customer} style={styles.card}>
          <Image source={{ uri: project.image }} style={styles.image} resizeMode="cover" />
          <View style={styles.cardBody}>
            <View style={styles.projectType}><Ionicons name="sunny" size={14} color="#B45309" /><Text style={styles.projectTypeText}>{project.title}</Text></View>
            <Text style={styles.customer}>{project.customer}</Text>
            <View style={styles.detail}><Ionicons name="location-outline" size={16} color="#64748B" /><Text style={styles.detailText}>{project.location}</Text></View>
            <View style={styles.detail}><Ionicons name="trending-down-outline" size={16} color="#15803D" /><Text style={styles.saving}>{project.saving}</Text></View>
          </View>
        </View>
      ))}
      <View style={styles.cta}>
        <Ionicons name="construct-outline" size={28} color="#F59E0B" />
        <Text style={styles.ctaTitle}>Muốn khảo sát mái nhà?</Text>
        <Text style={styles.ctaText}>Liên hệ EPCVINA để kiểm tra mái, hóa đơn và nhận phương án phù hợp.</Text>
        <Pressable style={styles.ctaButton} onPress={() => Linking.openURL('tel:0988446113')}><Ionicons name="call" size={18} color="#FFFFFF" /><Text style={styles.ctaButtonText}>Gọi 0988 446 113</Text></Pressable>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', borderRadius: 22, borderWidth: 1, marginBottom: 14, overflow: 'hidden' },
  cardBody: { gap: 8, padding: 15 },
  content: { padding: 16, paddingBottom: 30 },
  cta: { alignItems: 'center', backgroundColor: '#111827', borderRadius: 24, gap: 9, marginTop: 4, padding: 22 },
  ctaButton: { alignItems: 'center', backgroundColor: '#2FBD6A', borderRadius: 18, flexDirection: 'row', gap: 8, marginTop: 5, paddingHorizontal: 18, paddingVertical: 12 },
  ctaButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '900' },
  ctaText: { color: '#CBD5E1', fontSize: 13, lineHeight: 19, textAlign: 'center' },
  ctaTitle: { color: '#FFFFFF', fontSize: 19, fontWeight: '900' },
  customer: { color: '#111827', fontSize: 18, fontWeight: '900' },
  detail: { alignItems: 'center', flexDirection: 'row', gap: 7 },
  detailText: { color: '#64748B', flex: 1, fontSize: 12 },
  eyebrow: { color: '#D97706', fontSize: 10, fontWeight: '900', letterSpacing: 0.8 },
  hero: { gap: 7, marginBottom: 17 },
  image: { backgroundColor: '#E5E7EB', height: 190, width: '100%' },
  projectType: { alignItems: 'center', alignSelf: 'flex-start', backgroundColor: '#FFF7ED', borderRadius: 14, flexDirection: 'row', gap: 5, paddingHorizontal: 9, paddingVertical: 6 },
  projectTypeText: { color: '#B45309', fontSize: 11, fontWeight: '800' },
  saving: { color: '#15803D', flex: 1, fontSize: 12, fontWeight: '700' },
  screen: { backgroundColor: '#F8FAFC', flex: 1 },
  subtitle: { color: '#64748B', fontSize: 14, lineHeight: 21 },
  title: { color: '#0F172A', fontSize: 27, fontWeight: '900' },
})
