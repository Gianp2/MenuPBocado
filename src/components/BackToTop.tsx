import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!visible) return null;

  return (
    <button
      id="back-to-top-btn"
      onClick={scrollToTop}
      className="fixed bottom-5 right-5 z-30 p-3 rounded-full bg-white border border-[#d6cfbe] text-[#3d3a35] hover:bg-[#ede8db] shadow-md transition-all duration-200 cursor-pointer"
      title="Volver arriba"
      aria-label="Volver arriba de la carta"
    >
      <ArrowUp className="w-4 h-4 text-[#b26649]" />
    </button>
  );
};
