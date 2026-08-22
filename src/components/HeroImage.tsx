import React from 'react';

export const HeroImage: React.FC = () => {
  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 flex items-end justify-center pointer-events-auto select-none h-[75vh] sm:h-[82vh] md:h-[88vh] lg:h-[92vh] w-full max-w-3xl overflow-visible">
      <div className="relative w-full h-full flex items-end justify-center group">
        <img
          src="/profile.png"
          alt="Arpan"
          className="h-full object-contain object-bottom filter brightness-95 grayscale contrast-125 drop-shadow-[0_25px_50px_rgba(0,0,0,0.85)] transition-transform duration-700 ease-out group-hover:scale-[1.03] group-hover:brightness-100 group-hover:contrast-130 cursor-pointer"
        />
        {/* Subtle ground energy glow accent */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-t from-[#CCFF00]/10 via-[#88AAFF]/5 to-transparent blur-2xl pointer-events-none rounded-full" />
      </div>
    </div>
  );
};
