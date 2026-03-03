import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, Clock, Circle } from 'lucide-react';
import { RESTAURANT_INFO } from '@/lib/data/restaurant-data';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface MenuHeaderProps {
  onSearchClick: () => void;
}

export default function MenuHeader({ onSearchClick }: MenuHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const { t, i18n } = useTranslation();
  const currentLanguage = (i18n.resolvedLanguage || i18n.language).split('-')[0];
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const update = () => {
      document.documentElement.style.setProperty('--menu-header-height', `${el.offsetHeight}px`);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      ref={headerRef}
      className={`sticky top-0 left-0 right-0 z-40 transition-all duration-300 border-b border-white/5 ${
        isScrolled ? 'bg-obsidian/90 backdrop-blur-md shadow-lg' : 'bg-obsidian'
      } pt-[calc(env(safe-area-inset-top)+0.75rem)] pb-3`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex flex-col">
          <span className="font-display italic text-xl sm:text-2xl text-gold leading-none">{RESTAURANT_INFO.name}</span>
          <span className="text-[10px] text-silver tracking-widest uppercase">{t('digital_menu')}</span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <select
            value={currentLanguage}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            className="bg-transparent text-silver text-xs font-mono tracking-widest uppercase outline-none cursor-pointer border border-white/10 rounded-full px-2 py-1 hover:border-white/30 transition-colors"
          >
            <option value="tr">TR</option>
            <option value="en">EN</option>
            <option value="de">DE</option>
            <option value="ru">RU</option>
          </select>

          <button 
            onClick={onSearchClick}
            className="p-2 text-ivory hover:text-gold transition-colors rounded-full hover:bg-white/5"
            aria-label={t('search_placeholder')}
          >
            <Search size={22} />
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="container mx-auto px-4 mt-2 hidden sm:flex items-center gap-4 text-[10px] text-ash uppercase tracking-wider font-mono">
        <div className="flex items-center gap-1.5 text-sage">
          <Circle size={8} fill="currentColor" className="animate-pulse" />
          <span>{t('open_now')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={10} />
          <span>{t('opening_hours')}</span>
        </div>
      </div>
    </motion.header>
  );
}
