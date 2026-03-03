import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SectionHeader from '@/components/ui/SectionHeader';

const TESTIMONIALS = [
  {
    id: 1,
    name: "Sophie Laurent",
    textKey: "testimonial_1_text",
    rating: 5,
    dateKey: "testimonial_1_date"
  },
  {
    id: 2,
    name: "Mehmet Yılmaz",
    textKey: "testimonial_2_text",
    rating: 5,
    dateKey: "testimonial_2_date"
  },
  {
    id: 3,
    name: "Elena Petrova",
    textKey: "testimonial_3_text",
    rating: 5,
    dateKey: "testimonial_3_date"
  },
  {
    id: 4,
    name: "Caner Erkin",
    textKey: "testimonial_4_text",
    rating: 5,
    dateKey: "testimonial_4_date"
  }
];

export default function Testimonials() {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-charcoal text-ivory relative overflow-hidden">
      <div className="container mx-auto px-6 mb-14">
        <SectionHeader kicker={t('testimonials_kicker')} title={t('testimonials_title')} />
      </div>

      <div className="container mx-auto px-6 pb-8">
        <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-8 md:overflow-visible">
          {TESTIMONIALS.map((testimonial, i) => (
            <motion.div 
              key={testimonial.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="shrink-0 w-[85vw] max-w-[360px] md:w-auto md:max-w-none bg-obsidian/50 p-6 sm:p-7 rounded-sm border border-white/5 hover:border-gold/30 transition-colors duration-300 flex flex-col min-h-[260px] md:min-h-[320px] snap-start"
            >
              <div className="min-w-0">
                <Quote className="text-gold mb-6 opacity-50" size={32} />
                <p className="font-body text-silver text-base sm:text-lg italic leading-relaxed mb-6 break-words line-clamp-5">
                  {t(testimonial.textKey)}
                </p>
              </div>
              
              <div>
                <div className="flex gap-1 text-gold mb-2">
                  {[...Array(testimonial.rating)].map((_, idx) => <Star key={idx} size={16} fill="currentColor" />)}
                </div>
                <h4 className="font-display text-xl text-ivory">{testimonial.name}</h4>
                <span className="text-xs text-ash uppercase tracking-wider">{t(testimonial.dateKey)}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
