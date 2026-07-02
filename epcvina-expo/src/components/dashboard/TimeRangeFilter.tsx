import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LAYOUT } from '../../constants/layout'
import { COLORS } from '../../constants/colors'

const { PADDING: SPACING, RADIUS } = LAYOUT

interface TimeRangeOption {
  id: string
  label: string
}

interface TimeRangeFilterProps {
  activeFilter: string
  onFilterChange: (filterId: string) => void
  options: TimeRangeOption[]
}

/**
 * Component filter thời gian cho dashboard
 * @param activeFilter - Filter đang active
 * @param onFilterChange - Handler khi thay đổi filter
 * @param options - Danh sách các options
 */
export default function TimeRangeFilter({
  activeFilter,
  onFilterChange,
  options,
}: TimeRangeFilterProps) {
  const activeOption = options.find(opt => opt.id === activeFilter)

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
      >
        {options.map(option => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.filterTab,
              activeFilter === option.id && styles.activeFilterTab,
            ]}
            onPress={() => onFilterChange(option.id)}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === option.id && styles.activeFilterText,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

interface TimeRangeModalProps {
  visible: boolean
  activeFilter: string
  options: TimeRangeOption[]
  onClose: () => void
  onSelect: (filterId: string) => void
}

/**
 * Modal để chọn time range
 */
export function TimeRangeModal({
  visible,
  activeFilter,
  options,
  onClose,
  onSelect,
}: TimeRangeModalProps) {
  const handleSelect = (filterId: string) => {
    onSelect(filterId)
    onClose()
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Chọn khoảng thời gian</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.optionsList}>
            {options.map(option => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionItem,
                  activeFilter === option.id && styles.activeOptionItem,
                ]}
                onPress={() => handleSelect(option.id)}
              >
                <Text
                  style={[
                    styles.optionText,
                    activeFilter === option.id && styles.activeOptionText,
                  ]}
                >
                  {option.label}
                </Text>
                {activeFilter === option.id && (
                  <Ionicons name="checkmark" size={20} color={COLORS.PRIMARY.DEFAULT} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.MEDIUM,
  },
  filterContainer: {
    gap: SPACING.SMALL,
    paddingRight: SPACING.MEDIUM,
  },
  filterTab: {
    paddingHorizontal: SPACING.MEDIUM,
    paddingVertical: SPACING.SMALL,
    borderRadius: RADIUS.ROUND,
    backgroundColor: '#f5f5f5',
  },
  activeFilterTab: {
    backgroundColor: COLORS.PRIMARY.DEFAULT,
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeFilterText: {
    color: 'white',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: RADIUS.XLARGE,
    borderTopRightRadius: RADIUS.XLARGE,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.LARGE,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  optionsList: {
    padding: SPACING.MEDIUM,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.MEDIUM,
    borderRadius: RADIUS.MEDIUM,
    marginBottom: SPACING.TINY,
  },
  activeOptionItem: {
    backgroundColor: COLORS.PRIMARY.LIGHT,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  activeOptionText: {
    color: COLORS.PRIMARY.DEFAULT,
    fontWeight: '600',
  },
})
