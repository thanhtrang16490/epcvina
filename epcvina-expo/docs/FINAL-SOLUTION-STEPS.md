# Hướng dẫn khắc phục lỗi Google Play Console - BƯỚC CUỐI CÙNG

## Tình trạng hiện tại

✅ **Version Code đã được sửa**: Build mới nhất có version code 4
✅ **CAMERA permission đã được xóa**: AndroidManifest.xml không còn CAMERA permission
✅ **Plugin đã được cấu hình**: expo-image-picker với `"cameraPermission": false`

## Vấn đề còn lại

Bạn vẫn thấy lỗi CAMERA permission vì có thể đang upload **sai file AAB**.

## GIẢI PHÁP CUỐI CÙNG

### Bước 1: Download đúng file AAB

**Build ID cần dùng**: `c351876a-179b-44f1-84b9-32d5c8e70795`

1. Vào EAS Dashboard: https://expo.dev/accounts/thanhtrang16490/projects/epcvina/builds
2. Tìm build ID: `c351876a-179b-44f1-84b9-32d5c8e70795`
3. Click vào build đó
4. Download file AAB từ link: https://expo.dev/artifacts/eas/q7Tv3JmDUwuHSMXpErBQPF.aab

### Bước 2: Kiểm tra file AAB (Tùy chọn)

Chạy script kiểm tra để đảm bảo file AAB đúng:

```bash
cd epcvina-expo
./verify-aab.sh path/to/your/downloaded.aab
```

### Bước 3: Upload lên Google Play Console

1. Vào Google Play Console
2. Chọn app APPE JV
3. Vào **Production** > **Releases**
4. Tạo release mới
5. Upload file AAB vừa download
6. Điền thông tin release
7. Review và publish

### Bước 4: Hoàn thành biểu mẫu AD_ID

1. Vào **Policy** > **App content**
2. Tìm **Advertising ID**
3. Chọn **"No, my app does not use advertising ID"** (nếu app không có quảng cáo)
4. Save

## Kiểm tra kết quả

Sau khi upload file AAB mới:

✅ **Version code sẽ là 4** (thay vì 1)
✅ **CAMERA permission warning sẽ biến mất**
✅ **Có thể upgrade từ version cũ**

## Nếu vẫn có lỗi

### Trường hợp 1: Vẫn có CAMERA permission
- Kiểm tra lại bạn đã download đúng file AAB chưa
- Build ID phải là: `c351876a-179b-44f1-84b9-32d5c8e70795`
- Version code phải là 5

### Trường hợp 2: Vẫn có version code 1
- Bạn đang upload sai file AAB
- Download lại từ build mới nhất

### Trường hợp 3: Cần build mới
Nếu vẫn không được, chạy build mới:

```bash
cd epcvina-expo
eas build --platform android --profile production --clear-cache
```

## Lưu ý quan trọng

1. **Chỉ upload file AAB từ build `c351876a-179b-44f1-84b9-32d5c8e70795`**
2. **Không upload file AAB từ các build cũ**
3. **Kiểm tra version code trong Google Play Console phải là 5**

## Liên hệ hỗ trợ

Nếu vẫn gặp vấn đề, cung cấp:
- Screenshot lỗi từ Google Play Console
- Build ID bạn đã sử dụng
- File name của AAB đã upload