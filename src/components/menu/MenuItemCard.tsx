import { motion } from 'framer-motion';
import { MenuItem } from '@/types/menu';
import { Star, Flame, Leaf, Wheat, Award, ChevronRight } from 'lucide-react';
import { cn, getLocalizedItem } from '@/lib/utils';
import React from 'react';
import Image from '@/components/ui/Image';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/lib/format';

interface MenuItemCardProps {
  item: MenuItem;
  viewMode: 'grid' | 'list';
  onOpenDetail: (item: MenuItem) => void;
}

const BADGE_ICONS = {
  'chefs-choice': { icon: Award, color: "text-gold bg-gold/10 border-gold/20" },
  'new': { icon: Star, color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
  'spicy': { icon: Flame, color: "text-red-500 bg-red-500/10 border-red-500/20" },
  'vegetarian': { icon: Leaf, color: "text-green-500 bg-green-500/10 border-green-500/20" },
  'vegan': { icon: Leaf, color: "text-green-600 bg-green-600/10 border-green-600/20" },
  'gluten-free': { icon: Wheat, color: "text-amber-600 bg-amber-600/10 border-amber-600/20" },
  'popular': { icon: Star, color: "text-purple-400 bg-purple-400/10 border-purple-400/20" },
};

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, viewMode, onOpenDetail }) => {
  const { t, i18n } = useTranslation();
  const localizedItem = getLocalizedItem(item, i18n.language);
  const isAvailable = item.isAvailable;
  const price = formatCurrency({ amount: item.price, language: i18n.language, currency: 'TRY' });
  const open = () => onOpenDetail(item);

  // Grid View
  if (viewMode === 'grid') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover={{ y: -4 }}
        className={cn(
          "group relative bg-charcoal rounded-sm overflow-hidden border border-white/5 hover:border-gold/40 transition-all duration-500 shadow-lg hover:shadow-gold/10 flex flex-col h-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold/40 focus:ring-offset-0",
          !isAvailable && "grayscale opacity-70"
        )}
        role="button"
        tabIndex={0}
        aria-label={localizedItem.name}
        onClick={open}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            open();
          }
        }}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image 
            src={item.image} 
            alt={localizedItem.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            containerClassName="w-full h-full"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            maxWidth={800}
            quality={70}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent opacity-60" />

          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-obsidian/60 backdrop-blur-md text-ivory text-[11px] tracking-wider uppercase font-accent transition-all duration-300 group-hover:border-gold/40 group-hover:text-gold">
            <span>{t('details')}</span>
            <ChevronRight size={14} className="opacity-80 group-hover:translate-x-0.5 transition-transform" />
          </div>
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {item.badges.slice(0, 2).map(badge => {
              const BadgeConfig = BADGE_ICONS[badge] as any;
              if (!BadgeConfig) return null;
              const Icon = BadgeConfig.icon;
              return (
                <span key={badge} className={cn("px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1 backdrop-blur-md", BadgeConfig.color)}>
                  <Icon size={10} /> {t(badge.replace('-', '_'))}
                </span>
              );
            })}
          </div>

          {!isAvailable && (
            <div className="absolute inset-0 flex items-center justify-center bg-obsidian/60 backdrop-blur-sm">
              <span className="px-4 py-2 bg-rouge text-white font-bold uppercase tracking-widest border border-white/20 rotate-[-10deg]">{t('sold_out')}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-body font-medium text-base sm:text-lg text-ivory group-hover:text-gold transition-colors line-clamp-1">
              {localizedItem.name}
            </h3>
          </div>
          
          <p className="text-silver text-xs leading-relaxed line-clamp-2 mb-4 flex-grow font-light">
            {localizedItem.description}
          </p>

          <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
            <span className="font-mono text-lg text-gold font-medium">
              {price}
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  // List View (Compact)
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "group flex gap-4 bg-charcoal p-3 rounded-sm border border-white/5 hover:border-gold/40 transition-all duration-500 hover:bg-white/[0.02] cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold/40 focus:ring-offset-0",
        !isAvailable && "grayscale opacity-70"
      )}
      role="button"
      tabIndex={0}
      aria-label={localizedItem.name}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      }}
    >
      <div className="relative w-24 h-24 shrink-0 rounded-sm overflow-hidden">
        <Image 
          src={item.image} 
          alt={localizedItem.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          containerClassName="w-full h-full"
          sizes="96px"
          maxWidth={256}
          quality={68}
        />
        {!isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-obsidian/60">
            <span className="text-[10px] bg-rouge text-white px-1 font-bold uppercase">{t('sold_out')}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-grow justify-between py-1">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="font-body font-medium text-base text-ivory group-hover:text-gold transition-colors line-clamp-1">
              {localizedItem.name}
            </h3>
            <span className="font-mono text-sm text-gold font-medium whitespace-nowrap ml-2">
              {price}
            </span>
          </div>
          <p className="text-silver text-[11px] leading-relaxed line-clamp-2 mt-1 font-light">
            {localizedItem.description}
          </p>
        </div>

        <div className="flex justify-between items-center mt-2">
          <div className="flex gap-2">
            {item.badges.slice(0, 2).map(badge => {
              const BadgeConfig = BADGE_ICONS[badge] as any;
              if (!BadgeConfig) return null;
              return (
                <span key={badge} className={cn("w-2 h-2 rounded-full", BadgeConfig.color.split(' ')[0].replace('text-', 'bg-'))} title={t(badge.replace('-', '_'))} />
              );
            })}
          </div>
          <ChevronRight size={18} className="text-white/20 group-hover:text-gold transition-colors" />
        </div>
      </div>
    </motion.div>
  );
};

export default MenuItemCard;
