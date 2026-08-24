import ResponsiveComboImage from './ResponsiveComboImage';

export default function ConstructionMethodsSection({
  constructionSteps,
  constructionTab,
  setConstructionTab,
  constructionImages,
}: {
  constructionSteps: Array<{ title: string; desc: string }>;
  constructionTab: number;
  setConstructionTab: (index: number) => void;
  constructionImages: string[][];
}) {
  return (
    <section className="mt-8 rounded-[18px] border border-gray-200 bg-white p-6">
      <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-gray-500">Biện pháp thi công</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {constructionSteps.map((step, index) => (
          <button
            key={step.title}
            type="button"
            onClick={() => setConstructionTab(index)}
            className={`rounded-full border px-4 py-2 text-[14px] font-semibold transition ${
              constructionTab === index ? 'border-[#0B63CE] bg-[#0B63CE] text-white shadow-sm' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
            }`}
            aria-pressed={constructionTab === index}
          >
            {step.title}
          </button>
        ))}
      </div>
      <div className="mt-5 rounded-[18px] border border-gray-200 bg-[#fafafa] p-4 sm:p-5">
        <h4 className="text-[16px] font-semibold text-gray-900">{constructionSteps[constructionTab].title}</h4>
        <p className="mt-2 text-[13px] leading-6 text-gray-600">{constructionSteps[constructionTab].desc}</p>
        <div className="mt-4 overflow-x-auto pb-1">
          <div className="flex min-w-max flex-nowrap gap-3">
            {constructionImages[constructionTab].map((src, index) => (
              <div
                key={`${src}-${index}`}
                className="relative aspect-square w-[132px] shrink-0 overflow-hidden rounded-[16px] border border-gray-200 bg-white shadow-sm sm:w-[144px]"
              >
                <ResponsiveComboImage src={src} alt={`${constructionSteps[constructionTab].title} ${index + 1}`} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
