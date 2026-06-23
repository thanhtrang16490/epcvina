import { Sun, Battery, Zap, Home } from "lucide-react";
import TransitionLink from "@/components/transition-link";

export default function Services() {
  const services = [
    {
      icon: Sun,
      name: "On-Grid",
      desc: "Hòa lưới điện",
      color: "bg-yellow-500",
      path: "/combos",
    },
    {
      icon: Battery,
      name: "Hybrid",
      desc: "Lưu trữ pin",
      color: "bg-green-500",
      path: "/combos",
    },
    {
      icon: Zap,
      name: "BESS",
      desc: "Pin quy mô lớn",
      color: "bg-blue-500",
      path: "/combos",
    },
    {
      icon: Home,
      name: "EV Charger",
      desc: "Sạc xe điện",
      color: "bg-purple-500",
      path: "/combos",
    },
  ];

  return (
    <div className="bg-white p-4 mx-4 mt-4 rounded-xl shadow-sm">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Dịch vụ</h2>
      <div className="grid grid-cols-2 gap-3">
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <TransitionLink
              key={index}
              to={service.path}
              className="p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow active:scale-95"
            >
              <div
                className={`w-12 h-12 ${service.color} rounded-lg flex items-center justify-center mb-3`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm">
                {service.name}
              </h3>
              <p className="text-xs text-gray-600 mt-1">{service.desc}</p>
            </TransitionLink>
          );
        })}
      </div>
    </div>
  );
}
