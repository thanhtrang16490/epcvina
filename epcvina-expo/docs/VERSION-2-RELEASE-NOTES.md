# Version 2 Release Notes

## Thay đổi chính

### 1. Xóa quyền CAMERA không cần thiết
- App chỉ sử dụng thư viện ảnh (Image Library), không cần camera
- Đã xóa `android.permission.CAMERA` khỏi AndroidManifest.xml
- Đã xóa `android.permission.RECORD_AUDIO` (không sử dụng)
- Đã xóa `NSCameraUsageDescription` khỏi iOS Info.plist

### 2. Tăng Version Code
- Version Code: 1 → 2
- Version Name: vẫn là 1.0.0

### 3. Bật R8/ProGuard Minification
- Giảm kích thước app
- Tự động tạo mapping file cho crash reports
- Cấu hình ProGuard rules cho React Native, Hermes, Expo

## Files đã thay đổi

### app.json
```json
{
  "android": {
    "versionCode": 2,
    "permissions": [
      "READ_EXTERNAL_STORAGE",
      "WRITE_EXTERNAL_STORAGE", 
      "VIBRATE",
      "RECEIVE_BOOT_COMPLETED"
    ]
  },
  "ios": {
    "infoPlist": {
      "NSPhotoLibraryUsageDescription": "Ứng dụng cần quyền truy cập thư viện ảnh để tải lên hình ảnh sản phẩm"
    }
  }
}
```

### android/gradle.properties
```properties
android.enableMinifyInReleaseBuilds=true
android.enableShrinkResourcesInReleaseBuilds=true
```

### android/app/src/main/AndroidManifest.xml
- Xóa `<uses-permission android:name="android.permission.CAMERA"/>`
- Xóa `<uses-permission android:name="android.permission.RECORD_AUDIO"/>`

### android/app/proguard-rules.pro
- Thêm rules cho React Native
- Thêm rules cho Hermes
- Thêm rules cho Expo modules
- Keep source file names và line numbers

## Cách build

### Build Production (Android)
```bash
cd epcvina-expo

# Build với EAS
eas build --platform android --profile production

# Hoặc build local
eas build --platform android --profile production --local
```

### Submit lên Google Play
```bash
# Tự động submit (EAS sẽ tự động upload mapping file)
eas submit --platform android --latest

# Hoặc manual upload qua Google Play Console
# Mapping file sẽ ở: android/app/build/outputs/mapping/release/mapping.txt
```

## Kiểm tra trước khi release

### 1. Test chức năng upload ảnh
- Vào màn hình Inventory
- Thêm/sửa sản phẩm
- Chọn ảnh từ thư viện
- Verify ảnh upload thành công

### 2. Test các quyền còn lại
- Notifications (VIBRATE, RECEIVE_BOOT_COMPLETED)
- Storage (READ/WRITE_EXTERNAL_STORAGE)
- Biometric authentication (USE_BIOMETRIC, USE_FINGERPRINT)

### 3. Kiểm tra kích thước app
- Version 1 (không minify): ~XX MB
- Version 2 (có minify): ~YY MB (giảm ~ZZ%)

### 4. Test trên release build
```bash
# Build APK để test
eas build --platform android --profile preview

# Install và test thủ công
```

## Lưu ý quan trọng

### Google Play Console
1. Sau khi upload, đợi vài phút để Google xử lý
2. Kiểm tra **App bundle explorer** để verify mapping file đã được upload
3. Cảnh báo về CAMERA permission sẽ biến mất

### Crash Reports
- Với mapping file, stack traces sẽ được deobfuscate tự động
- Luôn giữ mapping file cho mỗi version để debug

### Rollback (nếu cần)
Nếu có vấn đề với version 2:
```bash
# Tắt minification
# Trong android/gradle.properties:
android.enableMinifyInReleaseBuilds=false

# Build lại
eas build --platform android --profile production --clear-cache
```

## Checklist trước khi submit

- [ ] Version code đã tăng (2)
- [ ] Xóa quyền CAMERA khỏi manifest
- [ ] ProGuard rules đã cấu hình đúng
- [ ] Test upload ảnh hoạt động
- [ ] Test trên release build
- [ ] Mapping file được tạo tự động
- [ ] Privacy Policy đã cập nhật (nếu cần)

## Next Steps

Sau khi version 2 được approve:
1. Monitor crash reports trong Google Play Console
2. Kiểm tra user feedback về performance
3. Verify kích thước app đã giảm
4. Plan cho version 3 (nếu có)
