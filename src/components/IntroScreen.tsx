import React, { useCallback, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MorphingText } from '@/components/ui/liquid-text';

interface IntroScreenProps {
  onComplete: () => void;
}

const INTRO_WORDS = ["Hello", "नमस्ते", "নমস্কার"];

export const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete }) => {
  const reducedMotion = useReducedMotion();
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const handleSettled = useCallback(() => {
    timer.current = setTimeout(() => completeRef.current(), 700);
  }, []);
  useEffect(() => {
    if (reducedMotion) timer.current = setTimeout(() => completeRef.current(), 300);
    return () => clearTimeout(timer.current);
  }, [reducedMotion]);

  return (
    <motion.div
      initial={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.1, ease: 'easeInOut' }}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black pointer-events-auto select-none"
    >
      {/* Keep the intro video separate so the hero never shows through the greeting. */}
      {!reducedMotion && (
        <video autoPlay loop muted playsInline preload="metadata"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          src="/video.mp4" />
      )}
      {/* Dark semi-transparent overlay to make video faintly visible/moody */}
      <div className="absolute inset-0 bg-black/80 pointer-events-none" />

      {/* Centered Morphing Text */}
      <div className="relative z-10 w-full max-w-4xl px-4 flex items-center justify-center">
        {reducedMotion ? <span className="font-display text-[clamp(48px,14vw,80px)] md:text-4xl text-[#CCFF00]">Hello</span> : <MorphingText
          texts={INTRO_WORDS}
          loop={false}
          onSettled={handleSettled}
          className="text-[#CCFF00] [text-shadow:0_0_40px_rgba(204,255,0,0.5)] font-display uppercase tracking-wider text-[clamp(48px,14vw,80px)] h-24 md:text-[64px] lg:text-[6rem]"
        />}
      </div>
    </motion.div>
  );
};

export default IntroScreen;
