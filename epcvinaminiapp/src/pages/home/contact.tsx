import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function Contact() {
  const contactItems = [
    {
      icon: Phone,
      label: "Hotline",
      value: "090 123 4567",
      href: "tel:0901234567",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: Mail,
      label: "Email",
      value: "info@epcvina.com",
      href: "mailto:info@epcvina.com",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: MapPin,
      label: "Địa chỉ",
      value: "Hà Nội, Việt Nam",
      href: "#",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      icon: Clock,
      label: "Giờ làm việc",
      value: "T2-T7: 8:00 - 17:30",
      href: "#",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="bg-white p-4 mx-4 mt-4 mb-4 rounded-xl shadow-sm">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Liên hệ</h2>
      <div className="space-y-3">
        {contactItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <a
              key={index}
              href={item.href}
              className={`flex items-center p-3 ${item.bgColor} rounded-lg active:opacity-80`}
            >
              <div className={`p-2 bg-white rounded-lg ${item.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-xs text-gray-600">{item.label}</p>
                <p className="font-medium text-gray-800 text-sm">
                  {item.value}
                </p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
