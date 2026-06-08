

import { memo } from 'react';

function VideoPlayer() {
  return (
    <div className="flex-1 flex items-center justify-center relative min-h-0">
      {/* Video Container - Max width constraint to prevent overflow */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-auto h-auto max-w-full max-h-full object-contain"
          style={{ 
            maxWidth: 'min(100%, 900px)',
            maxHeight: '100%',
          }}
        >
          <source src="/home_image.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}

export default memo(VideoPlayer);
