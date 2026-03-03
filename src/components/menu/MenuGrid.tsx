import { motion, AnimatePresence } from 'framer-motion';
import MenuItemCard from './MenuItemCard';
import { MenuItem } from '@/types/menu';
import { useTranslation } from 'react-i18next';
import type { FC } from 'react';

interface MenuGridProps {
  items: MenuItem[];
  viewMode: 'grid' | 'list';
  onOpenDetail: (item: MenuItem) => void;
  isLoading?: boolean;
}

const SkeletonCard: FC<{ viewMode: 'grid' | 'list' }> = ({ viewMode }) => {
  if (viewMode === 'list') {
    return (
      <div className="flex gap-4 bg-charcoal p-3 rounded-sm border border-white/5 animate-pulse">
        <div className="w-24 h-24 shrink-0 rounded-sm bg-white/5" />
        <div className="flex flex-col flex-grow justify-between py-1">
          <div>
            <div className="flex justify-between items-start gap-3">
              <div className="h-4 w-2/3 bg-white/5 rounded" />
              <div className="h-4 w-16 bg-white/5 rounded" />
            </div>
            <div className="mt-2 space-y-2">
              <div className="h-3 w-full bg-white/5 rounded" />
              <div className="h-3 w-4/5 bg-white/5 rounded" />
            </div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-white/10" />
              <div className="w-2 h-2 rounded-full bg-white/10" />
            </div>
            <div className="w-5 h-5 rounded bg-white/5" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-charcoal rounded-sm overflow-hidden border border-white/5 shadow-lg animate-pulse">
      <div className="relative aspect-[4/3] bg-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
        <div className="absolute top-3 left-3 flex gap-2">
          <div className="h-5 w-16 rounded-full bg-white/5 border border-white/10" />
          <div className="h-5 w-14 rounded-full bg-white/5 border border-white/10" />
        </div>
        <div className="absolute bottom-3 right-3 h-7 w-20 rounded-full bg-white/5 border border-white/10" />
      </div>
      <div className="p-4 sm:p-5">
        <div className="h-4 w-2/3 bg-white/5 rounded" />
        <div className="mt-3 space-y-2">
          <div className="h-3 w-full bg-white/5 rounded" />
          <div className="h-3 w-5/6 bg-white/5 rounded" />
        </div>
        <div className="mt-5 pt-4 border-t border-white/5">
          <div className="h-5 w-24 bg-white/5 rounded" />
        </div>
      </div>
    </div>
  );
};

export default function MenuGrid({ items, viewMode, onOpenDetail, isLoading = false }: MenuGridProps) {
  const { t } = useTranslation();

  if (isLoading) {
    const count = viewMode === 'grid' ? 6 : 8;
    return (
      <div
        className={`grid gap-4 md:gap-6 pb-10 md:pb-16 ${
          viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
        }`}
        aria-busy="true"
      >
        {Array.from({ length: count }).map((_, idx) => (
          <SkeletonCard key={idx} viewMode={viewMode} />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-5xl mb-4">🍽️</div>
        <h3 className="font-display text-2xl text-ivory mb-2">{t('no_results_found')}</h3>
        <p className="text-silver">{t('no_results_desc')}</p>
      </div>
    );
  }

  return (
    <motion.div 
      layout
      className={`grid gap-4 md:gap-6 pb-10 md:pb-16 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1'
      }`}
    >
      <AnimatePresence>
        {items.map((item) => (
          <MenuItemCard 
            key={item.id} 
            item={item} 
            viewMode={viewMode} 
            onOpenDetail={onOpenDetail}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
