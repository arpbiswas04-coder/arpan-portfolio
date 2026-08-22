import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ROTATING_WORDS = ["DATA", "INNOVATION", "IMPACT", "TEAMWORK"];
const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";

interface ScrambleTextProps {
  wordIndex: number;
}

const ScrambleText: React.FC<ScrambleTextProps> = ({ wordIndex }) => {
  const targetWord = ROTATING_WORDS[wordIndex % ROTATING_WORDS.length];
  const [displayedText, setDisplayedText] = useState(targetWord);

  useEffect(() => {
    let iteration = 0;
    const maxIterations = targetWord.length * 4;

    const interval = setInterval(() => {
      setDisplayedText(() => {
        return targetWord
          .split("")
          .map((char, index) => {
            if (index < iteration / 4) {
              return char;
            }
            return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
          })
          .join("");
      });

      iteration += 1;

      if (iteration > maxIterations) {
        clearInterval(interval);
        setDisplayedText(targetWord);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [targetWord]);

  return <span>{displayedText}</span>;
};

export const HeroContent: React.FC = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const [bioKey, setBioKey] = useState(0);

  const bioText = "I'm Arpan — a CS undergrad and team lead , building intelligent systems that turn complex problems into elegant, real-world solutions.";

  // Word cycling every 4 seconds
  useEffect(() => {
    const wordInterval = setInterval(() => {
      setWordIndex((prev) => prev + 1);
    }, 4000);

    return () => clearInterval(wordInterval);
  }, []);

  // Bio reset/loop every 7 seconds
  useEffect(() => {
    const bioInterval = setInterval(() => {
      setBioKey((prev) => prev + 1);
    }, 7000);

    return () => clearInterval(bioInterval);
  }, []);

  return (
    <div className="relative z-20 flex-1 flex flex-col justify-between px-6 sm:px-10 md:px-16 pt-24 sm:pt-28 md:pt-32 pb-24 pointer-events-none select-none max-w-7xl mx-auto w-full h-full">
      {/* Top Left: Headline Container */}
      <div className="flex flex-col items-start justify-start text-left space-y-0 leading-none max-w-3xl">
        {/* Top Line: BUILD WITH */}
        <h2 className="font-display tracking-wider text-stroke-white text-[28px] sm:text-[44px] md:text-[58px] lg:text-[72px] uppercase font-black transform scale-y-110 mb-1 sm:mb-2 text-left">
          BUILD WITH
        </h2>

        {/* Bottom Line: Rotates with Scramble Effect */}
        <div className="h-[60px] sm:h-[90px] md:h-[130px] lg:h-[160px] xl:h-[190px] flex items-center justify-start text-left">
          <h1 className="font-display text-[#CCFF00] text-[50px] sm:text-[85px] md:text-[120px] lg:text-[150px] xl:text-[175px] font-black uppercase tracking-tight leading-none drop-shadow-[0_0_40px_rgba(204,255,0,0.4)] text-left">
            <ScrambleText wordIndex={wordIndex} />
          </h1>
        </div>
      </div>

      {/* Bottom Right: Bio Container & Badge */}
      <div className="flex flex-col items-end text-right self-end mt-auto max-w-md sm:max-w-lg md:max-w-xl">
        {/* Typewriter Bio Container */}
        <div className="text-right">
          <p className="font-sans text-sm sm:text-base md:text-lg text-white/80 font-normal leading-relaxed tracking-wide min-h-[3.5rem] text-right">
            <AnimatePresence mode="wait">
              <motion.span key={bioKey} className="inline-block text-right">
                {bioText.split("").map((char, index) => (
                  <motion.span
                    key={`${bioKey}-${index}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.02,
                      duration: 0.05,
                      ease: "easeOut",
                    }}
                    className="inline-block"
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </motion.span>
            </AnimatePresence>
          </p>
        </div>

        {/* Meta indicator badge */}
        <div className="mt-6 flex items-center justify-end gap-3 font-mono text-[11px] uppercase tracking-widest text-white/50 text-right">
          <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-ping" />
          <span>AVAILABLE FOR AI/ML ENGINEERING & SYSTEM ARCHITECTURE</span>
        </div>
      </div>
    </div>
  );
};
