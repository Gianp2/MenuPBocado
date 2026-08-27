import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BotanicalDecoration } from './BotanicalDecoration';
import { PuntoBocadoLogo } from './PuntoBocadoLogo';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';

interface IntroSplashScreenProps {
  onComplete?: () => void;
  minDuration?: number; // in milliseconds
}

export const IntroSplashScreen: React.FC<IntroSplashScreenProps> = ({
  onComplete,
  minDuration = 2200,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  // Lock scroll only while splash is visible
  useLockBodyScroll(isVisible);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleDismiss();
    }, minDuration);

    return () => {
      clearTimeout(timer);
    };
  }, [minDuration]);

  const handleDismiss = () => {
    setIsVisible(false);
    // Explicitly guarantee body overflow is normalized immediately
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    if (onComplete) {
      setTimeout(onComplete, 700);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="intro-splash"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            filter: 'blur(4px)',
            transition: { duration: 0.75, ease: [0.25, 1, 0.5, 1] },
          }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-[#fcfbf7] text-[#272624] select-none overflow-hidden p-6"
          onClick={handleDismiss}
        >
          {/* Subtle Vintage Texture & Ambient Gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.9)_0%,rgba(244,240,230,0.85)_100%)] pointer-events-none" />

          {/* Corner Botanical Ornaments with Staggered Fade-in */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.85, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="w-full"
          >
            <BotanicalDecoration position="top-left" className="top-0 left-0 w-36 sm:w-56 h-36 sm:h-56" />
            <BotanicalDecoration position="top-right" className="top-0 right-0 w-36 sm:w-56 h-36 sm:h-56" />
          </motion.div>

          {/* Top Subtle Pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative z-10 pt-4"
          >
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#f0ebd9]/80 border border-[#ded8c9] text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#706b61]">
              <Sparkles className="w-3 h-3 text-[#b26649]" />
              Carta Digital Oficial
            </span>
          </motion.div>

          {/* Central Animated Badge & Branding */}
          <div className="relative z-10 flex flex-col items-center justify-center my-auto text-center px-4 max-w-sm">
            {/* Outer Pulsing Glow */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="absolute w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-[#c65526]/15 blur-xl pointer-events-none"
            />

            {/* Crest Container with Spring Entrance */}
            <motion.div
              initial={{ scale: 0.75, opacity: 0, rotate: -4 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{
                type: 'spring',
                stiffness: 220,
                damping: 20,
                delay: 0.15,
              }}
              className="relative mb-5 w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center"
            >
              <PuntoBocadoLogo className="w-full h-full" showShadow />
            </motion.div>

            {/* Typography Reveal */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="space-y-1"
            >
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-[#272624] font-['Montserrat']">
                Punto Bocado
              </h1>
              <p className="text-xs sm:text-sm text-[#706b61] font-semibold tracking-wider uppercase">
                Desayunos • Viandas • Comidas • Café
              </p>
            </motion.div>

            {/* Elegant Line Progress Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="w-36 sm:w-44 h-1 bg-[#ded8c9] rounded-full overflow-hidden mt-6"
            >
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  ease: 'easeInOut',
                }}
                className="w-1/2 h-full bg-[#c65526] rounded-full"
              />
            </motion.div>
          </div>

          {/* Bottom Tap to Enter prompt */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="relative z-10 pb-4 text-center cursor-pointer"
          >
            <button
              onClick={handleDismiss}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#8a8479] hover:text-[#272624] transition-colors py-2 px-4 rounded-full bg-white/70 hover:bg-white border border-[#e2dccf] shadow-2xs"
            >
              <span>Ver Menú</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#b26649]" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

