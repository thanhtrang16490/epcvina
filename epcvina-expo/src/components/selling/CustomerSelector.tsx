import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

// Customer type
export interface CustomerType {
  id: string
  full_name: string | null
  phone: string | null
  role: string
  created_at: string
}

interface CustomerSelectorProps {
  customers: CustomerType[]
  selectedCustomer: CustomerType | null
  searchQuery: string
  onSearchChange: (query: string) => void
  onSelectCustomer: (customer: CustomerType) => void
  onClearSelection: () => void
  filteredCustomers: CustomerType[]
}

export default function CustomerSelector({
  customers,
  selectedCustomer,
  searchQuery,
  onSearchChange,
  onSelectCustomer,
  onClearSelection,
  filteredCustomers,
}: CustomerSelectorProps) {
  const renderCustomerItem = ({ item }: { item: CustomerType }) => (
    <TouchableOpacity
      key={item.id}
      style={styles.searchResultItem}
      onPress={() => {
        onSelectCustomer(item)
        onSearchChange('')
      }}
    >
      <View style={styles.customerAvatar}>
        <Text style={styles.customerAvatarText}>
          {item.full_name?.[0]?.toUpperCase() || 'K'}
        </Text>
      </View>
      <View style={styles.customerInfo}>
        <Text style={styles.customerName}>{item.full_name || 'Không có tên'}</Text>
        <Text style={styles.customerPhone}>{item.phone || item.id.substring(0, 8)}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
    </TouchableOpacity>
  )

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionLabel}>Khách hàng</Text>
        {!selectedCustomer && customers.length > 0 && (
          <TouchableOpacity onPress={() => onSearchChange(' ')}>
            <Text style={styles.showAllText}>Hiện tất cả ({customers.length})</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {selectedCustomer ? (
        <View style={styles.selectedCustomer}>
          <View style={styles.customerAvatar}>
            <Text style={styles.customerAvatarText}>
              {selectedCustomer.full_name?.[0]?.toUpperCase() || 'K'}
            </Text>
          </View>
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>{selectedCustomer.full_name}</Text>
            <Text style={styles.customerPhone}>{selectedCustomer.phone || selectedCustomer.id.substring(0, 8)}</Text>
          </View>
          <TouchableOpacity onPress={onClearSelection}>
            <Ionicons name="close-circle" size={24} color="#9ca3af" />
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm theo tên hoặc số điện thoại..."
              value={searchQuery}
              onChangeText={onSearchChange}
              placeholderTextColor="#9ca3af"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => onSearchChange('')}>
                <Ionicons name="close-circle" size={20} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>
          
          {filteredCustomers.length > 0 && (
            <View style={styles.searchResults}>
              <FlatList
                data={filteredCustomers}
                renderItem={renderCustomerItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </View>
          )}
          
          {searchQuery.length >= 2 && filteredCustomers.length === 0 && (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>Không tìm thấy khách hàng</Text>
              <Text style={styles.noResultsHint}>
                Thử tìm với từ khóa khác hoặc nhấn "Hiện tất cả"
              </Text>
            </View>
          )}
          
          {customers.length === 0 && (
            <View style={styles.noResults}>
              <Ionicons name="people-outline" size={48} color="#d1d5db" />
              <Text style={styles.noResultsText}>Chưa có khách hàng nào</Text>
              <Text style={styles.noResultsHint}>
                Thêm khách hàng từ trang Quản lý người dùng
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  showAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#175ead',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  searchResults: {
    marginTop: 8,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  noResults: {
    marginTop: 8,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 8,
  },
  noResultsHint: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'center',
  },
  selectedCustomer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  customerAvatar: {
    width: 40,
    height: 40,
    backgroundColor: '#dbeafe',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  customerAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#175ead',
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  customerPhone: {
    fontSize: 12,
    color: '#6b7280',
  },
})

