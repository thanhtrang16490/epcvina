# Hamburger Menu & Sidebar Navigation - Zalo Mini App

## Tổng quan

Đã thêm hamburger menu button vào header và sidebar navigation cho Zalo Mini App, thiết kế giống EPCVINA Solar website.

## Thay đổi thực hiện

### 1. Header Component Update

**File**: `src/components/header.tsx`

#### Thêm State Management:
```typescript
const [sidebarOpen, setSidebarOpen] = useState(false);
```

#### Thêm Hamburger Button:
```tsx
<button
  onClick={() => setSidebarOpen(true)}
  className="py-1 px-2 cursor-pointer flex items-center justify-center"
  aria-label="Open menu"
>
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
    <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
</button>
```

#### Thêm Sidebar Component:
```tsx
<Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
```

**Vị trí hamburger:**
- Hiển thị khi `!handle?.logo` (không ở trang chủ)
- Bên trái title
- Trước back button (nếu có)

### 2. Sidebar Component (MỚI)

**File**: `src/components/sidebar.tsx`

```
src/components/
├── header.tsx      ⭐ UPDATED - Added hamburger + sidebar
└── sidebar.tsx     ⭐ NEW - Full sidebar navigation
```

#### Cấu trúc Sidebar:

```
┌──────────────────────────────────┐
│  [EPC] EPCVINA Solar      [✕]   │ ← Header
│        Menu                      │
├──────────────────────────────────┤
│  🏠 Trang chủ                    │
│  ⚡ Combos                 [▼]   │
│     ├ Tất cả combos              │
│     ├ On-Grid                    │
│     └ Hybrid                     │
│  📦 Sản phẩm               [▼]   │
│     ├ Tấm pin năng lượng         │
│     ├ Biến tần On-Grid           │
│     ├ Biến tần Hybrid            │
│     ├ Pin lưu trữ                │
│     └ Phụ kiện                   │
│  📁 Dự án                        │
│  📞 Liên hệ                      │
├──────────────────────────────────┤
│  💡 Tư vấn miễn phí              │ ← Footer CTA
│  Liên hệ ngay để được tư vấn     │
│  [Gọi 0988 446 113]              │
└──────────────────────────────────┘
```

## Menu Structure

### Navigation Items:

| # | Item | Icon | Path | Type |
|---|------|------|------|------|
| 1 | **Trang chủ** | 🏠 Home | `/` | Single link |
| 2 | **Combos** | ⚡ Layers | - | Expandable |
|   | ├ Tất cả combos | - | `/combos` | Child |
|   | ├ On-Grid | - | `/combos?filter=on-grid` | Child |
|   | └ Hybrid | - | `/combos?filter=hybrid` | Child |
| 3 | **Sản phẩm** | 📦 Package | - | Expandable |
|   | ├ Tấm pin năng lượng | - | `/categories/panel` | Child |
|   | ├ Biến tần On-Grid | - | `/categories/on-grid-inverter` | Child |
|   | ├ Biến tần Hybrid | - | `/categories/hybrid-inverter` | Child |
|   | ├ Pin lưu trữ | - | `/categories/battery` | Child |
|   | └ Phụ kiện | - | `/categories/accessories` | Child |
| 4 | **Dự án** | 📁 FolderOpen | `/orders` | Single link |
| 5 | **Liên hệ** | 📞 Phone | `/contact` | Single link |

## Visual Design

### Sidebar Panel:

#### Dimensions:
- **Width**: `w-80` (320px)
- **Max width**: `max-w-[85vw]` (85% viewport)
- **Height**: Full viewport (`inset-y-0`)
- **Position**: Fixed left side

#### Header:
- **Background**: White with border
- **Logo**: 40×40px gradient box (red)
- **Title**: "EPCVINA Solar" bold
- **Close button**: X icon, hover:bg-gray-100
- **Sticky**: top-0, stays visible on scroll

#### Menu Items:
- **Default state**: 
  - Text: `text-gray-700`
  - Icon: `text-gray-400`
  - Hover: `bg-gray-50`
  
- **Active state**:
  - Background: `bg-red-50`
  - Text: `text-red-600`
  - Icon: `text-red-600`

- **Padding**: `px-4 py-3`
- **Font**: `text-sm font-medium`

#### Child Items (expanded):
- **Margin left**: `ml-8`
- **Font size**: `text-xs`
- **Active**: `bg-red-100 text-red-700`
- **Hover**: `bg-gray-100`
- **Rounded**: `rounded-lg`

#### Footer CTA:
- **Background**: Gradient `from-red-50 to-orange-50`
- **Padding**: `p-4`
- **Button**: Red `bg-red-600`, full width
- **Border**: Top separator

### Backdrop:
- **Color**: `bg-black/50`
- **Z-index**: `z-50`
- **Click to close**: Yes
- **Transition**: `duration-300`

## Interactions

### Open Sidebar:
1. Tap hamburger icon (☰)
2. `setSidebarOpen(true)`
3. Backdrop fades in
4. Sidebar slides in from left
5. Transition: 300ms ease-in-out

### Close Sidebar:
1. Tap X button (header)
2. Tap backdrop overlay
3. Tap any menu link (auto-close)
4. `setSidebarOpen(false)`
5. Sidebar slides out to left
6. Backdrop fades out

### Expand/Collapse:
1. Tap menu group header (Combos, Sản phẩm)
2. Toggle `expandedItems` array
3. Chevron rotates (▼ / ▶)
4. Child items slide down/up
5. Multiple groups can be open simultaneously

### Active State Detection:
```typescript
const isActive = (href: string) => {
  return location.pathname === href || location.pathname.startsWith(href + "/");
};
```

**Examples:**
- `/combos` → Combos group highlights
- `/categories/panel` → Sản phẩm group highlights
- `/contact` → Liên hệ highlights

## Component Architecture

### MenuGroup Component:

```typescript
function MenuGroup({
  item,           // MenuItem data
  isExpanded,     // boolean
  onToggle,       // () => void
  isActive,       // (href: string) => boolean
  onClose,        // () => void
})
```

**Two modes:**
1. **Single link** (no children): Renders `<TransitionLink>`
2. **Expandable group** (has children): Renders button + child links

### Sidebar Component:

```typescript
function Sidebar({
  isOpen,   // boolean
  onClose,  // () => void
})
```

**State:**
- `expandedItems: string[]` - Array of expanded group names

**Render:**
1. Backdrop overlay (if isOpen)
2. Sidebar panel (fixed, transform)
3. Header with logo + close button
4. Navigation menu (map menuItems)
5. Footer CTA section

## Code Quality

### TypeScript:
```typescript
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  name: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: { name: string; href: string }[];
}
```

### Accessibility:
- ✅ `aria-label="Open menu"` on hamburger
- ✅ `aria-label="Close menu"` on close button
- ✅ Semantic `<nav>` element
- ✅ Proper heading hierarchy (h2, h3)
- ✅ Keyboard accessible (buttons, links)

### Performance:
- ✅ Conditional render (`if (!isOpen) return null`)
- ✅ CSS transitions (GPU-accelerated)
- ✅ No heavy animations
- ✅ Minimal re-renders (local state)

## Comparison with EPCVINA Solar

| Feature | Website | Mini App | Status |
|---------|---------|----------|--------|
| Hamburger icon | Menu/X icons | SVG hamburger | ✅ Similar |
| Sidebar width | 320px | 320px | ✅ Same |
| Backdrop | Black/50% | Black/50% | ✅ Same |
| Active color | Red #DC2626 | Red #DC2626 | ✅ Same |
| Expandable groups | Yes | Yes | ✅ Same |
| Chevron icons | Yes | Yes | ✅ Same |
| Child items | Indented | Indented | ✅ Same |
| Footer CTA | No | Yes | ⭐ Enhanced |
| Logo header | Yes | Yes | ✅ Same |
| Close button | X icon | X icon | ✅ Same |

## User Journey

### From any page:
```
User browsing page
  ↓
Tap hamburger (☰)
  ↓
Sidebar opens from left
  ↓
Option 1: Tap single link (Trang chủ, Dự án, Liên hệ)
  → Navigate to page
  → Sidebar closes
  
Option 2: Tap expandable group (Combos, Sản phẩm)
  → Group expands
  → Child items shown
  → Tap child link
  → Navigate to page
  → Sidebar closes
  
Option 3: Tap footer CTA button
  → Call hotline
  → Sidebar stays open
  
Option 4: Tap backdrop or X button
  → Sidebar closes
  → Stay on current page
```

## File Changes

| File | Action | Lines | Purpose |
|------|--------|-------|---------|
| `src/components/header.tsx` | UPDATE | +14/-1 | Add hamburger + sidebar |
| `src/components/sidebar.tsx` | CREATE | +213 | New sidebar component |
| **Total** | | **+227/-1** | |

## Benefits

✅ **Consistent Navigation**: Same sidebar pattern as website  
✅ **Space-efficient**: Hidden by default, slides in on demand  
✅ **Hierarchical Menu**: Groups with expandable children  
✅ **Active State**: Visual feedback on current page  
✅ **Quick Access**: All pages reachable from sidebar  
✅ **Mobile-optimized**: 85vw max width, touch-friendly  
✅ **Professional**: Matches EPCVINA Solar branding  
✅ **CTA Included**: Footer with tư vấn button  

## Testing Checklist

- [ ] Hamburger button visible on non-home pages
- [ ] Tap hamburger → sidebar opens
- [ ] Backdrop overlay appears
- [ ] Tap backdrop → sidebar closes
- [ ] Tap X button → sidebar closes
- [ ] Menu items render correctly
- [ ] Tap expandable group → expands
- [ ] Child items display correctly
- [ ] Tap child item → navigates + closes
- [ ] Active state highlights current page
- [ ] Chevron icons rotate correctly
- [ ] Footer CTA button works (calls)
- [ ] Sidebar responsive (mobile viewport)
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Smooth transitions (300ms)

## Next Steps

- [ ] Test on real Zalo Mini App device
- [ ] Add haptic feedback on menu open/close
- [ ] Add search box in sidebar header (optional)
- [ ] Add user profile section (optional)
- [ ] Track menu usage analytics
- [ ] Consider adding dark mode support
- [ ] Add keyboard shortcuts (desktop testing)

## Notes

### Icons Used:
- **Hamburger**: Custom SVG (3 horizontal lines)
- **Menu icons**: Lucide React (Home, Layers, Package, FolderOpen, Phone)
- **Chevron icons**: Lucide React (ChevronDown, ChevronRight)
- **Close icon**: Lucide React (X)

### Color Palette:
- **Primary red**: `#DC2626` (EPCVINA brand)
- **Red 50**: `#FEF2F2` (active background)
- **Red 100**: `#FEE2E2` (child active background)
- **Red 600**: `#DC2626` (active text/icons)
- **Red 700**: `#B91C1C` (child active text)
- **Gray 50-900**: Various UI elements

### Responsive Behavior:
- **Width**: 320px fixed, but max 85vw
- **On small screens** (<375px): Sidebar takes 85% width
- **On larger screens**: 320px constant
- **Height**: Always 100vh (full viewport)

### State Management:
- **sidebarOpen**: Local state in Header component
- **expandedItems**: Local state in Sidebar component
- **No global state needed**: Menu state is ephemeral

## Related Files

- Header: `epcvinaminiapp/src/components/header.tsx`
- Sidebar: `epcvinaminiapp/src/components/sidebar.tsx`
- Website Header: `epcvinasolar/src/components/home/layout/HeaderBar.tsx`
- Website Sidebar: `epcvinasolar/src/components/layout/Sidebar.tsx`

## Summary

Zalo Mini App giờ có hamburger menu và sidebar navigation chuyên nghiệp, đồng bộ với EPCVINA Solar website! Sidebar có expandable groups, active state tracking, và CTA footer cho tư vấn nhanh! 🎉
