import type { MenuItemModule } from "@medusajs/dashboard";
import { Shapes } from "@phosphor-icons/react";

const menuItems: MenuItemModule["menuItems"] = [
  {
    label: "Thương hiệu",
    path: "/brands",
    icon: Shapes,
    rank: 35,
    translationNs: "nav",
    nested: "/products",
  },
];

export default {
  menuItems,
} satisfies MenuItemModule;
