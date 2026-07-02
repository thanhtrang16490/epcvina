# Fix App Icon - Logo bị tràn ra ngoài

## Vấn đề
Logo trong app icon trên Android bị tràn ra ngoài vùng hiển thị.

## Nguyên nhân
Android Adaptive Icon yêu cầu:
- Foreground image phải có kích thước 108x108dp
- Vùng an toàn (safe zone) chỉ là 66x66dp ở giữa
- Logo cần có padding ít nhất 21dp mỗi bên để không bị cắt

## Giải pháp

### Cách 1: Tạo lại adaptive-icon.png với padding
1. Mở file `assets/adaptive-icon.png` (kích thước 1024x1024px)
2. Logo chỉ nên chiếm 66% diện tích giữa (khoảng 675x675px)
3. Để padding 21% mỗi bên (khoảng 175px)

### Cách 2: Sử dụng backgroundColor thay vì foreground lớn
Cập nhật `app.json`:

```json
"android": {
  "adaptiveIcon": {
    "foregroundImage": "./assets/adaptive-icon.png",
    "backgroundColor": "#175ead"
  }
}
```

Sau đó tạo `adaptive-icon.png` mới với:
- Logo nhỏ hơn, chỉ chiếm 60-70% diện tích
- Background trong suốt
- Logo ở giữa với padding đủ lớn

### Cách 3: Tạo adaptive icon riêng biệt
Tạo file mới `assets/adaptive-icon-foreground.png` với logo nhỏ hơn:

```json
"android": {
  "adaptiveIcon": {
    "foregroundImage": "./assets/adaptive-icon-foreground.png",
    "backgroundColor": "#ffffff"
  }
}
```

## Hướng dẫn tạo adaptive-icon.png đúng cách

### Kích thước chuẩn
- File size: 1024x1024px
- Safe zone: 675x675px (66% ở giữa)
- Padding: 175px mỗi bên

### Quy tắc thiết kế
1. Logo chính nên nằm trong vùng 675x675px ở giữa
2. Không đặt text quan trọng gần cạnh
3. Test với các hình dạng khác nhau: tròn, vuông, squircle

### Tool để test
Sử dụng Android Studio > Image Asset để preview adaptive icon với các hình dạng khác nhau.

## Sau khi sửa

1. Build lại app:
```bash
cd epcvina-expo
eas build --platform android --profile production
```

2. Hoặc test local:
```bash
npx expo prebuild --clean
npx expo run:android
```

## Tham khảo
- [Android Adaptive Icons Guide](https://developer.android.com/guide/practices/ui_guidelines/icon_design_adaptive)
- [Expo Icon Guidelines](https://docs.expo.dev/develop/user-interface/app-icons/)
