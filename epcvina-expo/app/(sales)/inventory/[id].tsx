import { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, Alert, TextInput, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../../src/contexts/AuthContext'
import { supabase } from '../../../src/lib/supabase'
import { Ionicons } from '@expo/vector-icons'
import { useRouter, useLocalSearchParams } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import SuccessModal from '../../../src/components/SuccessModal'

const getStockStatus = (stock: number) => {
  if (stock === 0) {
    return { label: 'Hết hàng', color: '#ef4444', bg: '#fee2e2', icon: 'close-circle' }
  } else if (stock < 20) {
    return { label: 'Sắp hết', color: '#f59e0b', bg: '#fef3c7', icon: 'warning' }
  } else {
    return { label: 'Còn hàng', color: '#10b981', bg: '#d1fae5', icon: 'checkmark-circle' }
  }
}

export default function ProductDetailScreen() {
  const { user } = useAuth()
  const router = useRouter()
  const { id } = useLocalSearchParams()
  const [profile, setProfile] = useState<any>(null)
  const [product, setProduct] = useState<any>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [showCategoryPicker, setShowCategoryPicker] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [editedData, setEditedData] = useState({
    name: '',
    code: '',
    category_id: '',
    description: '',
    price: '',
    stock: '',
  })

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      setLoading(true)
      const { data: { user: authUser } } = await supabase.auth.getUser()

      if (!authUser) {
        router.replace('/(auth)/login')
        return
      }

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authUser.id)
        .single()

      if (!profileData || !['sale', 'admin', 'sale_admin'].includes(profileData.role)) {
        Alert.alert('Lỗi', 'Bạn không có quyền truy cập')
        router.back()
        return
      }

      setProfile(profileData)

      // Fetch categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      setCategories(categoriesData || [])

      // Fetch product
      const { data: productData } = await supabase
        .from('products')
        .select('*, categories(id, name)')
        .eq('id', id)
        .is('deleted_at', null)
        .single()

      if (!productData) {
        Alert.alert('Lỗi', 'Không tìm thấy sản phẩm')
        router.back()
        return
      }

      setProduct(productData)
      setEditedData({
        name: productData.name || '',
        code: productData.code || '',
        category_id: productData.category_id || '',
        description: productData.description || '',
        price: productData.price?.toString() || '',
        stock: productData.stock?.toString() || '',
      })
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: editedData.name,
          code: editedData.code,
          category_id: editedData.category_id || null,
          description: editedData.description,
          price: parseFloat(editedData.price) || 0,
          stock: parseInt(editedData.stock) || 0,
        })
        .eq('id', id)

      if (error) throw error

      setShowSuccessModal(true)
      setEditing(false)
      fetchData()
    } catch (error) {
      console.error('Error updating product:', error)
      Alert.alert('Lỗi', 'Không thể cập nhật thông tin sản phẩm')
    }
  }

  const pickImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      
      if (status !== 'granted') {
        Alert.alert('Lỗi', 'Cần quyền truy cập thư viện ảnh')
        return
      }

      // Pick image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      })

      if (!result.canceled && result.assets[0]) {
        await uploadImage(result.assets[0].uri)
      }
    } catch (error) {
      console.error('Error picking image:', error)
      Alert.alert('Lỗi', 'Không thể chọn ảnh')
    }
  }

  const uploadImage = async (uri: string) => {
    try {
      setUploading(true)

      // Convert image to blob
      const response = await fetch(uri)
      const blob = await response.blob()
      
      // Create file name
      const fileExt = uri.split('.').pop()
      const fileName = `${id}-${Date.now()}.${fileExt}`
      const filePath = `products/${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, blob, {
          contentType: 'image/jpeg',
          upsert: true,
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)

      // Update product with image URL
      const { error: updateError } = await supabase
        .from('products')
        .update({ image_url: publicUrl })
        .eq('id', id)

      if (updateError) throw updateError

      setShowSuccessModal(true)
      fetchData()
    } catch (error) {
      console.error('Error uploading image:', error)
      Alert.alert('Lỗi', 'Không thể tải ảnh lên')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = () => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa sản phẩm "${product?.name}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('products')
                .update({ deleted_at: new Date().toISOString() })
                .eq('id', id)

              if (error) throw error

              Alert.alert('Thành công', 'Đã xóa sản phẩm')
              router.back()
            } catch (error) {
              console.error('Error deleting product:', error)
              Alert.alert('Lỗi', 'Không thể xóa sản phẩm')
            }
          },
        },
      ]
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ' đ'
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#175ead" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    )
  }

  if (!product) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Không tìm thấy sản phẩm</Text>
      </View>
    )
  }

  const stockStatus = getStockStatus(product.stock)
  const isAdmin = profile?.role === 'admin'

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết sản phẩm</Text>
        <View style={styles.headerRight}>
          {editing ? (
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSave}
            >
              <Ionicons name="checkmark" size={24} color="#10b981" />
            </TouchableOpacity>
          ) : (
            isAdmin && (
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => setEditing(true)}
              >
                <Ionicons name="create-outline" size={24} color="#175ead" />
              </TouchableOpacity>
            )
          )}
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Product Image */}
        <View style={styles.imageCard}>
          {product.image_url ? (
            <Image 
              source={{ uri: product.image_url }} 
              style={styles.productImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.noImage}>
              <Ionicons name="image-outline" size={48} color="#d1d5db" />
              <Text style={styles.noImageText}>Chưa có ảnh</Text>
            </View>
          )}
          {isAdmin && !editing && (
            <TouchableOpacity 
              style={styles.changeImageButton}
              onPress={pickImage}
              disabled={uploading}
            >
              {uploading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Ionicons name="camera" size={16} color="white" />
                  <Text style={styles.changeImageText}>
                    {product.image_url ? 'Đổi ảnh' : 'Thêm ảnh'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Product Card */}
        <View style={styles.productCard}>
          <View style={[styles.productCardTop, { backgroundColor: stockStatus.bg }]} />
          
          <View style={styles.productHeader}>
            <View style={[styles.productIconContainer, { backgroundColor: stockStatus.bg }]}>
              <Ionicons name="cube" size={40} color={stockStatus.color} />
            </View>
            <View style={[styles.stockBadge, { backgroundColor: stockStatus.bg }]}>
              <Ionicons name={stockStatus.icon as any} size={14} color={stockStatus.color} />
              <Text style={[styles.stockBadgeText, { color: stockStatus.color }]}>
                {stockStatus.label}
              </Text>
            </View>
          </View>

          <View style={styles.productBody}>
            {editing ? (
              <>
                <Text style={styles.inputLabel}>Tên sản phẩm</Text>
                <TextInput
                  style={styles.input}
                  value={editedData.name}
                  onChangeText={(text) => setEditedData({ ...editedData, name: text })}
                  placeholder="Nhập tên sản phẩm"
                />
                
                <Text style={styles.inputLabel}>Mã sản phẩm</Text>
                <TextInput
                  style={styles.input}
                  value={editedData.code}
                  onChangeText={(text) => setEditedData({ ...editedData, code: text })}
                  placeholder="Nhập mã sản phẩm"
                />
                
                <Text style={styles.inputLabel}>Danh mục</Text>
                <TouchableOpacity
                  style={styles.pickerButton}
                  onPress={() => setShowCategoryPicker(!showCategoryPicker)}
                >
                  <Text style={[styles.pickerButtonText, !editedData.category_id && styles.placeholderText]}>
                    {categories.find(c => c.id === editedData.category_id)?.name || 'Chọn danh mục'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#6b7280" />
                </TouchableOpacity>
                
                {showCategoryPicker && (
                  <View style={styles.pickerContainer}>
                    <ScrollView style={styles.pickerScroll}>
                      <TouchableOpacity
                        style={styles.pickerOption}
                        onPress={() => {
                          setEditedData({ ...editedData, category_id: '' })
                          setShowCategoryPicker(false)
                        }}
                      >
                        <Text style={styles.pickerOptionText}>-- Không chọn --</Text>
                      </TouchableOpacity>
                      {categories.map((cat) => (
                        <TouchableOpacity
                          key={cat.id}
                          style={[
                            styles.pickerOption,
                            editedData.category_id === cat.id && styles.pickerOptionActive
                          ]}
                          onPress={() => {
                            setEditedData({ ...editedData, category_id: cat.id })
                            setShowCategoryPicker(false)
                          }}
                        >
                          <Text style={[
                            styles.pickerOptionText,
                            editedData.category_id === cat.id && styles.pickerOptionTextActive
                          ]}>
                            {cat.name}
                          </Text>
                          {editedData.category_id === cat.id && (
                            <Ionicons name="checkmark" size={20} color="#175ead" />
                          )}
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
                
                <Text style={styles.inputLabel}>Mô tả</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={editedData.description}
                  onChangeText={(text) => setEditedData({ ...editedData, description: text })}
                  placeholder="Nhập mô tả"
                  multiline
                  numberOfLines={3}
                />
                
                <Text style={styles.inputLabel}>Giá bán (VNĐ)</Text>
                <TextInput
                  style={styles.input}
                  value={editedData.price}
                  onChangeText={(text) => setEditedData({ ...editedData, price: text })}
                  placeholder="Nhập giá bán"
                  keyboardType="numeric"
                />
                
                <Text style={styles.inputLabel}>Tồn kho</Text>
                <TextInput
                  style={styles.input}
                  value={editedData.stock}
                  onChangeText={(text) => setEditedData({ ...editedData, stock: text })}
                  placeholder="Nhập số lượng tồn kho"
                  keyboardType="numeric"
                />
              </>
            ) : (
              <>
                <Text style={styles.productName}>{product.name}</Text>
                {product.code && (
                  <Text style={styles.productCode}>Mã: {product.code}</Text>
                )}
                {product.categories && (
                  <View style={styles.categoryBadge}>
                    <Ionicons name="pricetag" size={12} color="#6b7280" />
                    <Text style={styles.categoryText}>{product.categories.name}</Text>
                  </View>
                )}
              </>
            )}
          </View>
        </View>

        {/* Info Section */}
        {!editing && (
          <>
            {/* Price & Stock */}
            <View style={styles.infoCard}>
              <View style={styles.priceStockRow}>
                <View style={styles.priceContainer}>
                  <Text style={styles.priceLabel}>Giá bán</Text>
                  <Text style={styles.priceAmount}>{formatCurrency(product.price)}</Text>
                </View>
                <View style={styles.stockContainer}>
                  <Text style={styles.stockLabel}>Tồn kho</Text>
                  <Text style={styles.stockAmount}>{product.stock}</Text>
                </View>
              </View>
            </View>

            {/* Description */}
            {product.description && (
              <View style={styles.infoCard}>
                <Text style={styles.sectionTitle}>Mô tả</Text>
                <Text style={styles.descriptionText}>{product.description}</Text>
              </View>
            )}

            {/* Details */}
            <View style={styles.infoCard}>
              <Text style={styles.sectionTitle}>Thông tin chi tiết</Text>
              
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Ionicons name="card-outline" size={20} color="#6b7280" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>ID</Text>
                  <Text style={styles.infoValue}>{product.id}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Ionicons name="calendar-outline" size={20} color="#6b7280" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Ngày tạo</Text>
                  <Text style={styles.infoValue}>
                    {new Date(product.created_at).toLocaleDateString('vi-VN')}
                  </Text>
                </View>
              </View>

              {product.updated_at && (
                <View style={styles.infoRow}>
                  <View style={styles.infoIcon}>
                    <Ionicons name="time-outline" size={20} color="#6b7280" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Cập nhật lần cuối</Text>
                    <Text style={styles.infoValue}>
                      {new Date(product.updated_at).toLocaleDateString('vi-VN')}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </>
        )}

        {/* Delete Button */}
        {isAdmin && !editing && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <Ionicons name="trash-outline" size={20} color="white" />
            <Text style={styles.deleteButtonText}>Xóa sản phẩm</Text>
          </TouchableOpacity>
        )}

        {/* Cancel Button when editing */}
        {editing && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              setEditing(false)
              setEditedData({
                name: product.name || '',
                code: product.code || '',
                category_id: product.category_id || '',
                description: product.description || '',
                price: product.price?.toString() || '',
                stock: product.stock?.toString() || '',
              })
            }}
          >
            <Text style={styles.cancelButtonText}>Hủy</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Cập nhật thành công!"
        message="Thông tin sản phẩm đã được cập nhật"
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 14,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f0f9ff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  editButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  productCardTop: {
    height: 8,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    paddingBottom: 12,
  },
  productIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  stockBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  productBody: {
    padding: 20,
    paddingTop: 8,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  productCode: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  pickerButtonText: {
    fontSize: 14,
    color: '#111827',
  },
  placeholderText: {
    color: '#9ca3af',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pickerScroll: {
    maxHeight: 200,
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  pickerOptionActive: {
    backgroundColor: '#f0f9ff',
  },
  pickerOptionText: {
    fontSize: 14,
    color: '#374151',
  },
  pickerOptionTextActive: {
    color: '#175ead',
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  priceStockRow: {
    flexDirection: 'row',
    gap: 16,
  },
  priceContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
  },
  priceLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  priceAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#175ead',
  },
  stockContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
  },
  stockLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  stockAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  infoIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ef4444',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: 'white',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  imageCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f3f4f6',
  },
  noImage: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    marginTop: 12,
    fontSize: 14,
    color: '#9ca3af',
  },
  changeImageButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#175ead',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  changeImageText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
})
