import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ROTATING_WORDS = [
  "DATA",
  "INNOVATION",
  "IMPACT",
  "TEAMWORK",
  "LEADERSHIP",
  "COLLABORATION"
];

const CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";

interface ScrambleTextProps {
  wordIndex: number;
}

const ScrambleText: React.FC<ScrambleTextProps> = ({
  wordIndex,
}) => {
  const targetWord =
    ROTATING_WORDS[wordIndex % ROTATING_WORDS.length];

  const [displayedText, setDisplayedText] =
    useState(targetWord);

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

            return CHARACTERS[
              Math.floor(
                Math.random() * CHARACTERS.length
              )
            ];
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

  const bioText =
    "I'm Arpan — a CS undergrad and team lead, building intelligent systems that turn complex problems into elegant, real-world solutions.";

  // Rotate headline word every 4 seconds
  useEffect(() => {
    const wordInterval = setInterval(() => {
      setWordIndex((prev) => prev + 1);
    }, 4000);

    return () => clearInterval(wordInterval);
  }, []);

  // Restart bio animation every 7 seconds
  useEffect(() => {
    const bioInterval = setInterval(() => {
      setBioKey((prev) => prev + 1);
    }, 7000);

    return () => clearInterval(bioInterval);
  }, []);

  return (
    <div className="absolute inset-0 z-20 pointer-events-none select-none">

      {/* =====================================================
          BOTTOM LEFT
          BUILD WITH + ROTATING WORD
          ===================================================== */}

      <div
        className="
          absolute

          left-[20px]
          top-[50%]

          sm:left-[25px]
          md:left-[30px]
          lg:left-[35px]
          xl:left-[40px]

          flex
          flex-col
          items-start
          justify-start
          text-left

          leading-none
          max-w-3xl
        "
      >

        {/* BUILD WITH */}
        <h2
          className="
            font-display
            tracking-wider
            text-stroke-white
            uppercase
            font-black

            transform
            scale-y-110

            text-[32px]
            sm:text-[40px]
            md:text-[50px]
            lg:text-[58px]
            xl:text-[80px]

            text-left

            mb-0
          "
        >
          BUILD WITH
        </h2>


        {/* ROTATING WORD */}
        <div
          className="
            flex
            items-center
            justify-start
            text-left

            mt-[-8px]
            sm:mt-[-10px]
            md:mt-[-12px]
            lg:mt-[-14px]
            xl:mt-[-16px]

            h-auto
          "
        >
          <h1
            className="
              font-display
              text-[#CCFF00]
              uppercase
              font-black
              tracking-tight
              leading-none
              text-left

              text-[55px]
              sm:text-[72px]
              md:text-[90px]
              lg:text-[110px]
              xl:text-[160px]

              drop-shadow-[0_0_40px_rgba(204,255,0,0.4)]
            "
          >
            <ScrambleText wordIndex={wordIndex} />
          </h1>
        </div>

      </div>


      {/* =====================================================
          TOP RIGHT
          BIO + AVAILABILITY
          ===================================================== */}

      <div
        className="
          absolute

          top-[17%]

          right-[20px]
          sm:right-[30px]
          md:right-[40px]
          lg:right-[50px]
          xl:right-[60px]

          w-[42%]
          max-w-[500px]

          flex
          flex-col
          items-end

          text-right
          z-20
        "
      >

        {/* TYPEWRITER BIO */}
        <div className="w-full text-right">

          <p
            className="
              font-sans
              text-white/80
              font-normal
              leading-relaxed
              tracking-wide
              text-right

              text-[11px]
              sm:text-xs
              md:text-sm
              lg:text-base
              xl:text-lg

              min-h-[3.5rem]
            "
          >

            <AnimatePresence mode="wait">

              <motion.span
                key={bioKey}
                className="inline-block text-right"
              >

                {bioText.split("").map(
                  (char, index) => (
                    <motion.span
                      key={`${bioKey}-${index}`}
                      initial={{
                        opacity: 0,
                        y: 6,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: index * 0.02,
                        duration: 0.05,
                        ease: "easeOut",
                      }}
                      className="inline-block"
                    >
                      {char === " "
                        ? "\u00A0"
                        : char}
                    </motion.span>
                  )
                )}

              </motion.span>

            </AnimatePresence>

          </p>

        </div>


        {/* AVAILABILITY INDICATOR */}
        <div
          className="
            mt-3
            sm:mt-4
            md:mt-5

            flex
            items-center
            justify-end
            gap-2
            sm:gap-3

            font-mono
            uppercase
            tracking-widest
            text-white/50
            text-right

            text-[7px]
            sm:text-[8px]
            md:text-[9px]
            lg:text-[10px]
            xl:text-[11px]
          "
        >

          <span
            className="
              w-1.5
              h-1.5
              sm:w-2
              sm:h-2

              rounded-full
              bg-[#CCFF00]
              animate-ping
            "
          />

          <span>
            AVAILABLE FOR AI/ML ENGINEERING &amp;
            SYSTEM ARCHITECTURE
          </span>

        </div>

      </div>

    </div>
  );
};