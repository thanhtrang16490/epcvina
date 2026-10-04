import { MapPin, Lightning, ArrowRight } from '@phosphor-icons/react';
import { getLocaleFromPathname, messages } from '../../../i18n/messages';
import { getLocalizedRoute } from '../../../i18n/routes';

const projectByLocale: Record<string, {
  slug: string;
  title: string;
  location: string;
  capacity: string;
  completion: string;
  system_type: string;
  image: string;
  tag: string;
  tagColor: string;
}[]> = {
  vi: [
    { slug: 'chi-ha-ha-dong-15kwp', title: 'Hệ Hybrid 15 kWp — Chị Hà Hà Đông', location: 'Hà Đông - Hà Nội', capacity: '15 kWp + 10 kWh BESS', completion: 'T7.2024', system_type: 'On Grid / Hybrid', image: '/du-an/solar-nha-dan/du-an-chi-ha-ha-dong.webp', tag: 'Hybrid', tagColor: 'bg-blue-600' },
    { slug: 'anh-thanh-hai-duong-15kwp', title: 'Hệ Hybrid 15 kWp 3 Pha — Anh Thắng Hải Dương', location: 'TP. Hải Dương - Hải Dương', capacity: '15 kWp + BatteryHigh', completion: 'T6.2024', system_type: 'Hybrid có lưu trữ', image: '/du-an/solar-nha-dan/du-an-anh-thang-hai-duong.webp', tag: 'Hybrid 3P', tagColor: 'bg-indigo-600' },
    { slug: 'chu-thanh-hai-duong-22kwp', title: 'Hệ Hybrid 22 kWp Công Suất Lớn — Chú Thanh Hải Dương', location: 'TP. Hải Dương - Hải Dương', capacity: '22 kWp + 20 kWh BESS', completion: 'T6.2024', system_type: 'Hybrid có lưu trữ', image: '/du-an/DU-AN-KHACH-SAN-IMPERIA-HAI-PHONG.jpg', tag: 'Hybrid', tagColor: 'bg-blue-600' },
    { slug: 'anh-trung-bac-tu-liem-15kwp', title: 'Hệ On-Grid 15 kWp — Anh Trung Bắc Từ Liêm', location: 'Bắc Từ Liêm - Hà Nội', capacity: '15 kWp On-Grid', completion: '2024', system_type: 'Hòa Lưới bám tải', image: '/du-an/solar-nha-dan/du-an-anh-tung-nam-tu-liem.webp', tag: 'On-Grid', tagColor: 'bg-[#DC2626]' },
  ],
  en: [
    { slug: 'chi-ha-ha-dong-15kwp', title: '15 kWp Hybrid System — Ms. Ha, Ha Dong', location: 'Ha Dong, Hanoi', capacity: '15 kWp + 10 kWh BESS', completion: 'Jul 2024', system_type: 'Grid-tied / Hybrid', image: '/du-an/solar-nha-dan/du-an-chi-ha-ha-dong.webp', tag: 'Hybrid', tagColor: 'bg-blue-600' },
    { slug: 'anh-thanh-hai-duong-15kwp', title: '15 kWp 3-Phase Hybrid — Mr. Thang, Hai Duong', location: 'Hai Duong City', capacity: '15 kWp + BatteryHigh', completion: 'Jun 2024', system_type: 'Hybrid with storage', image: '/du-an/solar-nha-dan/du-an-anh-thang-hai-duong.webp', tag: 'Hybrid 3P', tagColor: 'bg-indigo-600' },
    { slug: 'chu-thanh-hai-duong-22kwp', title: '22 kWp Large Hybrid — Mr. Thanh, Hai Duong', location: 'Hai Duong City', capacity: '22 kWp + 20 kWh BESS', completion: 'Jun 2024', system_type: 'Hybrid with storage', image: '/du-an/DU-AN-KHACH-SAN-IMPERIA-HAI-PHONG.jpg', tag: 'Hybrid', tagColor: 'bg-blue-600' },
    { slug: 'anh-trung-bac-tu-liem-15kwp', title: '15 kWp On-Grid — Mr. Trung, Bac Tu Liem', location: 'Bac Tu Liem, Hanoi', capacity: '15 kWp On-Grid', completion: '2024', system_type: 'Grid-tied system', image: '/du-an/solar-nha-dan/du-an-anh-tung-nam-tu-liem.webp', tag: 'On-Grid', tagColor: 'bg-[#DC2626]' },
  ],
  zh: [
    { slug: 'chi-ha-ha-dong-15kwp', title: '15 kWp 混合系统 — 河东 Ha 女士', location: '河东 - 河内', capacity: '15 kWp + 10 kWh BESS', completion: '2024年7月', system_type: '并网 / 混合', image: '/du-an/solar-nha-dan/du-an-chi-ha-ha-dong.webp', tag: '混合', tagColor: 'bg-blue-600' },
    { slug: 'anh-thanh-hai-duong-15kwp', title: '15 kWp 三相混合 — 海阳 Thang 先生', location: '海阳市', capacity: '15 kWp + BatteryHigh', completion: '2024年6月', system_type: '储能混合系统', image: '/du-an/solar-nha-dan/du-an-anh-thang-hai-duong.webp', tag: '三相混合', tagColor: 'bg-indigo-600' },
    { slug: 'chu-thanh-hai-duong-22kwp', title: '22 kWp 大型混合系统 — 海阳 Thanh 先生', location: '海阳市', capacity: '22 kWp + 20 kWh BESS', completion: '2024年6月', system_type: '储能混合系统', image: '/du-an/DU-AN-KHACH-SAN-IMPERIA-HAI-PHONG.jpg', tag: '混合', tagColor: 'bg-blue-600' },
    { slug: 'anh-trung-bac-tu-liem-15kwp', title: '15 kWp 并网系统 — 北慈廉 Trung 先生', location: '北慈廉 - 河内', capacity: '15 kWp 并网', completion: '2024', system_type: '并网系统', image: '/du-an/solar-nha-dan/du-an-anh-tung-nam-tu-liem.webp', tag: '并网', tagColor: 'bg-[#DC2626]' },
  ],
  ja: [
    { slug: 'chi-ha-ha-dong-15kwp', title: '15 kWp ハイブリッド — ハドン区 Ha様', location: 'ハドン区・ハノイ', capacity: '15 kWp + 10 kWh BESS', completion: '2024年7月', system_type: '連系 / ハイブリッド', image: '/du-an/solar-nha-dan/du-an-chi-ha-ha-dong.webp', tag: 'ハイブリッド', tagColor: 'bg-blue-600' },
    { slug: 'anh-thanh-hai-duong-15kwp', title: '15 kWp 3相ハイブリッド — ハイズオン Thang様', location: 'ハイズオン市', capacity: '15 kWp + BatteryHigh', completion: '2024年6月', system_type: '蓄電付きハイブリッド', image: '/du-an/solar-nha-dan/du-an-anh-thang-hai-duong.webp', tag: '3相ハイブリッド', tagColor: 'bg-indigo-600' },
    { slug: 'chu-thanh-hai-duong-22kwp', title: '22 kWp 大型ハイブリッド — ハイズオン Thanh様', location: 'ハイズオン市', capacity: '22 kWp + 20 kWh BESS', completion: '2024年6月', system_type: '蓄電付きハイブリッド', image: '/du-an/DU-AN-KHACH-SAN-IMPERIA-HAI-PHONG.jpg', tag: 'ハイブリッド', tagColor: 'bg-blue-600' },
    { slug: 'anh-trung-bac-tu-liem-15kwp', title: '15 kWp オングリッド — 北慈廉 Trung様', location: 'ハノイ・北慈廉', capacity: '15 kWp オングリッド', completion: '2024', system_type: '連系システム', image: '/du-an/solar-nha-dan/du-an-anh-tung-nam-tu-liem.webp', tag: 'オングリッド', tagColor: 'bg-[#DC2626]' },
  ],
  ko: [
    { slug: 'chi-ha-ha-dong-15kwp', title: '15 kWp 하이브리드 — 하동 Ha님', location: '하동 - 하노이', capacity: '15 kWp + 10 kWh BESS', completion: '2024년 7월', system_type: '계통연계 / 하이브리드', image: '/du-an/solar-nha-dan/du-an-chi-ha-ha-dong.webp', tag: '하이브리드', tagColor: 'bg-blue-600' },
    { slug: 'anh-thanh-hai-duong-15kwp', title: '15 kWp 3상 하이브리드 — 하이즈엉 Thang님', location: '하이즈엉시', capacity: '15 kWp + BatteryHigh', completion: '2024년 6월', system_type: '저장장치 포함 하이브리드', image: '/du-an/solar-nha-dan/du-an-anh-thang-hai-duong.webp', tag: '3상 하이브리드', tagColor: 'bg-indigo-600' },
    { slug: 'chu-thanh-hai-duong-22kwp', title: '22 kWp 대형 하이브리드 — 하이즈엉 Thanh님', location: '하이즈엉시', capacity: '22 kWp + 20 kWh BESS', completion: '2024년 6월', system_type: '저장장치 포함 하이브리드', image: '/du-an/DU-AN-KHACH-SAN-IMPERIA-HAI-PHONG.jpg', tag: '하이브리드', tagColor: 'bg-blue-600' },
    { slug: 'anh-trung-bac-tu-liem-15kwp', title: '15 kWp 온그리드 — 북뜨리엠 Trung님', location: '하노이 - 북뜨리엠', capacity: '15 kWp 온그리드', completion: '2024', system_type: '계통연계 시스템', image: '/du-an/solar-nha-dan/du-an-anh-tung-nam-tu-liem.webp', tag: '온그리드', tagColor: 'bg-[#DC2626]' },
  ],
};

export default function ProjectsPreviewSection({ pathname = '/' }: { pathname?: string }) {
  const locale = getLocaleFromPathname(pathname);
  const t = messages[locale]?.home ?? messages.vi.home;
  const projects = projectByLocale[locale] ?? projectByLocale.vi;
  const projectsHref = getLocalizedRoute(locale, 'projects');
  return (
    <section className="py-14 sm:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10"
        >
          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#DC2626] mb-2 font-display">
              {locale === 'vi' ? 'CÔNG TRÌNH ĐÃ TRIỂN KHAI' : locale === 'en' ? 'DEPLOYED PROJECTS' : locale === 'zh' ? '已完成项目' : locale === 'ja' ? '導入実績' : '시공 실적'}
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight tracking-tight font-display">
              {locale === 'vi' ? 'Dự Án ' : locale === 'en' ? 'Real ' : locale === 'zh' ? '真实' : locale === 'ja' ? '実績' : '실제 '}
              <span className="text-[#DC2626]">{locale === 'vi' ? 'Thực Tế' : locale === 'en' ? 'Projects' : locale === 'zh' ? '项目' : locale === 'ja' ? 'プロジェクト' : '프로젝트'}</span>
            </h2>
            <p className="mt-2 text-gray-500 text-sm max-w-lg">
              {locale === 'vi'
                ? '200+ công trình đã hoàn thành trên toàn quốc — từ nhà dân, biệt thự đến nhà xưởng và văn phòng.'
                : locale === 'en'
                  ? '200+ completed projects nationwide, from homes and villas to factories and offices.'
                  : locale === 'zh'
                    ? '全国已完成 200+ 项目，涵盖住宅、别墅、工厂与办公楼。'
                    : locale === 'ja'
                      ? '全国で200件以上の実績。住宅、別荘、工場、オフィスまで対応。'
                      : '전국 200건 이상의 완료 사례, 주택·빌라·공장·오피스까지.'}
            </p>
          </div>
          <a
            href={projectsHref}
            className="inline-flex items-center gap-2 text-[#DC2626] hover:text-[#B01A22] font-semibold text-sm transition-colors flex-shrink-0 active:scale-[0.98]"
          >
            {locale === 'vi' ? 'Xem tất cả dự án' : locale === 'en' ? 'View all projects' : locale === 'zh' ? '查看全部项目' : locale === 'ja' ? 'すべての案件を見る' : '전체 프로젝트 보기'}
            <ArrowRight className="h-4 w-4" weight="bold" />
          </a>
        </div>

        {/* Project grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {projects.map((p, i) => (
            <div
              key={p.slug}
              className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Project Image */}
              <a href={projectsHref} className="block relative aspect-square w-full overflow-hidden">
                <img
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  width="640"
                  height="640"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* Type badge */}
                <div className="absolute top-3 left-3">
                  <span className={`${p.tagColor} text-white text-[11px] font-bold px-2.5 py-1 rounded-full`}>
                    {p.tag}
                  </span>
                </div>

                {/* Completion date badge */}
                <div className="absolute top-3 right-3">
                  <span className="bg-black/40 text-white text-[11px] px-2 py-0.5 rounded-full backdrop-blur-sm">
                    {p.completion}
                  </span>
                </div>

                {/* Capacity overlay at bottom of image */}
                <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 pt-8 bg-gradient-to-t from-black/70 to-transparent">
                  <div className="flex items-center gap-1.5">
                    <Lightning className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" weight="fill" />
                    <span className="text-white text-xs font-semibold">{p.capacity}</span>
                  </div>
                </div>
              </a>

              {/* Info card below image */}
              <a href={projectsHref} className="block bg-white px-4 py-3 border border-gray-100 rounded-b-2xl -mt-0 hover:bg-gray-50 transition-colors">
                <h3 className="font-bold text-gray-900 text-sm leading-snug mb-1 line-clamp-2 group-hover:text-[#DC2626] transition-colors">{p.title}</h3>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" weight="fill" />
                  <span className="text-xs text-gray-500">{p.location}</span>
                </div>
              </a>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div
          className="mt-10 text-center"
        >
          <a
            href={projectsHref}
            className="inline-flex items-center gap-2 px-7 py-3 border-2 border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626] hover:text-white font-semibold rounded-full text-sm active:scale-[0.98] transition-all duration-200"
          >
            {locale === 'vi' ? 'Xem toàn bộ dự án đã thi công' : locale === 'en' ? 'See the full project portfolio' : locale === 'zh' ? '查看完整项目组合' : locale === 'ja' ? '実績一覧を見る' : '전체 시공 포트폴리오 보기'}
            <ArrowRight className="h-4 w-4" weight="bold" />
          </a>
        </div>
      </div>
    </section>
  );
}
