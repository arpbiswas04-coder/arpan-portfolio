import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

export const CursorGlow: React.FC<{ paused?: boolean }> = ({ paused = false }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    if (paused || reducedMotion) return;
    const pointer = matchMedia('(hover: hover) and (pointer: fine)');
    let frame = 0;
    const current = { x: innerWidth / 2, y: innerHeight / 2 };
    const target = { ...current };
    const update = () => {
      current.x += (target.x - current.x) * 0.12;
      current.y += (target.y - current.y) * 0.12;
      if (ref.current) ref.current.style.transform = `translate3d(${current.x - 225}px, ${current.y - 225}px, 0)`;
      frame = Math.abs(target.x - current.x) + Math.abs(target.y - current.y) > 0.5 ? requestAnimationFrame(update) : 0;
    };
    const move = (event: PointerEvent) => {
      if (!pointer.matches) return;
      target.x = event.clientX; target.y = event.clientY;
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(frame); };
  }, [paused, reducedMotion]);
  return <div className="cursor-glow fixed inset-0 z-0 pointer-events-none overflow-hidden" hidden={!!reducedMotion}>
    <div ref={ref} className="absolute w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle,rgba(204,255,0,0.16),rgba(136,170,255,0.05)_40%,transparent_70%)]" style={{ transform: 'translate3d(-500px,-500px,0)' }} />
  </div>;
};
