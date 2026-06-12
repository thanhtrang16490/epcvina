

export default function ZaloChatButton() {
  const zaloPhone = '0988446113';
  const zaloUrl = `https://zalo.me/${zaloPhone}`;

  return (
    <div className="zalo-container right">
      <a id="zalo-btn" href={zaloUrl} target="_blank" rel="noopener nofollow">
        <div className="animated_zalo infinite zoomIn_zalo cmoz-alo-circle"></div>
        <div className="animated_zalo infinite pulse_zalo cmoz-alo-circle-fill"></div>
        <span>
          <img 
            src="/icons8-zalo.svg" 
            alt="Contact Me on Zalo" 
            width={52}
            height={52}
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
            width: 56px;
            height: 56px;
            bottom: 100px;
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
            width: 56px;
            height: 56px;
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
            width: 68px;
            height: 68px;
            top: -6px;
            right: -6px;
            position: absolute;
            background-color: transparent;
            -webkit-border-radius: 100%;
            -moz-border-radius: 100%;
            border-radius: 100%;
            border: 2px solid rgba(17, 130, 252, .8);
            border-color: #1182FC;
            opacity: .5;
          }
          .cmoz-alo-circle-fill {
            width: 80px;
            height: 80px;
            top: -12px;
            position: absolute;
            -webkit-transition: all 0.2s ease-in-out;
            -moz-transition: all 0.2s ease-in-out;
            -ms-transition: all 0.2s ease-in-out;
            -o-transition: all 0.2s ease-in-out;
            transition: all 0.2s ease-in-out;
            -webkit-border-radius: 100%;
            -moz-border-radius: 100%;
            border-radius: 100%;
            border: 2px solid transparent;
            -webkit-transition: all .5s;
            -moz-transition: all .5s;
            -o-transition: all .5s;
            transition: all .5s;
            background-color: rgba(17, 130, 252, .45);
            opacity: .75;
            right: -12px;
          }
          .pulse_zalo {
            -webkit-animation-name: pulse_zalo;
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
          @-webkit-keyframes pulse_zalo {
            from {
              -webkit-transform: scale3d(1, 1, 1);
              transform: scale3d(1, 1, 1);
            }
            50% {
              -webkit-transform: scale3d(1.05, 1.05, 1.05);
              transform: scale3d(1.05, 1.05, 1.05);
            }
            to {
              -webkit-transform: scale3d(1, 1, 1);
              transform: scale3d(1, 1, 1);
            }
          }
          @keyframes pulse_zalo {
            from {
              -webkit-transform: scale3d(1, 1, 1);
              transform: scale3d(1, 1, 1);
            }
            50% {
              -webkit-transform: scale3d(1.05, 1.05, 1.05);
              transform: scale3d(1.05, 1.05, 1.05);
            }
            to {
              -webkit-transform: scale3d(1, 1, 1);
              transform: scale3d(1, 1, 1);
            }
          }
        `
      }} />
    </div>
  );
}
