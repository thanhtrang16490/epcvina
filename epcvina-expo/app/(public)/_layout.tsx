import { Ionicons } from '@expo/vector-icons'
import { router, Tabs } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { Animated, Image, Linking, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const TAB_COLOR = '#175EAD'

export default function PublicLayout() {
  const [drawerVisible, setDrawerVisible] = useState(false)

  return (
    <View style={styles.root}>
      <Tabs
        initialRouteName="calculator"
        screenOptions={{
          header: () => <PublicHeader />,
          headerShown: true,
          tabBarActiveTintColor: TAB_COLOR,
          tabBarInactiveTintColor: '#8A94A3',
          tabBarHideOnKeyboard: true,
          tabBarLabelStyle: styles.tabLabel,
          tabBarStyle: styles.tabBar,
          tabBarItemStyle: styles.tabItem,
        }}
      >
        <Tabs.Screen
          name="calculator"
          options={{ title: 'Trang chủ', tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} /> }}
        />
        <Tabs.Screen
          name="combos"
          options={{ title: 'Combo', tabBarIcon: ({ color, size }) => <Ionicons name="grid" color={color} size={size} /> }}
        />
        <Tabs.Screen
          name="products"
          options={{ title: 'Thiết bị', tabBarIcon: ({ color, size }) => <Ionicons name="cube" color={color} size={size} /> }}
        />
        <Tabs.Screen
          name="projects"
          options={{ title: 'Dự án', tabBarIcon: ({ color, size }) => <Ionicons name="images" color={color} size={size} /> }}
        />
        <Tabs.Screen
          name="menu"
          listeners={{ tabPress: event => { event.preventDefault(); setDrawerVisible(true) } }}
          options={{ title: 'Menu', tabBarIcon: ({ color, size }) => <Ionicons name="menu" color={color} size={size} /> }}
        />
        <Tabs.Screen name="product/[id]" options={{ href: null }} />
      </Tabs>
      <PublicDrawer visible={drawerVisible} onClose={() => setDrawerVisible(false)} />
    </View>
  )
}

const DRAWER_LINKS: Array<{ label: string; description: string; icon: keyof typeof Ionicons.glyphMap; href: string }> = [
  { label: 'Tính điện mặt trời', description: 'Công suất, chi phí và hoàn vốn', icon: 'calculator-outline', href: '/(public)/calculator' },
  { label: 'Combo giải pháp', description: 'Cấu hình hệ thống trọn bộ', icon: 'grid-outline', href: '/(public)/combos' },
  { label: 'Thiết bị', description: 'Tấm pin, inverter và lưu trữ', icon: 'cube-outline', href: '/(public)/products' },
  { label: 'Dự án thực tế', description: 'Công trình EPCVINA đã triển khai', icon: 'images-outline', href: '/(public)/projects' },
]

function PublicDrawer({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const translateX = useRef(new Animated.Value(360)).current

  useEffect(() => {
    if (!visible) return
    translateX.setValue(360)
    Animated.spring(translateX, { damping: 22, mass: 0.8, stiffness: 220, toValue: 0, useNativeDriver: true }).start()
  }, [translateX, visible])

  const close = () => {
    Animated.timing(translateX, { duration: 180, toValue: 360, useNativeDriver: true }).start(onClose)
  }

  const navigate = (href: string) => {
    close()
    setTimeout(() => router.replace(href as any), 190)
  }

  return (
    <Modal transparent visible={visible} animationType="fade" statusBarTranslucent onRequestClose={close}>
      <View style={styles.drawerLayer}>
        <Pressable accessibilityRole="button" accessibilityLabel="Đóng menu" style={styles.drawerBackdrop} onPress={close} />
        <Animated.View style={[styles.drawerPanel, { transform: [{ translateX }] }]}>
          <SafeAreaView edges={['top', 'bottom']} style={styles.drawerSafeArea}>
            <View style={styles.drawerHeader}>
              <View>
                <Text style={styles.drawerBrand}>EPCVINA Solar</Text>
                <Text style={styles.drawerSubtitle}>Giải pháp năng lượng cho mọi mái nhà</Text>
              </View>
              <Pressable accessibilityRole="button" accessibilityLabel="Đóng menu" onPress={close} style={styles.closeButton}>
                <Ionicons name="close" size={22} color="#334155" />
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={styles.drawerContent} showsVerticalScrollIndicator={false}>
              <Text style={styles.drawerSectionTitle}>Khám phá</Text>
              {DRAWER_LINKS.map(item => (
                <Pressable key={item.href} onPress={() => navigate(item.href)} style={styles.drawerLink}>
                  <View style={styles.drawerLinkIcon}><Ionicons name={item.icon} size={21} color={TAB_COLOR} /></View>
                  <View style={styles.drawerLinkCopy}><Text style={styles.drawerLinkLabel}>{item.label}</Text><Text style={styles.drawerLinkDescription}>{item.description}</Text></View>
                  <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                </Pressable>
              ))}
              <Text style={styles.drawerSectionTitle}>Hỗ trợ</Text>
              <Pressable onPress={() => Linking.openURL('tel:0988446113')} style={styles.contactCard}>
                <View style={styles.contactIcon}><Ionicons name="call" size={20} color="#FFFFFF" /></View>
                <View style={styles.drawerLinkCopy}><Text style={styles.contactLabel}>Hotline tư vấn</Text><Text style={styles.contactValue}>0988 446 113</Text></View>
              </Pressable>
              <Pressable onPress={() => Linking.openURL('https://zalo.me/0988446113')} style={styles.zaloButton}>
                <Ionicons name="chatbubble-ellipses-outline" size={19} color="#175EAD" /><Text style={styles.zaloText}>Chat Zalo với EPCVINA</Text>
              </Pressable>
            </ScrollView>
            <Pressable onPress={() => navigate('/(auth)/login')} style={styles.drawerLogin}>
              <Ionicons name="person-outline" size={19} color="#FFFFFF" /><Text style={styles.drawerLoginText}>Đăng nhập</Text>
            </Pressable>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  )
}

function PublicHeader() {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={require('../../assets/icon.png')} style={styles.logo} resizeMode="contain" />
        </View>
        <View style={styles.brandCopy}>
          <Text style={styles.brandName}>EPCVINA</Text>
          <Text style={styles.brandSubtitle}>Điện mặt trời an toàn từ chuyên gia cơ điện</Text>
        </View>
        <Pressable accessibilityRole="button" onPress={() => router.push('/(auth)/login')} style={styles.loginButton}>
          <Ionicons name="person-outline" size={16} color={TAB_COLOR} />
          <Text style={styles.loginText}>Đăng nhập</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  brandCopy: { flex: 1 },
  brandName: { color: TAB_COLOR, fontSize: 18, fontWeight: '900', letterSpacing: 0.4 },
  brandSubtitle: { color: '#6B7280', fontSize: 10, marginTop: 1 },
  closeButton: { alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: 18, height: 38, justifyContent: 'center', width: 38 },
  contactCard: { alignItems: 'center', backgroundColor: '#ECFDF5', borderColor: '#A7F3D0', borderRadius: 18, borderWidth: 1, flexDirection: 'row', gap: 11, padding: 13 },
  contactIcon: { alignItems: 'center', backgroundColor: '#2FBD6A', borderRadius: 15, height: 42, justifyContent: 'center', width: 42 },
  contactLabel: { color: '#166534', fontSize: 11, fontWeight: '700' },
  contactValue: { color: '#14532D', fontSize: 16, fontWeight: '900', marginTop: 2 },
  drawerBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(15, 23, 42, 0.55)' },
  drawerBrand: { color: '#0F172A', fontSize: 20, fontWeight: '900' },
  drawerContent: { gap: 9, paddingBottom: 18, paddingHorizontal: 17, paddingTop: 8 },
  drawerHeader: { alignItems: 'center', borderBottomColor: '#E5E7EB', borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', padding: 17 },
  drawerLayer: { flex: 1 },
  drawerLink: { alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', borderRadius: 17, borderWidth: 1, flexDirection: 'row', gap: 11, padding: 12 },
  drawerLinkCopy: { flex: 1 },
  drawerLinkDescription: { color: '#64748B', fontSize: 11, lineHeight: 16, marginTop: 2 },
  drawerLinkIcon: { alignItems: 'center', backgroundColor: '#EFF6FF', borderRadius: 14, height: 42, justifyContent: 'center', width: 42 },
  drawerLinkLabel: { color: '#0F172A', fontSize: 14, fontWeight: '800' },
  drawerLogin: { alignItems: 'center', backgroundColor: TAB_COLOR, borderRadius: 17, flexDirection: 'row', gap: 8, justifyContent: 'center', margin: 17, minHeight: 50 },
  drawerLoginText: { color: '#FFFFFF', fontSize: 14, fontWeight: '900' },
  drawerPanel: { backgroundColor: '#F8FAFC', bottom: 0, elevation: 20, maxWidth: 360, position: 'absolute', right: 0, shadowColor: '#000000', shadowOffset: { height: 0, width: -8 }, shadowOpacity: 0.18, shadowRadius: 20, top: 0, width: '88%' },
  drawerSafeArea: { flex: 1 },
  drawerSectionTitle: { color: '#64748B', fontSize: 10, fontWeight: '900', letterSpacing: 0.8, marginBottom: 1, marginTop: 9, textTransform: 'uppercase' },
  drawerSubtitle: { color: '#64748B', fontSize: 10, marginTop: 2 },
  header: { alignItems: 'center', flexDirection: 'row', gap: 10, minHeight: 58, paddingHorizontal: 16, paddingVertical: 9 },
  loginButton: { alignItems: 'center', backgroundColor: '#EFF6FF', borderColor: '#BFDBFE', borderRadius: 18, borderWidth: 1, flexDirection: 'row', gap: 5, paddingHorizontal: 11, paddingVertical: 8 },
  loginText: { color: TAB_COLOR, fontSize: 11, fontWeight: '800' },
  logo: { height: 27, width: 27 },
  logoContainer: { alignItems: 'center', backgroundColor: '#F0F9FF', borderColor: '#BFDBFE', borderRadius: 10, borderWidth: 1, height: 40, justifyContent: 'center', width: 40 },
  root: { flex: 1 },
  safeArea: { backgroundColor: '#FFFFFF', borderBottomColor: '#E5E7EB', borderBottomWidth: 1, elevation: 3, shadowColor: '#000000', shadowOffset: { height: 2, width: 0 }, shadowOpacity: 0.05, shadowRadius: 4 },
  tabBar: { backgroundColor: '#FFFFFF', borderTopColor: '#E5E7EB', height: 66, paddingBottom: 7, paddingTop: 6 },
  tabItem: { minHeight: 52 },
  tabLabel: { fontSize: 11, fontWeight: '700' },
  zaloButton: { alignItems: 'center', backgroundColor: '#EFF6FF', borderColor: '#BFDBFE', borderRadius: 17, borderWidth: 1, flexDirection: 'row', gap: 8, justifyContent: 'center', minHeight: 48 },
  zaloText: { color: '#175EAD', fontSize: 13, fontWeight: '800' },
})
