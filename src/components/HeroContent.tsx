import React, { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

const WORDS = ['TEAMWORK', 'INNOVATION', 'IMPACT', 'LEADERSHIP', 'COLLABORATION', 'ARPAN'];
const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const BIO = "I'm Arpan — a CS undergrad and team lead, building intelligent systems that turn complex problems into elegant, real-world solutions.";

export const HeroContent: React.FC<{ paused?: boolean }> = ({ paused = false }) => {
  const reducedMotion = useReducedMotion();
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState(WORDS[0]);
  useEffect(() => {
    if (paused || reducedMotion) return;
    const timer = window.setInterval(() => setWordIndex((index) => (index + 1) % WORDS.length), 4000);
    return () => clearInterval(timer);
  }, [paused, reducedMotion]);
  useEffect(() => {
    const word = WORDS[wordIndex];
    if (paused || reducedMotion) { setText(word); return; }
    let frame = 0;
    const timer = window.setInterval(() => {
      frame++;
      setText(word.split('').map((char, index) => index < frame / 2 ? char : CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]).join(''));
      if (frame >= word.length * 2) clearInterval(timer);
    }, 50);
    return () => clearInterval(timer);
  }, [wordIndex, paused, reducedMotion]);
  return (
    <div className="absolute inset-0 z-20 pointer-events-none select-none">
      <div className="hero-headline absolute z-30 flex flex-col items-start gap-1 sm:gap-2 leading-none">
        <h2 className="hero-kicker font-display font-black leading-none scale-y-110 uppercase tracking-wider text-stroke-white m-0">BUILD WITH</h2>
        <h1 className="hero-word font-display font-black uppercase tracking-tight leading-[0.82] drop-shadow-[0_0_40px_rgba(204,255,0,0.4)] text-[#CCFF00] m-0" aria-label={WORDS[wordIndex]}>
          <span aria-hidden="true">{text}</span>
        </h1>
      </div>
      <div className="hero-bio absolute z-20 font-poppins">
        <p className="text-white/80 leading-relaxed text-xs md:text-sm lg:text-base xl:text-lg bio-reveal">{BIO}</p>
        <div className="mt-3 flex items-center gap-2 md:justify-end text-[8px] md:text-[9px] lg:text-[10px] tracking-widest text-white/50 uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] shrink-0 animate-pulse" />
          <span>AVAILABLE FOR AI/ML ENGINEERING &amp; SYSTEM ARCHITECTURE</span>
        </div>
      </div>
    </div>
  );
};
