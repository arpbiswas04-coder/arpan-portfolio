import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { BackgroundVideo } from './components/BackgroundVideo';
import { CursorGlow } from './components/CursorGlow';
import { Header } from './components/Header';
import { HeroContent } from './components/HeroContent';
import { HeroImage } from './components/HeroImage';
import { FooterMarquee } from './components/FooterMarquee';
import { InfoDrawer } from './components/InfoDrawer';
import { IntroScreen } from './components/IntroScreen';

export function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<string>('MENU');

  useEffect(() => {
    if (showIntro) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [showIntro]);

  const handleOpenDrawer = (tab?: string) => {
    setDrawerTab(tab || 'MENU');
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <main className="relative w-full h-screen min-h-screen overflow-hidden flex flex-col justify-between bg-[#030014] text-white selection:bg-[#CCFF00] selection:text-black">
      {/* Intro Splash Screen Overlay */}
      <AnimatePresence>
        {showIntro && (
          <IntroScreen onComplete={() => setShowIntro(false)} />
        )}
      </AnimatePresence>

      {/* Background Video */}
      <BackgroundVideo />

      {/* Cursor Reactive Glow Layer */}
      <CursorGlow />

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
