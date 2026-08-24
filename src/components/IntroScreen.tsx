import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { MorphingText } from '@/components/ui/liquid-text';

interface IntroScreenProps {
  onComplete: () => void;
}

const INTRO_WORDS = ["Hello", "Hola", "Bonjour", "नमस्ते", "নমস্কার"];

export const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    // 5 words, morphTime=s + cooldownTime=0.35s = 1.15s per cycle.
    // 4 transitions to reach word 5 (Bengali) = 4.6s + cooldown display window.
    // Trigger fade-out at ~4700ms before starting 5th transition back to English.
    const fadeTimer = setTimeout(() => {
      onComplete();
    }, 4700);

    return () => clearTimeout(fadeTimer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black pointer-events-auto select-none"
    >
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      >
        <source src="/video.mp4" type="video/mp4" />
      </video>

      {/* Dark semi-transparent overlay to make video faintly visible/moody */}
      <div className="absolute inset-0 bg-black/80 pointer-events-none" />

      {/* Centered Morphing Text */}
      <div className="relative z-10 w-full max-w-4xl px-4 flex items-center justify-center">
        <MorphingText
          texts={INTRO_WORDS}
          className="text-[#CCFF00] [text-shadow:0_0_40px_rgba(204,255,0,0.5)] font-display uppercase tracking-wider text-[28px] sm:text-[44px] md:text-[64px] lg:text-[6rem]"
        />
      </div>
    </motion.div>
  );
};

export default IntroScreen;
