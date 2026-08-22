import React, { useEffect, useRef } from 'react';

export const CursorGlow: React.FC = () => {
  const glowRef = useRef<HTMLDivElement>(null);
  const targetPos = useRef({ x: -500, y: -500 });
  const currentPos = useRef({ x: -500, y: -500 });
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    // Center glow initially before first mouse movement
    targetPos.current = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };
    currentPos.current = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current.x = e.clientX;
      targetPos.current.y = e.clientY;
    };

    const updatePosition = () => {
      // Smooth lerp trailing effect (8% position delta per frame)
      const lerpFactor = 0.08;
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * lerpFactor;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * lerpFactor;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0px) translate(-50%, -50%)`;
      }

      animationFrameId.current = requestAnimationFrame(updatePosition);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animationFrameId.current = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
      <div
        ref={glowRef}
        className="absolute top-0 left-0 w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle_at_center,rgba(204,255,0,0.18)_0%,rgba(136,170,255,0.06)_40%,transparent_70%)] blur-3xl pointer-events-none"
        style={{
          transform: 'translate3d(-500px, -500px, 0px) translate(-50%, -50%)',
          willChange: 'transform',
        }}
      />
    </div>
  );
};

export default CursorGlow;
