import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ROTATING_WORDS = [
  "TEAMWORK",
  "INNOVATION",
  "IMPACT",
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

  // =====================================================
  // ROTATE HEADLINE WORD
  // =====================================================

  useEffect(() => {
    const wordInterval = setInterval(() => {
      setWordIndex((prev) => prev + 1);
    }, 4000);

    return () => clearInterval(wordInterval);
  }, []);

  // =====================================================
  // RESTART BIO ANIMATION
  // =====================================================

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

      {/* =====================================================
          HEADLINE: BUILD WITH + ROTATING WORD
          ===================================================== */}

      <div
        className="
          absolute

          left-[20px]
          sm:left-[25px]
          md:left-[30px]
          lg:left-[35px]
          xl:left-[40px]

          bottom-[8%]
          top-auto
          translate-y-0
          md:bottom-auto
          md:top-[72%]
          md:-translate-y-1/2

          flex
          flex-col
          items-start
          justify-start
          gap-1
          sm:gap-2

          text-left
          leading-none
          z-30
        "
      >
        {/* BUILD WITH */}
        <h2
          className="
            font-display
            uppercase
            font-black
            tracking-wider
            text-stroke-white

            leading-none
            scale-y-110

            text-[40px]
            sm:text-[44px]
            md:text-[44px]
            lg:text-[54px]
            xl:text-[72px]

            whitespace-nowrap

            m-0
            p-0
          "
        >
          BUILD WITH
        </h2>

        {/* ROTATING WORD */}
        <h1
          className="
            font-display
            uppercase
            font-black
            tracking-tight
            leading-[0.82]

            text-[#CCFF00]

            text-[clamp(52px,15vw,76px)]
            sm:text-[88px]
            md:text-[90px]
            lg:text-[116px]
            xl:text-[155px]

            whitespace-nowrap

            m-0
            p-0

            drop-shadow-[0_0_40px_rgba(204,255,0,0.4)]
          "
        >
          <ScrambleText wordIndex={wordIndex} />
        </h1>
      </div>


      {/* =====================================================
          MOBILE ONLY: AVAILABILITY BADGE & BIO PARAGRAPH
          ===================================================== */}

      <div className="block md:hidden">
        {/* Availability Badge at top left */}
        <div
          className="
            absolute
            top-[9%]
            left-[20px]
            sm:left-[25px]

            flex
            items-center
            gap-2

            font-mono
            uppercase
            tracking-widest
            text-white/50
            text-left

            text-[8px]
            sm:text-[9px]

            z-20
          "
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-ping shrink-0" />
          <span>
            AVAILABLE FOR AI/ML ENGINEERING &amp; SYSTEM ARCHITECTURE
          </span>
        </div>

        {/* Bio Paragraph to the left of the image */}
        <div
          className="
            absolute
            top-[22%]
            left-[20px]
            sm:left-[25px]

            w-[55%]
            sm:w-[50%]

            flex
            flex-col
            items-start

            text-left
            z-20
          "
        >
          <p
            className="
              font-sans
              text-white/80
              font-normal
              leading-relaxed
              tracking-wide
              text-left

              text-[11px]
              sm:text-xs

              min-h-[3.5rem]
              whitespace-normal
              break-normal
            "
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={bioKey}
                className="inline-block text-left"
              >
                {(() => {
                  let globalCharIndex = 0;
                  const words = bioText.split(" ");

                  return words.map((word, wordIndex) => {
                    const chars = word.split("");
                    const wordStartIndex = globalCharIndex;
                    globalCharIndex += chars.length + 1;

                    return (
                      <span
                        key={`word-m-${wordIndex}`}
                        className="inline-block whitespace-nowrap"
                      >
                        {chars.map((char, charIndex) => {
                          const charGlobalIndex = wordStartIndex + charIndex;
                          return (
                            <motion.span
                              key={`m-${bioKey}-${charGlobalIndex}`}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                delay: charGlobalIndex * 0.02,
                                duration: 0.05,
                                ease: "easeOut",
                              }}
                              className="inline-block"
                            >
                              {char}
                            </motion.span>
                          );
                        })}
                        {wordIndex < words.length - 1 && (
                          <span className="inline-block">&nbsp;</span>
                        )}
                      </span>
                    );
                  });
                })()}
              </motion.span>
            </AnimatePresence>
          </p>
        </div>
      </div>


      {/* =====================================================
          DESKTOP ONLY: TOP-RIGHT STACKED BIO + BADGE (md:flex)
          ===================================================== */}

      <div
        className="
          hidden
          md:flex

          absolute

          md:top-[17%]

          md:right-[40px]
          lg:right-[50px]
          xl:right-[60px]

          md:w-[42%]
          max-w-[560px]

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

              md:text-sm
              lg:text-base
              xl:text-lg

              min-h-[3.5rem]
              whitespace-normal
              break-normal
            "
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={bioKey}
                className="inline-block text-right"
              >
                {(() => {
                  let globalCharIndex = 0;
                  const words = bioText.split(" ");

                  return words.map((word, wordIndex) => {
                    const chars = word.split("");
                    const wordStartIndex = globalCharIndex;
                    globalCharIndex += chars.length + 1;

                    return (
                      <span
                        key={`word-d-${wordIndex}`}
                        className="inline-block whitespace-nowrap"
                      >
                        {chars.map((char, charIndex) => {
                          const charGlobalIndex = wordStartIndex + charIndex;
                          return (
                            <motion.span
                              key={`d-${bioKey}-${charGlobalIndex}`}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                delay: charGlobalIndex * 0.02,
                                duration: 0.05,
                                ease: "easeOut",
                              }}
                              className="inline-block"
                            >
                              {char}
                            </motion.span>
                          );
                        })}
                        {wordIndex < words.length - 1 && (
                          <span className="inline-block">&nbsp;</span>
                        )}
                      </span>
                    );
                  });
                })()}
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
            AVAILABLE FOR AI/ML ENGINEERING &amp; SYSTEM ARCHITECTURE
          </span>
        </div>
      </div>

    </div>
  );
};