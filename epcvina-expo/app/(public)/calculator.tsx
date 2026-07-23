import AsyncStorage from '@react-native-async-storage/async-storage'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useMemo, useState } from 'react'
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import {
  BillType,
  calculateSolarSystem,
  DEFAULTS_BY_BILL_TYPE,
  formatMillionRange,
  formatVnd,
  PhaseType,
  REGION_PROVINCES,
  RoofType,
  SolarRegion,
} from '../../src/lib/solar-calculator'
import { Analytics } from '../../src/lib/analytics'

type Step = 'region' | 'bill' | 'roof' | 'usage' | 'result' | 'survey'

const COLORS = {
  ink: '#201A12', muted: '#756B5D', cream: '#FBF6EC', card: '#FFFDF8',
  border: '#E9DECC', amber: '#F59E0B', green: '#2FBD6A', navy: '#111827', white: '#FFFFFF',
}

const REGION_OPTIONS: Array<{ id: SolarRegion; title: string; subtitle: string }> = [
  { id: 'north', title: 'Miền Bắc', subtitle: 'Sản lượng nắng thận trọng' },
  { id: 'central', title: 'Miền Trung', subtitle: 'Sản lượng nắng trung bình tốt' },
  { id: 'south', title: 'Miền Nam', subtitle: 'Sản lượng nắng tốt hơn' },
]
const BILL_OPTIONS: Array<{ id: BillType; title: string; subtitle: string; icon: keyof typeof Ionicons.glyphMap }> = [
  { id: 'family', title: 'Gia đình', subtitle: 'Nhà ở, biệt thự', icon: 'home-outline' },
  { id: 'business', title: 'Kinh doanh', subtitle: 'Quán, cửa hàng', icon: 'storefront-outline' },
  { id: 'factory', title: 'Nhà xưởng', subtitle: 'Cơ sở sản xuất', icon: 'business-outline' },
]
const QUICK_BILLS: Record<BillType, number[]> = {
  family: [500_000, 1_000_000, 2_000_000, 3_000_000, 5_000_000, 8_000_000],
  business: [3_000_000, 5_000_000, 10_000_000, 20_000_000, 30_000_000],
  factory: [20_000_000, 50_000_000, 100_000_000, 200_000_000, 500_000_000],
}
const ROOF_OPTIONS: Array<{ id: RoofType; title: string; subtitle: string }> = [
  { id: 'metal', title: 'Mái tôn', subtitle: 'Không phụ phí khung nghiêng' },
  { id: 'tile', title: 'Mái ngói', subtitle: 'Cần khảo sát kết cấu mái' },
  { id: 'flat', title: 'Mái bê tông', subtitle: 'Cần khung nghiêng tối ưu nắng' },
]
const INSTALL_TIMES = ['Sớm nhất có thể', 'Trong 30 ngày tới', '1–3 tháng tới', 'Chỉ đang tìm hiểu']
const STEP_NUMBER: Record<Step, number> = { region: 1, bill: 2, roof: 3, usage: 4, result: 4, survey: 4 }

const digitsOnly = (value: string) => value.replace(/\D/g, '')
const formatQuickBill = (value: number) => value >= 1_000_000 ? `${value / 1_000_000} triệu` : `${value / 1000}k`

export default function CalculatorScreen() {
  const [step, setStep] = useState<Step>('region')
  const [region, setRegion] = useState<SolarRegion | null>(null)
  const [province, setProvince] = useState('')
  const [billType, setBillType] = useState<BillType>('family')
  const [monthlyBill, setMonthlyBill] = useState(String(DEFAULTS_BY_BILL_TYPE.family.monthlyBill))
  const [roofType, setRoofType] = useState<RoofType>('flat')
  const [roofArea, setRoofArea] = useState(String(DEFAULTS_BY_BILL_TYPE.family.roofArea))
  const [dayUsage, setDayUsage] = useState(70)
  const [phaseType, setPhaseType] = useState<PhaseType>('one')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [installTime, setInstallTime] = useState(INSTALL_TIMES[1])

  const result = useMemo(() => calculateSolarSystem({
    region: region ?? 'north',
    billType,
    monthlyBill: Number(monthlyBill) || 0,
    roofType,
    roofArea: Number(roofArea) || 0,
    dayUsage,
    phaseType,
  }), [billType, dayUsage, monthlyBill, phaseType, region, roofArea, roofType])

  const selectBillType = (value: BillType) => {
    const defaults = DEFAULTS_BY_BILL_TYPE[value]
    setBillType(value)
    setMonthlyBill(String(defaults.monthlyBill))
    setRoofArea(String(defaults.roofArea))
    setRoofType(defaults.roofType)
    setDayUsage(defaults.dayUsage)
    setPhaseType(defaults.phaseType)
  }

  const goBack = () => {
    const previous: Record<Step, Step | null> = {
      region: null, bill: 'region', roof: 'bill', usage: 'roof', result: 'usage', survey: 'result',
    }
    const target = previous[step]
    if (target) setStep(target)
  }

  const reset = () => {
    const defaults = DEFAULTS_BY_BILL_TYPE.family
    setRegion(null); setProvince(''); setBillType('family')
    setMonthlyBill(String(defaults.monthlyBill)); setRoofType(defaults.roofType)
    setRoofArea(String(defaults.roofArea)); setDayUsage(defaults.dayUsage)
    setPhaseType(defaults.phaseType); setStep('region')
  }

  const saveSurveyDraft = async () => {
    if (name.trim().length < 2 || !/^(0|\+84)[0-9]{9,10}$/.test(phone.replace(/[\s.-]/g, ''))) {
      Alert.alert('Kiểm tra thông tin', 'Vui lòng nhập họ tên và số điện thoại/Zalo hợp lệ.')
      return
    }
    const payload = {
      name: name.trim(), phone: phone.trim(), installTime, province, billType,
      monthlyBill: Number(monthlyBill), roofType, roofArea: Number(roofArea), dayUsage,
      result, createdAt: new Date().toISOString(),
    }
    await AsyncStorage.setItem('epcvina-solar-calculator-lead-draft', JSON.stringify(payload))
    Analytics.trackEvent('solar_survey_draft_saved', { province, bill_type: billType, estimated_kwp: result.estimatedKwp })
    Alert.alert(
      'Đã lưu yêu cầu trên thiết bị',
      'Chọn Zalo để gửi trực tiếp kết quả cho EPCVINA hoặc gọi hotline để đặt lịch khảo sát.',
      [
        { text: 'Để sau', style: 'cancel' },
        { text: 'Mở Zalo', onPress: () => Linking.openURL('https://zalo.me/0988446113') },
      ],
    )
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.topline}>
          <View style={styles.brandMark}><Ionicons name="sunny" size={21} color={COLORS.ink} /></View>
          <View style={styles.brandCopy}>
            <Text style={styles.brandTitle}>Máy tính Điện Mặt Trời</Text>
            <Text style={styles.brandSubtitle}>Ước tính theo hóa đơn thực tế</Text>
          </View>
          <View style={styles.freePill}><Text style={styles.freeText}>Miễn phí</Text></View>
        </View>

        {step === 'region' ? <Hero /> : null}
        {step !== 'result' && step !== 'survey' ? <Progress current={STEP_NUMBER[step]} /> : null}
        {step !== 'region' ? (
          <Pressable accessibilityRole="button" onPress={goBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={17} color={COLORS.muted} />
            <Text style={styles.backText}>Quay lại</Text>
          </Pressable>
        ) : null}

        {step === 'region' ? (
          <Section title="Nhà bạn ở khu vực nào?" subtitle="Chọn tỉnh/thành để tính lượng nắng và phương án phù hợp hơn.">
            {REGION_OPTIONS.map(item => (
              <View key={item.id} style={styles.regionBlock}>
                <Pressable
                  accessibilityRole="button"
                  style={[styles.optionRow, region === item.id && styles.optionRowActive]}
                  onPress={() => { setRegion(item.id); setProvince('') }}
                >
                  <View style={styles.optionIcon}><Ionicons name="location-outline" size={20} color={COLORS.amber} /></View>
                  <View style={styles.optionCopy}><Text style={styles.optionTitle}>{item.title}</Text><Text style={styles.optionSubtitle}>{item.subtitle}</Text></View>
                  {region === item.id ? <Ionicons name="checkmark-circle" size={22} color={COLORS.green} /> : null}
                </Pressable>
                {region === item.id ? (
                  <View style={styles.chipWrap}>
                    {REGION_PROVINCES[item.id].map(city => <ChoiceChip key={city} label={city} active={province === city} onPress={() => setProvince(city)} />)}
                  </View>
                ) : null}
              </View>
            ))}
            <PrimaryButton label="Tiếp tục với khu vực này" disabled={!region || !province} onPress={() => { Analytics.trackEvent('solar_calculator_started', { province }); setStep('bill') }} />
          </Section>
        ) : null}

        {step === 'bill' ? (
          <Section title="Tiền điện mỗi tháng khoảng bao nhiêu?" subtitle="Có thể nhập gần đúng theo hóa đơn tháng gần nhất.">
            <View style={styles.threeColumns}>
              {BILL_OPTIONS.map(item => (
                <Pressable key={item.id} style={[styles.typeCard, billType === item.id && styles.typeCardActive]} onPress={() => selectBillType(item.id)}>
                  <Ionicons name={item.icon} size={22} color={billType === item.id ? COLORS.amber : COLORS.muted} />
                  <Text style={styles.typeTitle}>{item.title}</Text><Text style={styles.typeSubtitle}>{item.subtitle}</Text>
                </Pressable>
              ))}
            </View>
            <Text style={styles.fieldLabel}>Chọn nhanh</Text>
            <View style={styles.chipWrap}>{QUICK_BILLS[billType].map(value => <ChoiceChip key={value} label={formatQuickBill(value)} active={Number(monthlyBill) === value} onPress={() => setMonthlyBill(String(value))} />)}</View>
            <Text style={styles.fieldLabel}>Hoặc nhập số tiền</Text>
            <View style={styles.inputShell}>
              <TextInput accessibilityLabel="Tiền điện trung bình mỗi tháng" value={Number(monthlyBill).toLocaleString('vi-VN')} onChangeText={value => setMonthlyBill(digitsOnly(value))} keyboardType="number-pad" style={styles.moneyInput} />
              <Text style={styles.inputUnit}>VND</Text>
            </View>
            <PrimaryButton label="Tiếp tục" disabled={!Number(monthlyBill)} onPress={() => setStep('roof')} />
          </Section>
        ) : null}

        {step === 'roof' ? (
          <Section title="Mái nhà của bạn như thế nào?" subtitle="Diện tích mái quyết định công suất có thể lắp thực tế.">
            {ROOF_OPTIONS.map(item => (
              <Pressable key={item.id} style={[styles.optionRow, roofType === item.id && styles.optionRowActive]} onPress={() => setRoofType(item.id)}>
                <View style={styles.optionIcon}><Ionicons name="home-outline" size={20} color={COLORS.amber} /></View>
                <View style={styles.optionCopy}><Text style={styles.optionTitle}>{item.title}</Text><Text style={styles.optionSubtitle}>{item.subtitle}</Text></View>
                {roofType === item.id ? <Ionicons name="checkmark-circle" size={22} color={COLORS.green} /> : null}
              </Pressable>
            ))}
            <Text style={styles.fieldLabel}>Diện tích mái có thể sử dụng</Text>
            <View style={styles.inputShell}><TextInput accessibilityLabel="Diện tích mái" value={roofArea} onChangeText={value => setRoofArea(digitsOnly(value))} keyboardType="number-pad" style={styles.moneyInput} /><Text style={styles.inputUnit}>m²</Text></View>
            <Text style={styles.hint}>Ước tính cần khoảng 6,5 m² cho mỗi kWp.</Text>
            <PrimaryButton label="Tiếp tục" disabled={!Number(roofArea)} onPress={() => setStep('usage')} />
          </Section>
        ) : null}

        {step === 'usage' ? (
          <Section title="Bạn dùng điện lúc nào?" subtitle="Tỷ lệ ban đêm giúp xác định có nên dùng pin lưu trữ.">
            <View style={styles.usageCard}>
              <View style={styles.usageHeader}><Text style={styles.usageValue}>{dayUsage}% ban ngày</Text><Text style={styles.usageValue}>{100 - dayUsage}% ban đêm</Text></View>
              <View style={styles.usageControls}>
                <Pressable style={styles.roundButton} onPress={() => setDayUsage(Math.max(10, dayUsage - 10))}><Ionicons name="remove" size={22} color={COLORS.ink} /></Pressable>
                <View style={styles.usageTrack}><View style={[styles.usageFill, { width: `${dayUsage}%` }]} /></View>
                <Pressable style={styles.roundButton} onPress={() => setDayUsage(Math.min(90, dayUsage + 10))}><Ionicons name="add" size={22} color={COLORS.ink} /></Pressable>
              </View>
            </View>
            <Text style={styles.fieldLabel}>Nguồn điện công trình</Text>
            <View style={styles.twoColumns}><ChoiceCard title="1 pha" subtitle="Nhà dân, công suất vừa" active={phaseType === 'one'} onPress={() => setPhaseType('one')} /><ChoiceCard title="3 pha" subtitle="Tải lớn, doanh nghiệp" active={phaseType === 'three'} onPress={() => setPhaseType('three')} /></View>
            <View style={styles.infoBox}><Ionicons name="bulb-outline" size={19} color="#92400E" /><Text style={styles.infoText}>{100 - dayUsage >= 25 ? 'Dùng điện ban đêm đáng kể: hệ Hybrid và pin lưu trữ có thể phù hợp.' : 'Tải chủ yếu ban ngày: hệ hòa lưới thường có thời gian hoàn vốn tốt hơn.'}</Text></View>
            <PrimaryButton label="Xem kết quả của bạn" onPress={() => { Analytics.trackEvent('solar_calculator_result_viewed', { bill_type: billType }); setStep('result') }} />
          </Section>
        ) : null}

        {step === 'result' ? (
          <ResultView result={result} province={province} onSurvey={() => setStep('survey')} onReset={reset} />
        ) : null}

        {step === 'survey' ? (
          <Section title="Nhận phương án khảo sát riêng" subtitle="Lưu yêu cầu và liên hệ EPCVINA qua Zalo hoặc hotline.">
            <Text style={styles.fieldLabel}>Họ và tên</Text><TextInput accessibilityLabel="Họ và tên" value={name} onChangeText={setName} autoComplete="name" style={styles.textInput} placeholder="Nguyễn Văn An" placeholderTextColor="#9A8F80" />
            <Text style={styles.fieldLabel}>Số điện thoại / Zalo</Text><TextInput accessibilityLabel="Số điện thoại hoặc Zalo" value={phone} onChangeText={setPhone} autoComplete="tel" keyboardType="phone-pad" style={styles.textInput} placeholder="0988 446 113" placeholderTextColor="#9A8F80" />
            <Text style={styles.fieldLabel}>Dự định lắp</Text><View style={styles.chipWrap}>{INSTALL_TIMES.map(item => <ChoiceChip key={item} label={item} active={installTime === item} onPress={() => setInstallTime(item)} />)}</View>
            <View style={styles.summaryBox}><Text style={styles.summaryTitle}>Tóm tắt phương án</Text><Text style={styles.summaryText}>{province} · {result.estimatedKwp} kWp · {result.estimatedPanels} tấm pin</Text><Text style={styles.summaryText}>{formatMillionRange(result.costMin, result.costMax)} · hoàn vốn khoảng {result.paybackAverage} năm</Text></View>
            <PrimaryButton label="Lưu yêu cầu & mở Zalo" onPress={saveSurveyDraft} icon="logo-whatsapp" />
            <Text style={styles.privacy}>Thông tin chỉ được lưu trên thiết bị cho đến khi bạn chủ động gửi qua Zalo.</Text>
          </Section>
        ) : null}
      </ScrollView>

    </View>
  )
}

function Hero() {
  return <View style={styles.hero}><View style={styles.heroBadge}><Text style={styles.heroBadgeText}>NHANH · CHÍNH XÁC</Text></View><Text style={styles.heroTitle}>Tính điện mặt trời theo hóa đơn của bạn</Text><Text style={styles.heroText}>Ước tính công suất nên lắp, chi phí đầu tư, số tấm pin và thời gian hoàn vốn.</Text>{['Miễn phí', 'Không cần tài khoản', 'Kết quả riêng theo khu vực'].map(item => <View key={item} style={styles.heroBullet}><Ionicons name="checkmark-circle" size={20} color="#FBBF24" /><Text style={styles.heroBulletText}>{item}</Text></View>)}</View>
}

function Progress({ current }: { current: number }) {
  return <View style={styles.progressRow}><Text style={styles.progressText}>Bước {current} / 4</Text><View style={styles.progressTrack}>{[1, 2, 3, 4].map(item => <View key={item} style={[styles.progressPart, item <= current && styles.progressPartActive]} />)}</View></View>
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return <View style={styles.section}><Text style={styles.sectionTitle}>{title}</Text><Text style={styles.sectionSubtitle}>{subtitle}</Text><View style={styles.sectionBody}>{children}</View></View>
}

function ChoiceChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ selected: active }} onPress={onPress} style={[styles.chip, active && styles.chipActive]}><Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text></Pressable>
}

function ChoiceCard({ title, subtitle, active, onPress }: { title: string; subtitle: string; active: boolean; onPress: () => void }) {
  return <Pressable onPress={onPress} style={[styles.choiceCard, active && styles.choiceCardActive]}><Text style={styles.choiceTitle}>{title}</Text><Text style={styles.choiceSubtitle}>{subtitle}</Text>{active ? <Ionicons name="checkmark-circle" size={20} color={COLORS.green} /> : null}</Pressable>
}

function PrimaryButton({ label, onPress, disabled = false, icon = 'arrow-forward' }: { label: string; onPress: () => void; disabled?: boolean; icon?: keyof typeof Ionicons.glyphMap }) {
  return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={[styles.primaryButton, disabled && styles.primaryButtonDisabled]}><Text style={styles.primaryButtonText}>{label}</Text><Ionicons name={icon} size={20} color={COLORS.white} /></Pressable>
}

function ResultView({ result, province, onSurvey, onReset }: { result: ReturnType<typeof calculateSolarSystem>; province: string; onSurvey: () => void; onReset: () => void }) {
  const systemLabel = result.systemType === 'hybrid-storage' ? `Hybrid + pin ${result.estimatedStorageKwh} kWh` : result.systemType === 'hybrid-ready' ? 'Hybrid-ready' : 'Hòa lưới'
  return <View style={styles.resultWrap}>
    <View style={styles.resultHero}><Text style={styles.resultEyebrow}>PHƯƠNG ÁN SƠ BỘ · {province.toUpperCase()}</Text><Text style={styles.resultTitle}>{result.estimatedKwp} kWp · {systemLabel}</Text><Text style={styles.resultDescription}>{result.recommendation}</Text></View>
    {result.isRoofLimited ? <View style={styles.warningBox}><Ionicons name="warning-outline" size={20} color="#B45309" /><Text style={styles.warningText}>Diện tích mái đang giới hạn công suất. Nhu cầu theo hóa đơn khoảng {result.estimatedKwpByBill} kWp.</Text></View> : null}
    <View style={styles.resultGrid}>
      <Metric label="Công suất đề xuất" value={`${result.estimatedKwp} kWp`} />
      <Metric label="Số tấm pin 650 Wp" value={`${result.estimatedPanels} tấm`} />
      <Metric label="Inverter tham chiếu" value={`${result.inverterKw} kW`} />
      <Metric label="Sản lượng mỗi tháng" value={`~${result.monthlyProductionKwh.toLocaleString('vi-VN')} kWh`} />
    </View>
    <View style={styles.financeCard}><Text style={styles.financeTitle}>Hiệu quả tài chính dự kiến</Text><View style={styles.financeRow}><Text style={styles.financeLabel}>Ngân sách</Text><Text style={styles.financeValue}>{formatMillionRange(result.costMin, result.costMax)}</Text></View><View style={styles.financeRow}><Text style={styles.financeLabel}>Tiết kiệm/tháng</Text><Text style={[styles.financeValue, styles.greenText]}>~{formatVnd(result.monthlySaving)}</Text></View><View style={styles.financeRow}><Text style={styles.financeLabel}>Hóa đơn còn lại</Text><Text style={styles.financeValue}>~{formatVnd(result.afterBill)}</Text></View><View style={styles.financeRow}><Text style={styles.financeLabel}>Hoàn vốn</Text><Text style={styles.financeValue}>{result.paybackMin}–{result.paybackMax} năm</Text></View><View style={styles.financeRow}><Text style={styles.financeLabel}>Giảm CO₂ mỗi năm</Text><Text style={styles.financeValue}>~{result.co2Ton} tấn</Text></View></View>
    <PrimaryButton label="Đăng ký khảo sát miễn phí" onPress={onSurvey} icon="calendar-outline" />
    <Pressable style={styles.productsButton} onPress={() => router.push('/(public)/products' as any)}><Ionicons name="cube-outline" size={19} color={COLORS.ink} /><Text style={styles.productsText}>Xem thiết bị phù hợp</Text></Pressable>
    <Pressable style={styles.resetButton} onPress={onReset}><Text style={styles.resetText}>Tính lại từ đầu</Text></Pressable>
    <Text style={styles.disclaimer}>Kết quả là ước tính sơ bộ. Sản lượng, chi phí và hoàn vốn thực tế phụ thuộc hướng mái, bóng che, biểu giá điện và cấu hình thiết bị.</Text>
  </View>
}

function Metric({ label, value }: { label: string; value: string }) {
  return <View style={styles.metric}><Text style={styles.metricValue}>{value}</Text><Text style={styles.metricLabel}>{label}</Text></View>
}

const styles = StyleSheet.create({
  backButton: { alignItems: 'center', alignSelf: 'flex-start', flexDirection: 'row', gap: 6, paddingVertical: 8 },
  backText: { color: COLORS.muted, fontSize: 14, fontWeight: '600' },
  brandCopy: { flex: 1 }, brandMark: { alignItems: 'center', backgroundColor: '#F9C74F', borderRadius: 18, height: 38, justifyContent: 'center', width: 38 },
  brandSubtitle: { color: COLORS.muted, fontSize: 11 }, brandTitle: { color: COLORS.ink, fontSize: 14, fontWeight: '800' },
  chip: { backgroundColor: COLORS.white, borderColor: COLORS.border, borderRadius: 18, borderWidth: 1, paddingHorizontal: 13, paddingVertical: 9 },
  chipActive: { backgroundColor: '#ECFFF4', borderColor: '#8EE2AF' }, chipText: { color: COLORS.ink, fontSize: 13, fontWeight: '600' }, chipTextActive: { color: '#166534' },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, choiceCard: { backgroundColor: COLORS.white, borderColor: COLORS.border, borderRadius: 16, borderWidth: 1, flex: 1, gap: 4, minHeight: 110, padding: 14 },
  choiceCardActive: { backgroundColor: '#ECFFF4', borderColor: '#8EE2AF' }, choiceSubtitle: { color: COLORS.muted, flex: 1, fontSize: 12, lineHeight: 17 }, choiceTitle: { color: COLORS.ink, fontSize: 16, fontWeight: '800' },
  content: { gap: 14, paddingBottom: 110, paddingHorizontal: 18, paddingTop: 14 }, disclaimer: { color: COLORS.muted, fontSize: 11, lineHeight: 17, textAlign: 'center' },
  fieldLabel: { color: COLORS.ink, fontSize: 13, fontWeight: '800', marginTop: 4 }, financeCard: { backgroundColor: COLORS.card, borderColor: COLORS.border, borderRadius: 22, borderWidth: 1, gap: 12, padding: 17 },
  financeLabel: { color: COLORS.muted, fontSize: 13 }, financeRow: { alignItems: 'center', borderBottomColor: '#F0E8DB', borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10 }, financeTitle: { color: COLORS.ink, fontSize: 18, fontWeight: '900' }, financeValue: { color: COLORS.ink, fontSize: 14, fontWeight: '800' },
  freePill: { backgroundColor: '#ECFFF4', borderRadius: 16, paddingHorizontal: 11, paddingVertical: 6 }, freeText: { color: '#15803D', fontSize: 11, fontWeight: '800' }, greenText: { color: '#15803D' },
  hero: { backgroundColor: COLORS.navy, borderRadius: 26, gap: 11, overflow: 'hidden', padding: 23 }, heroBadge: { alignSelf: 'flex-start', backgroundColor: '#263247', borderRadius: 15, paddingHorizontal: 11, paddingVertical: 6 }, heroBadgeText: { color: '#CBD5E1', fontSize: 10, fontWeight: '900', letterSpacing: 0.5 }, heroBullet: { alignItems: 'center', flexDirection: 'row', gap: 8 }, heroBulletText: { color: '#E2E8F0', fontSize: 13, fontWeight: '600' }, heroText: { color: '#CBD5E1', fontSize: 14, lineHeight: 21 }, heroTitle: { color: COLORS.white, fontSize: 26, fontWeight: '900', lineHeight: 32 },
  hint: { color: COLORS.muted, fontSize: 12, lineHeight: 18 }, infoBox: { alignItems: 'flex-start', backgroundColor: '#FFF8EC', borderColor: '#F4DBA8', borderRadius: 16, borderWidth: 1, flexDirection: 'row', gap: 9, padding: 13 }, infoText: { color: '#92400E', flex: 1, fontSize: 12, lineHeight: 18 },
  inputShell: { alignItems: 'center', backgroundColor: COLORS.white, borderColor: COLORS.border, borderRadius: 16, borderWidth: 1, flexDirection: 'row', paddingHorizontal: 15 }, inputUnit: { color: COLORS.muted, fontSize: 13, fontWeight: '800' }, metric: { backgroundColor: COLORS.card, borderColor: COLORS.border, borderRadius: 18, borderWidth: 1, padding: 14, width: '48%' },
  metricLabel: { color: COLORS.muted, fontSize: 11, lineHeight: 16, marginTop: 5 }, metricValue: { color: COLORS.ink, fontSize: 17, fontWeight: '900' }, moneyInput: { color: COLORS.ink, flex: 1, fontSize: 20, fontWeight: '800', minHeight: 54 },
  optionCopy: { flex: 1 }, optionIcon: { alignItems: 'center', backgroundColor: '#FFF6E4', borderRadius: 14, height: 40, justifyContent: 'center', width: 40 }, optionRow: { alignItems: 'center', backgroundColor: COLORS.white, borderColor: COLORS.border, borderRadius: 18, borderWidth: 1, flexDirection: 'row', gap: 12, padding: 13 }, optionRowActive: { backgroundColor: '#FFFCF4', borderColor: '#F4C66D' }, optionSubtitle: { color: COLORS.muted, fontSize: 12, marginTop: 2 }, optionTitle: { color: COLORS.ink, fontSize: 15, fontWeight: '800' },
  primaryButton: { alignItems: 'center', backgroundColor: COLORS.amber, borderRadius: 16, elevation: 3, flexDirection: 'row', gap: 9, justifyContent: 'center', marginTop: 5, minHeight: 54, paddingHorizontal: 18, shadowColor: '#92400E', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8 }, primaryButtonDisabled: { opacity: 0.4 }, primaryButtonText: { color: COLORS.white, fontSize: 15, fontWeight: '900' },
  privacy: { color: COLORS.muted, fontSize: 11, lineHeight: 17, textAlign: 'center' }, productsButton: { alignItems: 'center', backgroundColor: COLORS.white, borderColor: COLORS.border, borderRadius: 16, borderWidth: 1, flexDirection: 'row', gap: 8, justifyContent: 'center', minHeight: 50 }, productsText: { color: COLORS.ink, fontSize: 14, fontWeight: '800' },
  progressPart: { backgroundColor: '#E8DED0', borderRadius: 4, flex: 1, height: 5 }, progressPartActive: { backgroundColor: COLORS.amber }, progressRow: { alignItems: 'center', flexDirection: 'row', gap: 12 }, progressText: { color: COLORS.muted, fontSize: 11, fontWeight: '800' }, progressTrack: { flex: 1, flexDirection: 'row', gap: 5 },
  regionBlock: { gap: 9 }, resetButton: { alignItems: 'center', paddingVertical: 9 }, resetText: { color: COLORS.muted, fontSize: 13, fontWeight: '700' }, resultDescription: { color: '#CBD5E1', fontSize: 13, lineHeight: 20 }, resultEyebrow: { color: '#FBBF24', fontSize: 10, fontWeight: '900', letterSpacing: 0.5 }, resultGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between' }, resultHero: { backgroundColor: COLORS.navy, borderRadius: 24, gap: 9, padding: 21 }, resultTitle: { color: COLORS.white, fontSize: 25, fontWeight: '900', lineHeight: 31 }, resultWrap: { gap: 13 },
  roundButton: { alignItems: 'center', backgroundColor: COLORS.white, borderColor: COLORS.border, borderRadius: 17, borderWidth: 1, height: 42, justifyContent: 'center', width: 42 }, screen: { backgroundColor: COLORS.cream, flex: 1 }, section: { gap: 7 }, sectionBody: { gap: 13, marginTop: 9 }, sectionSubtitle: { color: COLORS.muted, fontSize: 14, lineHeight: 21 },
  sectionTitle: { color: COLORS.ink, fontSize: 24, fontWeight: '900', lineHeight: 30 }, summaryBox: { backgroundColor: '#F8F6F1', borderRadius: 16, gap: 5, padding: 14 }, summaryText: { color: COLORS.muted, fontSize: 12, lineHeight: 18 }, summaryTitle: { color: COLORS.ink, fontSize: 14, fontWeight: '900' },
  textInput: { backgroundColor: COLORS.white, borderColor: COLORS.border, borderRadius: 16, borderWidth: 1, color: COLORS.ink, fontSize: 15, minHeight: 54, paddingHorizontal: 15 }, threeColumns: { flexDirection: 'row', gap: 7 }, topline: { alignItems: 'center', flexDirection: 'row', gap: 10 }, twoColumns: { flexDirection: 'row', gap: 10 }, typeCard: { alignItems: 'center', backgroundColor: COLORS.white, borderColor: COLORS.border, borderRadius: 16, borderWidth: 1, flex: 1, gap: 5, minHeight: 108, padding: 10 }, typeCardActive: { backgroundColor: '#FFF8EC', borderColor: '#F4C66D' }, typeSubtitle: { color: COLORS.muted, fontSize: 10, textAlign: 'center' },
  typeTitle: { color: COLORS.ink, fontSize: 12, fontWeight: '800', textAlign: 'center' }, usageCard: { backgroundColor: COLORS.card, borderColor: COLORS.border, borderRadius: 20, borderWidth: 1, gap: 16, padding: 16 }, usageControls: { alignItems: 'center', flexDirection: 'row', gap: 12 }, usageFill: { backgroundColor: COLORS.green, borderRadius: 6, height: 9 }, usageHeader: { flexDirection: 'row', justifyContent: 'space-between' }, usageTrack: { backgroundColor: '#E7E1D8', borderRadius: 6, flex: 1, height: 9, overflow: 'hidden' }, usageValue: { color: COLORS.ink, fontSize: 13, fontWeight: '800' },
  warningBox: { alignItems: 'flex-start', backgroundColor: '#FFF8EC', borderColor: '#F4DBA8', borderRadius: 16, borderWidth: 1, flexDirection: 'row', gap: 9, padding: 13 }, warningText: { color: '#92400E', flex: 1, fontSize: 12, lineHeight: 18 },
})
