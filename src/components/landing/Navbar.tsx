import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { RESTAURANT_INFO } from '@/lib/data/restaurant-data';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const currentLanguage = (i18n.resolvedLanguage || i18n.language).split('-')[0];

  const languages = [
    { code: 'tr', label: 'TR' },
    { code: 'en', label: 'EN' },
    { code: 'de', label: 'DE' },
    { code: 'ru', label: 'RU' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-obsidian/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
        } pt-[calc(env(safe-area-inset-top)+1rem)] pb-4`}
      >
        <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl md:text-3xl font-display italic font-bold text-gold z-50 tracking-tight">
            {RESTAURANT_INFO.name}
          </Link>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#about" className="text-ivory hover:text-gold transition-colors font-body text-sm tracking-wide">{t('our_story').toUpperCase()}</a>
            <a href="#menu-highlight" className="text-ivory hover:text-gold transition-colors font-body text-sm tracking-wide">{t('menu').toUpperCase()}</a>
            <a href="#reservation" className="text-ivory hover:text-gold transition-colors font-body text-sm tracking-wide">{t('reservation').toUpperCase()}</a>
            
            {/* Language Switcher */}
            <div className="flex gap-3 text-xs font-mono text-silver border-l border-white/10 pl-4">
              {languages.map(lang => (
                <button 
                  key={lang.code} 
                  onClick={() => i18n.changeLanguage(lang.code)}
                  className={cn("hover:text-gold transition-colors", currentLanguage === lang.code && "text-gold font-bold")}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            <Link 
              to="/menu" 
              className="px-6 py-2 border border-gold text-gold hover:bg-gold hover:text-obsidian transition-all duration-300 rounded-sm font-medium tracking-wider"
            >
              {t('view_all_menu').toUpperCase()}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-ivory z-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? t('close') : t('menu')}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-obsidian/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center gap-7 md:hidden pt-[calc(env(safe-area-inset-top)+6rem)] pb-[calc(env(safe-area-inset-bottom)+2rem)] overflow-y-auto px-6"
          >
            <a 
              href="#about" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-display text-ivory hover:text-gold transition-colors"
            >
              {t('our_story').toUpperCase()}
            </a>
            <a 
              href="#menu-highlight" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-display text-ivory hover:text-gold transition-colors"
            >
              {t('menu').toUpperCase()}
            </a>
            <a 
              href="#reservation" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-display text-ivory hover:text-gold transition-colors"
            >
              {t('reservation').toUpperCase()}
            </a>

            {/* Mobile Language Switcher */}
            <div className="flex gap-6 text-lg font-mono text-silver">
              {languages.map(lang => (
                <button 
                  key={lang.code} 
                  onClick={() => {
                    i18n.changeLanguage(lang.code);
                    // Don't close menu immediately to allow user to see change
                  }}
                  className={cn("hover:text-gold transition-colors", currentLanguage === lang.code && "text-gold font-bold")}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            <Button asChild className="w-full max-w-xs mt-2">
              <Link to="/menu" onClick={() => setIsMobileMenuOpen(false)}>
                {t('view_all_menu').toUpperCase()}
              </Link>
            </Button>
            <Button asChild variant="secondary" className="w-full max-w-xs">
              <a href="#reservation" onClick={() => setIsMobileMenuOpen(false)}>
                {t('book_table').toUpperCase()}
              </a>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
