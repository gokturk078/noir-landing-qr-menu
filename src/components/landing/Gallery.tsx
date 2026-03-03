import { motion } from 'framer-motion';
import Image from '@/components/ui/Image';
import { useTranslation } from 'react-i18next';
import SectionHeader from '@/components/ui/SectionHeader';

const IMAGES = [
  "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&q=80",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
  "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&q=80",
  "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800&q=80"
];

export default function Gallery() {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-charcoal text-ivory overflow-hidden">
      <div className="container mx-auto px-6 mb-12 flex justify-between items-end gap-6">
        <SectionHeader align="left" kicker={t('atmosphere')} title="Noir & Blanc" />
        <div className="hidden md:block flex-1 h-[1px] bg-white/10 mb-5" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 h-[70vh] min-h-[520px] md:h-[500px]">
        {IMAGES.map((src, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="relative group h-full overflow-hidden border-r border-white/5 last:border-r-0"
          >
            <Image 
              src={src} 
              alt={t('gallery_image_alt', { index: index + 1 })} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
              containerClassName="w-full h-full"
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
              maxWidth={1024}
              quality={70}
            />
            <div className="absolute inset-0 bg-obsidian/40 group-hover:bg-transparent transition-colors duration-500" />
            
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-obsidian/60 backdrop-blur-sm">
              <span className="font-display italic text-3xl text-gold">Noir & Blanc</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
