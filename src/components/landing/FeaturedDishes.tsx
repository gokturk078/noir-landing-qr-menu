import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import Image from '@/components/ui/Image';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/lib/format';
import SectionHeader from '@/components/ui/SectionHeader';
import Button from '@/components/ui/Button';

const DISHES = [
  {
    id: 1,
    nameKey: "featured_dish_1_name",
    price: 485,
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&q=80",
    descriptionKey: "featured_dish_1_desc"
  },
  {
    id: 2,
    nameKey: "featured_dish_2_name",
    price: 620,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80",
    descriptionKey: "featured_dish_2_desc"
  },
  {
    id: 3,
    nameKey: "featured_dish_3_name",
    price: 195,
    image: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=600&q=80",
    descriptionKey: "featured_dish_3_desc"
  }
];

export default function FeaturedDishes() {
  const { t, i18n } = useTranslation();

  return (
    <section className="py-24 bg-obsidian text-ivory relative">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <SectionHeader kicker={t('chefs_choice')} title={t('featured_dishes')} />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {DISHES.map((dish, index) => (
            <motion.div 
              key={dish.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative cursor-pointer"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm mb-6 border border-white/5 group-hover:border-gold/50 transition-colors duration-500">
                <Image 
                  src={dish.image} 
                  alt={t(dish.nameKey)} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  containerClassName="w-full h-full"
                  sizes="(min-width: 768px) 33vw, 100vw"
                  maxWidth={800}
                  quality={72}
                />
                <div className="absolute top-4 left-4 bg-gold text-obsidian px-3 py-1 text-xs font-bold tracking-wider uppercase flex items-center gap-1">
                  <Star size={12} fill="currentColor" /> {t('featured_badge')}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
              </div>
              
              <div className="text-center">
                <h3 className="font-display text-3xl text-ivory mb-2 group-hover:text-gold transition-colors">{t(dish.nameKey)}</h3>
                <p className="font-body text-silver text-sm mb-4 line-clamp-2 px-4">{t(dish.descriptionKey)}</p>
                <div className="font-mono text-gold text-xl">
                  {formatCurrency({ amount: dish.price, language: i18n.language, currency: 'TRY' })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Button asChild variant="outline">
            <Link to="/menu">{t('view_all_menu').toUpperCase()}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
