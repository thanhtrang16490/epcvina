# Cấu hình ProGuard và Mapping File cho Google Play Console

## Vấn đề
Google Play Console cảnh báo: "Không có tệp gỡ rối mã nguồn nào liên kết với App Bundle này"

## Giải pháp đã thực hiện

### 1. Bật R8/ProGuard Minification
Đã thêm vào `android/gradle.properties`:
```properties
android.enableMinifyInReleaseBuilds=true
android.enableShrinkResourcesInReleaseBuilds=true
```

### 2. Cập nhật ProGuard Rules
Đã cập nhật `android/app/proguard-rules.pro` với các rules cần thiết cho:
- React Native core
- Hermes engine
- Expo modules
- React Native Reanimated
- Giữ source file names và line numbers cho crash reports

### 3. Cấu hình EAS Build
Đã cập nhật `eas.json` để đảm bảo build đúng cách:
```json
"production": {
  "android": {
    "buildType": "app-bundle",
    "gradleCommand": ":app:bundleRelease"
  }
}
```

## Cách hoạt động

Khi bạn build production với EAS:
```bash
eas build --platform android --profile production
```

EAS sẽ:
1. Build app với R8/ProGuard enabled
2. Tạo mapping file tự động tại `android/app/build/outputs/mapping/release/mapping.txt`
3. Tự động tải mapping file lên Google Play Console khi bạn submit

## Lợi ích

1. **Giảm kích thước app**: R8 minification giúp giảm đáng kể kích thước APK/AAB
2. **Bảo mật code**: Code obfuscation làm khó đọc reverse engineering
3. **Crash reports tốt hơn**: Với mapping file, Google Play Console có thể deobfuscate stack traces
4. **Tuân thủ best practices**: Đáp ứng yêu cầu của Google Play

## Kiểm tra

Sau khi build và upload lên Google Play Console:
1. Vào **Release management** > **App bundle explorer**
2. Chọn version mới nhất
3. Kiểm tra tab **Downloads** - sẽ thấy `mapping.txt` file

## Lưu ý quan trọng

- Mapping file được tạo tự động mỗi lần build release
- EAS tự động upload mapping file khi submit qua `eas submit`
- Nếu upload manual qua Google Play Console, cần upload mapping file thủ công từ `android/app/build/outputs/mapping/release/mapping.txt`
- Luôn giữ mapping file cho mỗi version để có thể debug crash reports

## Troubleshooting

### Nếu vẫn thấy cảnh báo sau khi upload
1. Đợi vài phút để Google Play xử lý
2. Kiểm tra lại trong App bundle explorer
3. Nếu vẫn không có, thử upload manual mapping file

### Nếu app crash sau khi enable ProGuard
1. Kiểm tra crash logs trong Google Play Console
2. Thêm keep rules cần thiết vào `proguard-rules.pro`
3. Test kỹ trên release build trước khi submit

### Build lỗi
```bash
# Clear build cache
cd android
./gradlew clean
cd ..

# Rebuild
eas build --platform android --profile production --clear-cache
```

## Tham khảo
- [Android R8 Documentation](https://developer.android.com/studio/build/shrink-code)
- [EAS Build Configuration](https://docs.expo.dev/build/eas-json/)
- [ProGuard Rules](https://www.guardsquare.com/manual/configuration/usage)
