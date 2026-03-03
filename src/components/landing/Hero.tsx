import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown, Instagram, MapPin, Clock } from 'lucide-react';
import Image from '@/components/ui/Image';
import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/Button';
import { RESTAURANT_INFO } from '@/lib/data/restaurant-data';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative h-[100dvh] w-full overflow-hidden flex items-center justify-center bg-obsidian">
      {/* Background Image with Parallax Effect */}
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
      >
        <Image 
          src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1920&q=80"
          alt={t('hero_image_alt')}
          className="w-full h-full object-cover opacity-60"
          containerClassName="w-full h-full"
          priority={true}
          sizes="100vw"
          maxWidth={1920}
          quality={78}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/60 via-obsidian/40 to-obsidian/90" />
      </motion.div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10 text-center flex flex-col items-center">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="font-accent text-gold text-xs md:text-sm tracking-[0.3em] uppercase mb-4 md:mb-6 block"
        >
          {t('hero_tagline')}
        </motion.span>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="font-display italic text-5xl sm:text-6xl md:text-8xl lg:text-9xl text-ivory mb-2 md:mb-4 leading-none tracking-tight"
        >
          Noir & Blanc
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="flex flex-col items-center gap-1 mb-10 md:mb-12"
        >
          <p className="font-body font-light text-lg md:text-2xl text-silver">
            {t('hero_subtitle_line1')}
          </p>
          <p className="font-body font-light text-lg md:text-2xl text-silver">
            {t('hero_subtitle_line2')}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="flex flex-col md:flex-row gap-4 md:gap-6 w-full md:w-auto"
        >
          <Button asChild className="w-full md:w-auto min-w-[200px]">
            <Link to="/menu">{t('hero_cta_menu')}</Link>
          </Button>
          <Button asChild variant="outline" className="w-full md:w-auto min-w-[200px]">
            <a href="#reservation">{t('hero_cta_reservation')}</a>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.25, duration: 0.7 }}
          className="mt-10 w-full max-w-3xl"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-obsidian/40 backdrop-blur-md border border-white/10 rounded-sm p-4">
            <a
              href={RESTAURANT_INFO.socials.maps}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 px-3 py-2 rounded-sm hover:bg-white/5 transition-colors"
            >
              <MapPin size={16} className="text-gold" />
              <span className="text-xs text-silver line-clamp-2">{RESTAURANT_INFO.address}</span>
            </a>
            <div className="flex items-center gap-3 px-3 py-2 rounded-sm">
              <Clock size={16} className="text-gold" />
              <span className="text-xs text-silver">{t('opening_hours')}</span>
            </div>
            <a
              href={RESTAURANT_INFO.socials.instagram}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 px-3 py-2 rounded-sm hover:bg-white/5 transition-colors"
            >
              <Instagram size={16} className="text-gold" />
              <span className="text-xs text-silver">@{RESTAURANT_INFO.name.replace(/\s+/g, '').toLowerCase()}</span>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Bottom Elements */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-6 md:left-12 z-10 hidden md:block"
      >
        <p className="text-xs text-silver tracking-widest uppercase font-mono">
          {t('hero_hours')}
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 right-6 md:right-12 z-10 flex gap-4"
      >
        <a href={RESTAURANT_INFO.socials.instagram} target="_blank" rel="noreferrer" className="text-silver hover:text-gold transition-colors"><Instagram size={20} /></a>
        <a href={RESTAURANT_INFO.socials.maps} target="_blank" rel="noreferrer" className="text-silver hover:text-gold transition-colors"><MapPin size={20} /></a>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1, repeat: Infinity, repeatType: "reverse" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-gold"
      >
        <ChevronDown size={32} />
      </motion.div>
    </section>
  );
}
