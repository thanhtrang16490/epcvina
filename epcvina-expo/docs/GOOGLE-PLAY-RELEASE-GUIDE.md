# Hướng dẫn phát hành app lên Google Play Store

## Tình trạng hiện tại
✅ App đã upload thành công lên Google Play Console
✅ App đang ở trạng thái "Internal Testing"
❌ Public user không thể tải được app

## Nguyên nhân và giải pháp

### 1. App chưa được phát hành công khai

**Vấn đề**: App chỉ ở trạng thái "Internal Testing" nên chỉ tester được mời mới tải được.

**Giải pháp**: Chuyển app sang Production release

#### Bước 1: Kiểm tra trạng thái hiện tại
1. Vào Google Play Console
2. Chọn app APPE JV
3. Vào **Release** > **Production**
4. Kiểm tra xem có release nào đang active không

#### Bước 2: Tạo Production Release
1. Vào **Production** > **Create new release**
2. Upload file AAB (nếu chưa có): `c351876a-179b-44f1-84b9-32d5c8e70795`
3. Điền thông tin release:
   - **Release name**: Version 1.0.2
   - **Release notes**: "Phiên bản đầu tiên của ứng dụng APPE JV"

#### Bước 3: Review và Submit
1. Review tất cả thông tin
2. Click **Review release**
3. Click **Start rollout to Production**

### 2. App chưa hoàn thành review process

**Vấn đề**: Google Play cần thời gian review app trước khi công khai.

**Thời gian review**: 1-3 ngày làm việc

**Cách kiểm tra**:
1. Vào **Release** > **Production**
2. Xem status của release:
   - **Under review**: Đang được review
   - **Pending publication**: Chờ phát hành
   - **Live**: Đã phát hành

### 3. App bị từ chối do vi phạm policy

**Cách kiểm tra**:
1. Vào **Policy** > **Policy status**
2. Kiểm tra có warning hoặc violation nào không
3. Xem email từ Google Play Developer

### 4. Thiếu thông tin bắt buộc

**Các thông tin cần hoàn thành**:

#### Store Listing
- [ ] App name
- [ ] Short description
- [ ] Full description
- [ ] App icon (512x512)
- [ ] Feature graphic (1024x500)
- [ ] Screenshots (ít nhất 2 ảnh)
- [ ] Privacy Policy URL

#### Content Rating
- [ ] Hoàn thành questionnaire
- [ ] Nhận rating phù hợp

#### Pricing & Distribution
- [ ] Chọn countries/regions
- [ ] Pricing (Free/Paid)
- [ ] Content guidelines

#### App Content
- [ ] Target audience
- [ ] Content declarations
- [ ] Advertising ID declaration

## Checklist hoàn thành trước khi phát hành

### Store Listing
```
✅ App name: APPE JV
✅ Short description: (cần điền)
✅ Full description: (cần điền)
✅ App icon: (cần upload)
✅ Feature graphic: (cần upload)
✅ Screenshots: (cần upload)
✅ Privacy Policy: https://epcvina.com/app-privacy-policy
```

### Content Rating
```
✅ Complete questionnaire
✅ Receive appropriate rating
```

### Pricing & Distribution
```
✅ Select Vietnam and other target countries
✅ Set as Free app
✅ Accept content guidelines
```

### App Content
```
✅ Target audience: Business/Professional
✅ Content declarations: Complete all required forms
✅ Advertising ID: "No, my app does not use advertising ID"
```

## Các bước thực hiện ngay

### 1. Hoàn thành Store Listing
1. Vào **Store presence** > **Store listing**
2. Điền đầy đủ thông tin:
   - Short description (80 characters)
   - Full description (4000 characters)
   - Upload app icon (512x512 PNG)
   - Upload feature graphic (1024x500 JPG/PNG)
   - Upload screenshots (ít nhất 2 ảnh)

### 2. Hoàn thành Content Rating
1. Vào **Policy** > **App content** > **Content rating**
2. Hoàn thành questionnaire
3. Submit để nhận rating

### 3. Cấu hình Pricing & Distribution
1. Vào **Release** > **Pricing and distribution**
2. Chọn countries: Vietnam, và các nước khác nếu cần
3. Chọn "Free" nếu app miễn phí
4. Accept tất cả content guidelines

### 4. Tạo Production Release
1. Vào **Release** > **Production**
2. Create new release
3. Upload AAB file từ build `c351876a-179b-44f1-84b9-32d5c8e70795`
4. Submit for review

## Timeline dự kiến

- **Ngay**: Hoàn thành store listing và content rating
- **1-2 ngày**: Google review app
- **3-7 ngày**: App xuất hiện trên Play Store cho public users

## Lưu ý quan trọng

1. **App phải pass tất cả policy checks** trước khi được phát hành
2. **Store listing phải hoàn chỉnh** (description, screenshots, etc.)
3. **Content rating phải được hoàn thành**
4. **Pricing & distribution phải được cấu hình**

## Troubleshooting

### Nếu app bị reject
1. Kiểm tra email từ Google Play Developer
2. Vào **Policy** > **Policy status** để xem chi tiết
3. Khắc phục các vấn đề được chỉ ra
4. Submit lại

### Nếu app không xuất hiện trên Play Store
1. Kiểm tra app đã được rollout to Production chưa
2. Kiểm tra countries/regions selection
3. Đợi 2-4 giờ để app propagate across Play Store servers
4. Search bằng exact package name: `com.epcvina.android`

## Liên hệ hỗ trợ

Nếu vẫn gặp vấn đề, cung cấp:
- Screenshot của Production release status
- Screenshot của Policy status
- Thông báo lỗi cụ thể (nếu có)