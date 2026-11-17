import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

export const BackgroundVideo: React.FC<{ paused?: boolean }> = ({ paused = false }) => {
  const video = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    if (!video.current) return;
    if (paused || reducedMotion) video.current.pause();
    else void video.current.play().catch(() => {});
  }, [paused, reducedMotion]);
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none bg-[#030014]">
      {!reducedMotion && <video ref={video} loop muted playsInline preload="metadata" className="w-full h-full object-cover brightness-90 contrast-105" src="/video.mp4" />}
      <div className="absolute inset-0 bg-[#030014]/50" />
    </div>
  );
};
