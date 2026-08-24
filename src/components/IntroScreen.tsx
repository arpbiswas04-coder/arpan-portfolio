import React from 'react';
import { motion } from 'framer-motion';
import { MorphingText } from '@/components/ui/liquid-text';

interface IntroScreenProps {
  onComplete: () => void;
}

const INTRO_WORDS = ["Hello", "नमस्ते", "নমস্কার"];

export const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete }) => {
  const handleSettled = () => {
    // Hold final word for 700ms after morph settles, then trigger exit fade-out
    setTimeout(() => {
      onComplete();
    }, 700);
  };

  return (
    <motion.div
      initial={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(12px)' }}
      transition={{ duration: 1.1, ease: 'easeInOut' }}
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
          loop={false}
          onSettled={handleSettled}
          className="text-[#CCFF00] [text-shadow:0_0_40px_rgba(204,255,0,0.5)] font-display uppercase tracking-wider text-[28px] sm:text-[44px] md:text-[64px] lg:text-[6rem]"
        />
      </div>
    </motion.div>
  );
};

export default IntroScreen;
