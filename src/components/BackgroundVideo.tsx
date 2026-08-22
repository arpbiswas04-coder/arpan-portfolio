import React from 'react';

export const BackgroundVideo: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover filter brightness-90 contrast-105"
      >
        <source src="/video.mp4" type="video/mp4" />
      </video>

      {/* Dark semi-transparent overlay to maintain contrast & readability */}
      <div className="absolute inset-0 bg-[#030014]/50 backdrop-blur-[0px]" />
    </div>
  );
};

export default BackgroundVideo;
