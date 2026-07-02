/**
 * RevenueChart - Biểu đồ doanh thu thuần React Native (không cần thư viện chart)
 * Hiển thị bar chart doanh thu theo ngày/tuần/tháng
 */

import React, { useMemo } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export interface RevenueDataPoint {
  label: string      // Nhãn trục X (ngày, tuần, tháng)
  value: number      // Giá trị doanh thu
  isHighlight?: boolean // Highlight bar (hôm nay, tháng này...)
}

interface RevenueChartProps {
  data: RevenueDataPoint[]
  title?: string
  subtitle?: string
  height?: number
  color?: string
  onBarPress?: (point: RevenueDataPoint, index: number) => void
}

function formatShortCurrency(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}T`
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`
  return `${value}`
}

function formatFullCurrency(value: number): string {
  return new Intl.NumberFormat('vi-VN').format(value) + ' đ'
}

export default function RevenueChart({
  data,
  title = 'Doanh thu',
  subtitle,
  height = 160,
  color = '#175ead',
  onBarPress,
}: RevenueChartProps) {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null)

  const maxValue = useMemo(() => {
    const max = Math.max(...data.map(d => d.value), 1)
    // Round up to nice number
    const magnitude = Math.pow(10, Math.floor(Math.log10(max)))
    return Math.ceil(max / magnitude) * magnitude
  }, [data])

  const totalRevenue = useMemo(() => data.reduce((s, d) => s + d.value, 0), [data])
  const avgRevenue = data.length > 0 ? totalRevenue / data.length : 0

  // Y-axis labels (4 levels)
  const yLabels = useMemo(() => {
    return [maxValue, maxValue * 0.75, maxValue * 0.5, maxValue * 0.25, 0]
  }, [maxValue])

  const handleBarPress = (point: RevenueDataPoint, index: number) => {
    setSelectedIndex(index === selectedIndex ? null : index)
    onBarPress?.(point, index)
  }

  if (data.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="bar-chart-outline" size={40} color="#d1d5db" />
          <Text style={styles.emptyText}>Chưa có dữ liệu</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        <View style={styles.totalBadge}>
          <Text style={styles.totalLabel}>Tổng</Text>
          <Text style={styles.totalValue}>{formatShortCurrency(totalRevenue)}</Text>
        </View>
      </View>

      {/* Selected bar tooltip */}
      {selectedIndex !== null && data[selectedIndex] && (
        <View style={styles.tooltip}>
          <Text style={styles.tooltipLabel}>{data[selectedIndex].label}</Text>
          <Text style={styles.tooltipValue}>{formatFullCurrency(data[selectedIndex].value)}</Text>
        </View>
      )}

      {/* Chart area */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chartScrollContent}
      >
        <View style={styles.chartArea}>
          {/* Y-axis */}
          <View style={[styles.yAxis, { height }]}>
            {yLabels.map((label, i) => (
              <Text key={i} style={styles.yLabel}>{formatShortCurrency(label)}</Text>
            ))}
          </View>

          {/* Bars + X-axis */}
          <View style={styles.barsContainer}>
            {/* Horizontal grid lines */}
            <View style={[styles.gridLines, { height }]} pointerEvents="none">
              {[0, 1, 2, 3].map(i => (
                <View key={i} style={styles.gridLine} />
              ))}
            </View>

            {/* Bars */}
            <View style={[styles.bars, { height }]}>
              {data.map((point, index) => {
                const barHeightRatio = maxValue > 0 ? point.value / maxValue : 0
                const barHeight = Math.max(barHeightRatio * (height - 8), point.value > 0 ? 4 : 0)
                const isSelected = selectedIndex === index
                const isHighlight = point.isHighlight

                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.barWrapper}
                    onPress={() => handleBarPress(point, index)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.barColumn}>
                      {/* Value label on top of bar */}
                      {(isSelected || isHighlight) && point.value > 0 && (
                        <Text style={[styles.barValueLabel, { color }]}>
                          {formatShortCurrency(point.value)}
                        </Text>
                      )}
                      {/* Bar */}
                      <View
                        style={[
                          styles.bar,
                          {
                            height: barHeight,
                            backgroundColor: isSelected
                              ? color
                              : isHighlight
                              ? color
                              : `${color}66`,
                            borderRadius: 4,
                          },
                        ]}
                      />
                    </View>
                    {/* X-axis label */}
                    <Text
                      style={[
                        styles.xLabel,
                        isSelected && { color, fontWeight: '700' },
                        isHighlight && { color, fontWeight: '600' },
                      ]}
                      numberOfLines={1}
                    >
                      {point.label}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Summary row */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryItemLabel}>Trung bình</Text>
          <Text style={styles.summaryItemValue}>{formatShortCurrency(avgRevenue)}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryItemLabel}>Cao nhất</Text>
          <Text style={[styles.summaryItemValue, { color }]}>{formatShortCurrency(maxValue)}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryItemLabel}>Số kỳ</Text>
          <Text style={styles.summaryItemValue}>{data.length}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  totalBadge: {
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontSize: 11,
    color: '#9ca3af',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  tooltip: {
    backgroundColor: '#111827',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'center',
    marginBottom: 8,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  tooltipLabel: {
    fontSize: 12,
    color: '#9ca3af',
  },
  tooltipValue: {
    fontSize: 13,
    fontWeight: '700',
    color: 'white',
  },
  chartScrollContent: {
    paddingRight: 8,
  },
  chartArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  yAxis: {
    width: 40,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 6,
    paddingBottom: 20, // space for x-labels
  },
  yLabel: {
    fontSize: 9,
    color: '#9ca3af',
    textAlign: 'right',
  },
  barsContainer: {
    flex: 1,
    position: 'relative',
  },
  gridLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  gridLine: {
    height: 1,
    backgroundColor: '#f3f4f6',
    width: '100%',
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 20, // space for x-labels
    gap: 4,
  },
  barWrapper: {
    alignItems: 'center',
    minWidth: 32,
    flex: 1,
  },
  barColumn: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    width: '100%',
  },
  barValueLabel: {
    fontSize: 9,
    fontWeight: '700',
    marginBottom: 2,
  },
  bar: {
    width: '70%',
    minWidth: 20,
    maxWidth: 40,
  },
  xLabel: {
    fontSize: 9,
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'center',
    width: '100%',
  },
  summaryRow: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryItemLabel: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: 2,
  },
  summaryItemValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: '#f3f4f6',
    marginVertical: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 8,
  },
})
