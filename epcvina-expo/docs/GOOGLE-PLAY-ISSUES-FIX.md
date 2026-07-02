# Khắc phục lỗi Google Play Console

## Các lỗi hiện tại

### 1. Lỗi: "Bạn cần tải lên APK hoặc Android App Bundle"
**Nguyên nhân**: Chưa upload file AAB mới nhất

**Giải pháp**: Download và upload file AAB từ build mới nhất
- Build ID: `e977c8b2-da03-4edb-9792-69e3499909c3` ✅ (Version Code 4)
- Download URL: https://expo.dev/artifacts/eas/uQ7PkbVT2ZiRivaLmW93AF.aab

**QUAN TRỌNG**: Đảm bảo download đúng file AAB từ build ID trên!

### 2. Lỗi: "Không thể nâng cấp lên các gói ứng dụng mới"
**Nguyên nhân**: Version code vẫn là 1 (không tăng)

**Vấn đề**: EAS đang sử dụng version code từ `android/app/build.gradle` thay vì `app.json`

**Giải pháp**: Cập nhật version code trong native Android code

### 3. Lỗi: "Bản phát hành này không thêm hay xóa gói ứng dụng nào"
**Nguyên nhân**: Version code giống nhau

### 4. Cảnh báo: "Biểu mẫu khai báo về mã nhận dạng cho quảng cáo"
**Nguyên nhân**: App target Android 13 (API 33) cần khai báo AD_ID

## Cách khắc phục

### Bước 1: Cập nhật Version Code trong native code
```gradle
// android/app/build.gradle
android {
    defaultConfig {
        versionCode 4  // Tăng lên 4
        versionName "1.0.1"  // Tăng version name
    }
}
```

### Bước 2: Thêm AD_ID permission (nếu cần)
```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<uses-permission android:name="com.google.android.gms.permission.AD_ID" />
```

### Bước 3: Build lại với version mới
```bash
cd epcvina-expo
eas build --platform android --profile production --clear-cache
```

### Bước 4: Upload AAB mới lên Google Play Console

### Bước 5: Hoàn thành biểu mẫu AD_ID trong Google Play Console
1. Vào **Policy** > **App content**
2. Tìm **Advertising ID**
3. Hoàn thành biểu mẫu khai báo

## Lưu ý quan trọng

- **Version Code phải tăng**: Mỗi lần upload phải có version code cao hơn
- **Native code override**: EAS sử dụng version từ `build.gradle`, không phải `app.json`
- **AD_ID chỉ cần nếu sử dụng quảng cáo**: Nếu app không có ads, có thể bỏ qua

## Kiểm tra version code
```bash
# Xem version code trong build
npx eas-cli build:list --platform android --limit 1
```

## Troubleshooting

### Nếu vẫn lỗi version code
1. Kiểm tra `android/app/build.gradle`
2. Đảm bảo `versionCode` đã tăng
3. Build với `--clear-cache`
4. Verify trong build logs

### Nếu vẫn có CAMERA permission
1. Kiểm tra `AndroidManifest.xml`
2. Kiểm tra plugin config trong `app.json`
3. Clear cache và rebuild