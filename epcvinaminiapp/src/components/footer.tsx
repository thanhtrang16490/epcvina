import { HomeIcon, CategoryIcon, PackageIcon, ContactIcon, ComboIcon } from "./vectors";
import HorizontalDivider from "./horizontal-divider";
import TransitionLink from "./transition-link";
import { useRouteHandle } from "@/hooks";

const NAV_ITEMS = [
  {
    name: "Trang chủ",
    path: "/",
    icon: HomeIcon,
  },
  {
    name: "Combos",
    path: "/combos",
    icon: ComboIcon,
  },
  {
    name: "Sản phẩm",
    path: "/categories",
    icon: CategoryIcon,
  },
  {
    name: "Đơn hàng",
    path: "/orders",
    icon: PackageIcon,
  },
  {
    name: "Liên hệ",
    path: "/contact",
    icon: ContactIcon,
  },
];

export default function Footer() {
  const [handle] = useRouteHandle();

  if (!handle?.noFooter) {
    return (
      <>
        <HorizontalDivider />
        <div
          className="w-full px-4 pt-2 grid pb-sb"
          style={{
            gridTemplateColumns: `repeat(${NAV_ITEMS.length}, 1fr)`,
          }}
        >
          {NAV_ITEMS.map((item) => {
            return (
              <TransitionLink
                to={item.path}
                key={item.path}
                className="flex flex-col items-center space-y-0.5 p-1 pb-0.5 cursor-pointer active:scale-105"
              >
                {({ isActive }) => (
                  <>
                    <div className="w-6 h-6 flex justify-center items-center">
                      <item.icon active={isActive} />
                    </div>
                    <div
                      className={`text-2xs ${isActive ? "text-primary" : ""}`}
                    >
                      {item.name}
                    </div>
                  </>
                )}
              </TransitionLink>
            );
          })}
        </div>
      </>
    );
  }
}
