import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface MediaLightboxProps {
  isOpen: boolean;
  media: string[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const MediaLightbox: React.FC<MediaLightboxProps> = ({
  isOpen,
  media,
  currentIndex,
  onClose,
  onNavigate,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') {
        onNavigate((currentIndex - 1 + media.length) % media.length);
      }
      if (e.key === 'ArrowRight') {
        onNavigate((currentIndex + 1) % media.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, media.length, onClose, onNavigate]);

  if (!isOpen || media.length === 0) return null;

  const currentItem = media[currentIndex];
  const isVideo = currentItem?.toLowerCase().endsWith('.mp4');

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-8"
        onClick={onClose}
      >
        {/* Modal Window Container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative max-w-5xl max-h-[85vh] w-full flex items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#121212] shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full border border-white/20 bg-black/50 hover:bg-[#CCFF00] hover:border-[#CCFF00] text-white hover:text-black flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer"
            aria-label="Close Lightbox"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Media Content */}
          <div className="w-full h-full flex items-center justify-center p-2 md:p-6">
            {isVideo ? (
              <video
                src={currentItem}
                controls
                autoPlay
                className="max-h-[75vh] max-w-full rounded-lg object-contain shadow-lg"
              />
            ) : (
              <img
                src={currentItem}
                alt={`Media ${currentIndex + 1}`}
                className="max-h-[75vh] max-w-full rounded-lg object-contain shadow-lg select-none"
              />
            )}
          </div>

          {/* Navigation Controls */}
          {media.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate((currentIndex - 1 + media.length) % media.length);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/20 bg-black/50 hover:bg-[#CCFF00] hover:border-[#CCFF00] text-white hover:text-black flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer"
                aria-label="Previous Media"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate((currentIndex + 1) % media.length);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/20 bg-black/50 hover:bg-[#CCFF00] hover:border-[#CCFF00] text-white hover:text-black flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer"
                aria-label="Next Media"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Counter Indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-black/60 border border-white/10 font-mono text-xs text-white/80 select-none">
                {currentIndex + 1} / {media.length}
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
