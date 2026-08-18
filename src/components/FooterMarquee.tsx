import React from 'react';

export const FooterMarquee: React.FC = () => {
  const marqueeText = "ARPAN // CREATIVE DIRECTOR // ARPAN // CREATIVE DIRECTOR // ARPAN // CREATIVE DIRECTOR // ";

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 overflow-hidden pointer-events-none select-none py-2 bg-gradient-to-t from-[#030014] to-transparent">
      <div className="animate-marquee whitespace-nowrap flex items-center">
        <span className="font-display text-4xl sm:text-6xl md:text-8xl lg:text-[110px] uppercase text-stroke-marquee tracking-wider px-4">
          {marqueeText}
        </span>
        <span className="font-display text-4xl sm:text-6xl md:text-8xl lg:text-[110px] uppercase text-stroke-marquee tracking-wider px-4">
          {marqueeText}
        </span>
      </div>
    </div>
  );
};
