import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Home,
  Layers,
  Package,
  FolderOpen,
  Phone,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import TransitionLink from "./transition-link";

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

const menuItems: MenuItem[] = [
  { name: "Trang chủ", href: "/", icon: Home },
  {
    name: "Combos",
    icon: Layers,
    children: [
      { name: "Tất cả combos", href: "/combos" },
      { name: "On-Grid", href: "/combos?filter=on-grid" },
      { name: "Hybrid", href: "/combos?filter=hybrid" },
    ],
  },
  {
    name: "Sản phẩm",
    icon: Package,
    children: [
      { name: "Tấm pin năng lượng", href: "/categories/panel" },
      { name: "Biến tần On-Grid", href: "/categories/on-grid-inverter" },
      { name: "Biến tần Hybrid", href: "/categories/hybrid-inverter" },
      { name: "Pin lưu trữ", href: "/categories/battery" },
      { name: "Phụ kiện", href: "/categories/accessories" },
    ],
  },
  { name: "Đơn hàng", href: "/orders", icon: FolderOpen },
  { name: "Liên hệ", href: "/contact", icon: Phone },
];

function MenuGroup({
  item,
  isExpanded,
  onToggle,
  isActive,
  onClose,
}: {
  item: MenuItem;
  isExpanded: boolean;
  onToggle: () => void;
  isActive: (href: string) => boolean;
  onClose: () => void;
}) {
  const hasChildren = item.children && item.children.length > 0;
  const Icon = item.icon;

  if (!hasChildren && item.href) {
    const active = isActive(item.href);
    return (
      <TransitionLink
        to={item.href}
        onClick={onClose}
        className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors duration-150 ${
          active
            ? "bg-red-50 text-red-600"
            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
        }`}
      >
        <Icon className={`h-5 w-5 ${active ? "text-red-600" : "text-gray-400"}`} />
        {item.name}
      </TransitionLink>
    );
  }

  const hasActiveChild = item.children?.some((child) => isActive(child.href));

  return (
    <div>
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors duration-150 ${
          hasActiveChild
            ? "bg-red-50 text-red-600"
            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon className={`h-5 w-5 ${hasActiveChild ? "text-red-600" : "text-gray-400"}`} />
          {item.name}
        </div>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>
      {isExpanded && item.children && (
        <div className="ml-8 mt-1 space-y-1">
          {item.children.map((child) => {
            const active = isActive(child.href);
            return (
              <TransitionLink
                key={child.href}
                to={child.href}
                onClick={onClose}
                className={`block px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
                  active
                    ? "bg-red-100 text-red-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {child.name}
              </TransitionLink>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + "/");
  };

  const toggleExpand = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">EPC</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">EPCVINA Solar</h2>
              <p className="text-xs text-gray-500">Menu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="py-2 space-y-1">
          {menuItems.map((item) => (
            <MenuGroup
              key={item.name}
              item={item}
              isExpanded={expandedItems.includes(item.name)}
              onToggle={() => toggleExpand(item.name)}
              isActive={isActive}
              onClose={onClose}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 mt-4">
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4">
            <h3 className="text-sm font-bold text-gray-900 mb-2">💡 Tư vấn miễn phí</h3>
            <p className="text-xs text-gray-600 mb-3">
              Liên hệ ngay để được tư vấn giải pháp điện mặt trời
            </p>
            <a
              href="tel:0988446113"
              className="block w-full bg-red-600 text-white text-center py-2.5 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
            >
              Gọi 0988 446 113
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
