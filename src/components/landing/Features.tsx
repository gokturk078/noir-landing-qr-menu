import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Utensils } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/Button';

export default function Features() {
  const { t } = useTranslation();

  return (
    <section id="menu-highlight" className="py-24 bg-gradient-to-r from-gold-muted via-gold to-gold-muted relative overflow-hidden">
      <div className="absolute inset-0 bg-obsidian/10 mix-blend-multiply" />
      
      <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="flex flex-col gap-4 text-center md:text-left">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display italic text-4xl sm:text-5xl md:text-6xl text-obsidian font-bold leading-tight"
          >
            {t('features_title')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-body text-lg sm:text-xl text-obsidian/80 font-medium"
          >
            {t('features_desc')}
          </motion.p>
        </div>

        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05 }}
          className="relative group"
        >
          <Button asChild size="lg" className="gap-3 px-10">
            <Link to="/menu" className="inline-flex items-center gap-4">
              <Utensils className="w-6 h-6" />
              {t('browse_menu')}
            </Link>
          </Button>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -right-20 -bottom-20 opacity-10 pointer-events-none">
        <Utensils size={400} className="text-obsidian" />
      </div>
    </section>
  );
}
