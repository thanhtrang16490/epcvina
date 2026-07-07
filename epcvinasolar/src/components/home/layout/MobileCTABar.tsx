import { Phone, ChatCircle, PaperPlaneRight } from '@phosphor-icons/react';

export default function MobileCTABar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] safe-area-bottom">
      <div className="flex items-center gap-1.5 px-3 py-2">
        {/* Phone */}
        <a
          href="tel:0988446113"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-xs active:scale-[0.97] transition-transform"
        >
          <Phone className="w-4 h-4" weight="fill" />
          <span>Gọi</span>
        </a>

        {/* Zalo */}
        <a
          href="https://zalo.me/0988446113"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-500 text-white font-semibold text-xs active:scale-[0.97] transition-transform"
        >
          <ChatCircle className="w-4 h-4" weight="fill" />
          <span>Zalo</span>
        </a>

        {/* Form CTA */}
        <a
          href="#tu-van"
          className="flex-[1.4] flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-xs active:scale-[0.97] transition-transform shadow-md"
        >
          <PaperPlaneRight className="w-4 h-4" weight="bold" />
          <span>Tư vấn miễn phí</span>
        </a>
      </div>

      <style>{`
        .safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }
      `}</style>
    </div>
  );
}
