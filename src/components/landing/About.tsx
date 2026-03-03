import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Image from '@/components/ui/Image';
import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();

  return (
    <section id="about" className="py-20 md:py-32 bg-obsidian text-ivory relative overflow-hidden">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
        {/* Image Side */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-gold/20 transform -rotate-2 hover:rotate-0 transition-transform duration-700">
            <Image 
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80" 
              alt={t('about_image_alt')}
              className="w-full h-full object-cover"
              containerClassName="w-full h-full"
              sizes="(min-width: 768px) 50vw, 100vw"
              maxWidth={1024}
              quality={72}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 font-display italic text-4xl text-gold/40">EST. 2019</div>
          </div>
        </motion.div>

        {/* Text Side */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col gap-6"
        >
          <h2 className="font-display italic text-4xl sm:text-5xl md:text-6xl text-gold mb-4 leading-tight">{t('about_title')}</h2>
          <p className="font-body text-lg text-silver leading-relaxed">
            {t('about_p1')}
          </p>
          <p className="font-body text-lg text-silver leading-relaxed">
            {t('about_p2')}
          </p>

          <div className="flex flex-wrap gap-4 mt-6">
            <div className="px-4 py-2 border border-gold/30 rounded-full text-gold text-sm font-medium">{t('about_badge_google')}</div>
            <div className="px-4 py-2 border border-gold/30 rounded-full text-gold text-sm font-medium">{t('about_badge_best_restaurant')}</div>
            <div className="px-4 py-2 border border-gold/30 rounded-full text-gold text-sm font-medium">{t('about_badge_michelin')}</div>
          </div>

          <Link to="/menu" className="mt-8 text-gold hover:text-ivory transition-colors font-medium tracking-wide flex items-center gap-2 group">
            {t('about_cta_discover')} 
            <span className="group-hover:translate-x-2 transition-transform">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
