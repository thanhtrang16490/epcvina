const partners = [
  { name: 'JA Solar', logo: null },
  { name: 'Solis', logo: null },
  { name: 'Dyness', logo: null },
  { name: 'Growatt', logo: null },
  { name: 'Canadian Solar', logo: null },
  { name: 'Goodwe', logo: null },
];

export default function PartnersSection() {
  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Đối tác thiết bị uy tín
          </h2>
          <p className="text-gray-500 mt-2">
            Phân phối chính hãng từ các thương hiệu hàng đầu thế giới
          </p>
        </div>

        {/* Brand logos / names */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="border border-gray-200 rounded-lg px-6 py-3 bg-gray-50 text-gray-600 font-semibold text-sm sm:text-base hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200 cursor-pointer motion-reduce:transition-none motion-reduce:transform-none"
            >
              {partner.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
