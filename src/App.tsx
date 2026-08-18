import React, { useState } from 'react';
import { ParticleBackground } from './components/ParticleBackground';
import { Header } from './components/Header';
import { HeroContent } from './components/HeroContent';
import { HeroImage } from './components/HeroImage';
import { FooterMarquee } from './components/FooterMarquee';
import { InfoDrawer } from './components/InfoDrawer';

export function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<string>('MENU');

  const handleOpenDrawer = (tab?: string) => {
    setDrawerTab(tab || 'MENU');
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <main className="relative w-full h-screen min-h-screen overflow-hidden flex flex-col justify-between bg-[#030014] text-white selection:bg-[#CCFF00] selection:text-black">
      {/* z-0: WebGL Particle Background */}
      <ParticleBackground />

      {/* z-30: Fixed Header */}
      <Header onOpenDrawer={handleOpenDrawer} />

      {/* z-20: Hero Content (Mammoth Headline & Typewriter Bio) */}
      <HeroContent />

      {/* z-10: Subject Cut-out Hero Image */}
      <HeroImage />

      {/* z-30: Footer Marquee */}
      <FooterMarquee />

      {/* z-50: Sliding Info Drawer */}
      <InfoDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        initialTab={drawerTab}
      />
    </main>
  );
}

export default App;
