import { useState, useEffect } from 'react';
import { Phone } from '@phosphor-icons/react';

/**
 * CallBoxButton - Floating phone call button
 * 
 * Pattern from g-3 CallBox:
 * - Fixed position, bottom-right
 * - Red pulse animation ring
 * - Hidden on mobile until scroll (300px), always visible on desktop
 * - Opens phone dialer on click
 */
interface CallBoxButtonProps {
  stackAboveBackToTop?: boolean;
}

export default function CallBoxButton({ stackAboveBackToTop = false }: CallBoxButtonProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (!isMobile) { setVisible(true); return; }
    if (stackAboveBackToTop) {
      setVisible(true);
      return;
    }

    const handleScroll = () => {
      const scrollBottom = document.documentElement.scrollHeight - window.innerHeight - window.scrollY;
      setVisible(window.scrollY > 300 && scrollBottom >= 200);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [stackAboveBackToTop]);

  const phoneNumber = '0988446113';

  return (
    <div
      className={`call-container right ${stackAboveBackToTop ? 'is-stacked' : ''}`}
      style={{ opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none', transition: 'opacity 0.3s ease, transform 0.28s ease' }}
    >
      <a id="call-btn" href={`tel:${phoneNumber}`} rel="noopener nofollow" aria-label="Gọi hotline EPCVINA">
        <div className="animated_call infinite zoomIn_call cmoz-alo-circle"></div>
        <div className="animated_call infinite pulse_call cmoz-alo-circle-fill"></div>
        <span className="flex items-center justify-center">
          <Phone weight="fill" className="size-4 text-white" />
        </span>
      </a>

      <style dangerouslySetInnerHTML={{
        __html: `
          .call-container {
            position: fixed;
            width: 40px;
            height: 40px;
            bottom: 240px;
            z-index: 9999999;
          }
          .call-container.right {
            right: 35px;
          }
          .call-container a {
            display: block;
          }
          .call-container span {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(180deg, #ef4444 0%, #dc2626 100%);
            position: relative;
            box-shadow: 0 18px 30px -16px rgba(220, 38, 38, 0.85);
          }
          .zoomIn_call {
            animation-name: zoomIn_call;
          }
          .animated_call {
            animation-duration: 1s;
            animation-fill-mode: both;
          }
          .animated_call.infinite {
            animation-iteration-count: infinite;
          }
          .call-container .cmoz-alo-circle {
            width: 50px;
            height: 50px;
            top: -5px;
            right: -5px;
            position: absolute;
            background-color: transparent;
            border-radius: 100%;
            border: 2px solid rgba(220, 38, 38, .75);
            border-color: #dc2626;
            opacity: .55;
          }
          .call-container .cmoz-alo-circle-fill {
            width: 60px;
            height: 60px;
            top: -10px;
            right: -10px;
            position: absolute;
            transition: all 0.5s;
            border-radius: 100%;
            border: 2px solid transparent;
            background-color: rgba(220, 38, 38, .38);
            opacity: .8;
          }
          .pulse_call {
            animation-name: pulse_call;
          }
          .right {
            right: 0;
          }
          a:where(:not(.wp-element-button)) {
            text-decoration: none;
          }

          @keyframes zoomIn_call {
            from {
              opacity: 0;
              transform: scale3d(.3, .3, .3);
            }
            50% {
              opacity: 1;
            }
          }
          @keyframes pulse_call {
            from {
              transform: scale3d(1, 1, 1);
            }
            50% {
              transform: scale3d(1.05, 1.05, 1.05);
            }
            to {
              transform: scale3d(1, 1, 1);
            }
          }

          @media (max-width: 768px) {
            .call-container {
              bottom: 32px;
              right: 16px;
              transition: transform 0.28s ease, opacity 0.3s ease;
            }
            .call-container.is-stacked {
              transform: translateY(-60px);
            }
          }
        `
      }} />
    </div>
  );
}
