export default function ProjectsSection({
  projectsExpanded,
  setProjectsExpanded,
}: {
  projectsExpanded: boolean;
  setProjectsExpanded: (value: boolean) => void;
}) {
  return (
    <section className="rounded-[18px] border border-gray-200 bg-white p-6">
      <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-gray-500">Các dự án đã triển khai</p>
      <h2 className="mt-2 text-[28px] font-semibold text-gray-900">Công trình thực tế EPCVINA đã bàn giao</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { image: '/du-an/solar-nha-dan/du-an-chi-ha-ha-dong.png', title: 'Dự án 15 kWp - Hà Đông', meta: 'Điện mặt trời nhà dân' },
          { image: '/du-an/solar-nha-dan/du-an-anh-linh-duong-noi.png', title: 'Dự án 7.5 kWp - Dương Nội', meta: 'Hybrid nhà phố' },
          { image: '/du-an/DU-AN-KHACH-SAN-IMPERIA-HAI_PHONG.jpg', title: 'Dự án thương mại - Hải Phòng', meta: 'Công trình quy mô lớn' },
          { image: '/du-an/DU-AN-VINHOMES-GOLDEN-RIVER-BA-SON-1.jpg', title: 'Dự án 5.4 kWp - Bason', meta: 'Nhà ở đô thị' },
          { image: '/du-an/DU-AN-METROPOLIS-LIEU-GIAI.jpg', title: 'Dự án 5 kWp - Lieu Giai', meta: 'Nhà phố cao cấp' },
          { image: '/du-an/DU-AN-STARCITY-CENTRER-TRAN-DUY-HUNG.jpg', title: 'Dự án 6.5 kWp - Trần Duy Hưng', meta: 'Căn hộ / thương mại' },
        ]
          .slice(0, projectsExpanded ? 6 : 3)
          .map((project) => (
            <a key={project.title} href="/du-an" className="group overflow-hidden rounded-[18px] border border-gray-200 bg-[#fafafa] transition-all duration-300 hover:-translate-y-1 hover:border-[#0B63CE] hover:shadow-xl">
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <img src={project.image} alt={project.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />
              </div>
              <div className="p-4">
                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#f60]">{project.meta}</p>
                <h3 className="mt-2 text-[16px] font-semibold leading-snug text-gray-900">{project.title}</h3>
                <p className="mt-2 text-[13px] leading-6 text-gray-600">Xem thêm hình ảnh thực tế và cách EPCVINA triển khai công trình này.</p>
              </div>
            </a>
          ))}
      </div>
      <div className="mt-6 flex justify-center">
        {!projectsExpanded ? (
          <button
            type="button"
            onClick={() => setProjectsExpanded(true)}
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#0B63CE] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#094ea2]"
          >
            Xem thêm
          </button>
        ) : (
          <a href="/du-an" className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#0B63CE] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#094ea2]">
            Xem tất cả
          </a>
        )}
      </div>
    </section>
  );
}
