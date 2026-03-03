import { motion } from 'framer-motion';
import Image from '@/components/ui/Image';
import { useTranslation } from 'react-i18next';

export default function Chef() {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-obsidian text-ivory relative">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12 md:gap-24">
        
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="w-full md:w-1/2 relative"
        >
          <div className="aspect-[3/4] overflow-hidden rounded-sm grayscale hover:grayscale-0 transition-all duration-700">
            <Image 
              src="https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=800&q=80" 
              alt={t('chef_image_alt')} 
              className="w-full h-full object-cover"
              containerClassName="w-full h-full"
              sizes="(min-width: 768px) 50vw, 100vw"
              maxWidth={1024}
              quality={72}
            />
          </div>
          <div className="absolute -bottom-6 -right-6 w-48 h-48 border border-gold/30 z-[-1]" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="w-full md:w-1/2 flex flex-col gap-6"
        >
          <span className="font-accent text-gold text-sm tracking-[0.2em] uppercase">{t('executive_chef')}</span>
          <h2 className="font-display italic text-4xl sm:text-5xl lg:text-6xl text-ivory leading-tight">Jean-Pierre Moreau</h2>
          
          <div className="w-20 h-[1px] bg-gold/50 my-2" />
          
          <p className="font-body text-lg text-silver leading-relaxed">
            {t('chef_quote')}
          </p>
          
          <p className="font-body text-base text-ash leading-relaxed">
            {t('chef_bio')}
          </p>

          <div className="mt-8 font-display text-4xl text-gold opacity-80 rotate-[-5deg]">
            J.P. Moreau
          </div>
        </motion.div>
      </div>
    </section>
  );
}
