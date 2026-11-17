import React, { useState, useEffect } from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { BackgroundVideo } from './components/BackgroundVideo';
import { CursorGlow } from './components/CursorGlow';
import { Header } from './components/Header';
import { HeroContent } from './components/HeroContent';
import { HeroImage } from './components/HeroImage';
import { FooterMarquee } from './components/FooterMarquee';
import { InfoDrawer } from './components/InfoDrawer';
import { IntroScreen } from './components/IntroScreen';

export function App() {
  const [pageHidden, setPageHidden] = useState(document.hidden);
  useEffect(() => {
    const update = () => setPageHidden(document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  // Match the breakpoint where the drawer stops covering the entire viewport.
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 639px)').matches);
  useEffect(() => {
    const query = window.matchMedia('(max-width: 639px)');
    const update = () => setIsMobile(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  const [showIntro, setShowIntro] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<string>('MENU');
  const pauseHero = pageHidden || showIntro || (isMobile && isDrawerOpen);

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
    <MotionConfig reducedMotion="user">
    <main data-paused={pauseHero} className="portfolio-shell relative w-full overflow-hidden flex flex-col justify-between bg-[#030014] text-white selection:bg-[#CCFF00] selection:text-black">
      {/* Intro Splash Screen Overlay */}
      <AnimatePresence>
        {showIntro && (
          <IntroScreen onComplete={() => setShowIntro(false)} />
        )}
      </AnimatePresence>

      {/* Background Video */}
      <BackgroundVideo paused={pauseHero} />

      {/* Cursor Reactive Glow Layer */}
      <CursorGlow paused={pauseHero} />

      {/* z-30: Fixed Header */}
      <Header onOpenDrawer={handleOpenDrawer} />

      {/* z-20: Hero Content (Mammoth Headline & Typewriter Bio) */}
      <HeroContent paused={pauseHero} />

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
    </MotionConfig>
  );
}

export default App;
