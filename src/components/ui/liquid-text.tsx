//@ts-nocheck
"use client";

import { useCallback, useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

const morphTime = 0.8;
const cooldownTime = 0.35;

interface UseMorphingTextOptions {
  loop?: boolean;
  onSettled?: () => void;
}

const useMorphingText = (
  texts: string[],
  options?: UseMorphingTextOptions,
) => {
  const textIndexRef = useRef(0);
  const morphRef = useRef(0);
  const cooldownRef = useRef(0);
  const timeRef = useRef(new Date());
  const isFrozenRef = useRef(false);

  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);

  const setStyles = useCallback(
    (fraction: number) => {
      const [current1, current2] = [text1Ref.current, text2Ref.current];
      if (!current1 || !current2 || !texts || texts.length === 0) return;

      current2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      current2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

      const invertedFraction = 1 - fraction;
      current1.style.filter = `blur(${Math.min(8 / invertedFraction - 8, 100)}px)`;
      current1.style.opacity = `${Math.pow(invertedFraction, 0.4) * 100}%`;

      current1.textContent = texts[textIndexRef.current % texts.length];
      current2.textContent = texts[(textIndexRef.current + 1) % texts.length];
    },
    [texts],
  );

  const doMorph = useCallback(() => {
    morphRef.current -= cooldownRef.current;
    cooldownRef.current = 0;

    let fraction = morphRef.current / morphTime;

    if (fraction > 1) {
      cooldownRef.current = cooldownTime;
      fraction = 1;
    }

    setStyles(fraction);

    if (fraction === 1) {
      if (options?.loop === false && textIndexRef.current === texts.length - 2) {
        textIndexRef.current++;
        isFrozenRef.current = true;
        options.onSettled?.();
      } else {
        textIndexRef.current++;
      }
    }
  }, [setStyles, texts, options]);

  const doCooldown = useCallback(() => {
    morphRef.current = 0;
    const [current1, current2] = [text1Ref.current, text2Ref.current];
    if (current1 && current2) {
      current2.style.filter = "none";
      current2.style.opacity = "100%";
      current1.style.filter = "none";
      current1.style.opacity = "0%";
    }
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    let startTimeoutId: ReturnType<typeof setTimeout>;

    // Render initial word at 100% opacity, unblurred
    setStyles(0);

    const animate = () => {
      if (isFrozenRef.current) return;
      animationFrameId = requestAnimationFrame(animate);

      const newTime = new Date();
      const dt = (newTime.getTime() - timeRef.current.getTime()) / 1000;
      timeRef.current = newTime;

      cooldownRef.current -= dt;

      if (cooldownRef.current <= 0) doMorph();
      else doCooldown();
    };

    // Hold first word for ~600ms before starting animation loop
    startTimeoutId = setTimeout(() => {
      timeRef.current = new Date();
      animate();
    }, 600);

    return () => {
      clearTimeout(startTimeoutId);
      cancelAnimationFrame(animationFrameId);
    };
  }, [setStyles, doMorph, doCooldown]);

  return { text1Ref, text2Ref };
};

interface MorphingTextProps {
  className?: string;
  texts: string[];
  loop?: boolean;
  onSettled?: () => void;
}

const Texts: React.FC<Pick<MorphingTextProps, "texts" | "loop" | "onSettled">> = ({
  texts,
  loop,
  onSettled,
}) => {
  const { text1Ref, text2Ref } = useMorphingText(texts, { loop, onSettled });
  return (
    <>
      <span
        className="absolute inset-x-0 top-0 m-auto inline-block w-full"
        ref={text1Ref}
      />
      <span
        className="absolute inset-x-0 top-0 m-auto inline-block w-full"
        ref={text2Ref}
      />
    </>
  );
};

const SvgFilters: React.FC = () => (
  <svg id="filters" className="hidden" preserveAspectRatio="xMidYMid slice">
    <defs>
      <filter id="threshold">
        <feColorMatrix
          in="SourceGraphic"
          type="matrix"
          values="1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 255 -140"
        />
      </filter>
    </defs>
  </svg>
);

const MorphingText: React.FC<MorphingTextProps> = ({
  texts,
  className,
  loop,
  onSettled,
}) => (
  <div
    className={cn(
      "relative mx-auto h-16 w-full max-w-screen-md text-center font-sans text-[40pt] font-bold leading-none [filter:url(#threshold)_blur(0.6px)] md:h-24 lg:text-[6rem]",
      className,
    )}
  >
    <Texts texts={texts} loop={loop} onSettled={onSettled} />
    <SvgFilters />
  </div>
);

export { MorphingText };
