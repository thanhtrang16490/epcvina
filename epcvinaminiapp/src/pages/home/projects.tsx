import TransitionLink from "@/components/transition-link";

export default function Projects() {
  const projects = [
    {
      id: 1,
      name: "Nhà máy Samsung SEVT",
      location: "Thái Nguyên",
      capacity: "5 MWp",
      image: "https://via.placeholder.com/400x300/DC2626/FFFFFF?text=Samsung+SEVT",
    },
    {
      id: 2,
      name: "Khu đô thị Vinhomes",
      location: "Hà Nội",
      capacity: "3 MWp",
      image: "https://via.placeholder.com/400x300/B91C1C/FFFFFF?text=Vinhomes",
    },
    {
      id: 3,
      name: "Lotte Mart Dong Da",
      location: "Hà Nội",
      capacity: "2 MWp",
      image: "https://via.placeholder.com/400x300/991B1B/FFFFFF?text=Lotte+Mart",
    },
  ];

  return (
    <div className="bg-white p-4 mx-4 mt-4 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">Dự án tiêu biểu</h2>
        <TransitionLink
          to="/orders"
          className="text-sm text-red-600 font-medium"
        >
          Xem tất cả →
        </TransitionLink>
      </div>

      <div className="space-y-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex gap-3 p-3 border border-gray-100 rounded-lg hover:shadow-md transition-shadow"
          >
            <img
              src={project.image}
              alt={project.name}
              className="w-20 h-20 object-cover rounded-lg bg-gray-100"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 text-sm mb-1">
                {project.name}
              </h3>
              <p className="text-xs text-gray-600 mb-2">{project.location}</p>
              <div className="inline-block bg-red-50 text-red-600 text-xs px-2 py-1 rounded">
                {project.capacity}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
