export default function Stats() {
  const stats = [
    { value: "200+", label: "Dự án" },
    { value: "100+", label: "MWp" },
    { value: "10+", label: "Năm KN" },
    { value: "25", label: "Năm BH" },
  ];

  return (
    <div className="bg-white p-4 mx-4 mt-4 rounded-xl shadow-sm">
      <div className="grid grid-cols-4 gap-3">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-xl font-bold text-red-600">{stat.value}</div>
            <div className="text-xs text-gray-600 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
