import { useState, useEffect } from 'react';

/**
 * ZaloChatButton - Floating Zalo contact button
 * 
 * Pattern from g-3 ZaloBox:
 * - Fixed position, bottom-right
 * - Blue pulse animation ring
 * - Hidden on mobile until scroll (300px), always visible on desktop
 * - Opens Zalo chat on click
 */
export default function ZaloChatButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (!isMobile) { setVisible(true); return; }

    const handleScroll = () => setVisible(window.scrollY > 300);
    handleScroll(); // check initial position
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const zaloPhone = '0988446113';
  const zaloUrl = `https://zalo.me/${zaloPhone}`;

  return (
    <div
      className="zalo-container right"
      style={{ opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none', transition: 'opacity 0.3s ease' }}
    >
      <a id="zalo-btn" href={zaloUrl} target="_blank" rel="noopener nofollow">
        <div className="animated_zalo infinite zoomIn_zalo cmoz-alo-circle"></div>
        <div className="animated_zalo infinite pulse_zalo cmoz-alo-circle-fill"></div>
        <span>
          <img 
            src="/icons8-zalo.svg" 
            alt="Contact Me on Zalo" 
            width={40}
            height={40}
            className="zalo-icon"
          />
        </span>
      </a>

      <style dangerouslySetInnerHTML={{
        __html: `
          .zalo-container img {
            max-width: 100%;
            height: auto;
          }
          .zalo-container {
            position: fixed;
            width: 40px;
            height: 40px;
            bottom: 170px;
            z-index: 9999999;
          }
          .zalo-container.right {
            right: 35px;
          }
          .zalo-container a {
            display: block;
          }
          .zalo-container span {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #1182FC;
            position: relative;
          }
          .zalo-icon {
            object-fit: contain;
          }
          .zoomIn_zalo {
            animation-name: zoomIn_zalo;
          }
          .animated_zalo {
            animation-duration: 1s;
            animation-fill-mode: both;
          }
          .animated_zalo.infinite {
            animation-iteration-count: infinite;
          }
          .cmoz-alo-circle {
            width: 50px;
            height: 50px;
            top: -5px;
            right: -5px;
            position: absolute;
            background-color: transparent;
            border-radius: 100%;
            border: 2px solid rgba(17, 130, 252, .8);
            border-color: #1182FC;
            opacity: .5;
          }
          .cmoz-alo-circle-fill {
            width: 60px;
            height: 60px;
            top: -10px;
            right: -10px;
            position: absolute;
            transition: all 0.5s;
            border-radius: 100%;
            border: 2px solid transparent;
            background-color: rgba(17, 130, 252, .45);
            opacity: .75;
          }
          .pulse_zalo {
            animation-name: pulse_zalo;
          }
          .right {
            right: 0;
          }
          a:where(:not(.wp-element-button)) {
            text-decoration: none;
          }

          @keyframes zoomIn_zalo {
            from {
              opacity: 0;
              transform: scale3d(.3, .3, .3);
            }
            50% {
              opacity: 1;
            }
          }
          @keyframes pulse_zalo {
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
            .zalo-container {
              bottom: 60px;
            }
          }
        `
      }} />
    </div>
  );
}
