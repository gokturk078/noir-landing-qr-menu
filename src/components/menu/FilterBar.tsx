import { BadgeType } from '@/types/menu';
import { cn } from '@/lib/utils';
import { SlidersHorizontal, ArrowUpDown, X, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useDialog } from '@/lib/hooks/useDialog';
import { createPortal } from 'react-dom';

interface FilterBarProps {
  activeFilters: BadgeType[];
  onFilterToggle: (filter: BadgeType) => void;
  onClearFilters: () => void;
  sortOption: string;
  onSortChange: (option: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const FILTERS: { id: BadgeType; icon: string }[] = [
  { id: 'vegetarian', icon: '🌿' },
  { id: 'gluten-free', icon: '🌾' },
  { id: 'spicy', icon: '🌶️' },
  { id: 'chefs-choice', icon: '⭐' },
  { id: 'new', icon: '🆕' },
];

export default function FilterBar({ 
  activeFilters, 
  onFilterToggle, 
  onClearFilters,
  sortOption, 
  onSortChange,
  viewMode,
  onViewModeChange
}: FilterBarProps) {
  const { t } = useTranslation();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const sheetCloseRef = useRef<HTMLButtonElement>(null);

  const sortOptions = [
    { value: 'default', label: t('sort_default') },
    { value: 'price-asc', label: t('sort_price_asc') },
    { value: 'price-desc', label: t('sort_price_desc') },
    { value: 'name-asc', label: t('sort_name_asc') },
  ] as const;

  useDialog({
    isOpen: isSheetOpen,
    onClose: () => setIsSheetOpen(false),
    containerRef: sheetRef,
    initialFocusRef: sheetCloseRef,
  });

  return (
    <div
      className="sticky z-20 bg-obsidian/92 backdrop-blur-sm py-2 border-b border-white/5"
      style={{ top: 'calc(var(--menu-header-height, 72px) + var(--menu-category-height, 64px))' }}
    >
      <div className="container mx-auto px-4 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 min-w-0 flex-1">
            <div className="p-2 bg-white/5 rounded-full text-silver shrink-0">
              <SlidersHorizontal size={16} />
            </div>
            {FILTERS.map((filter) => (
              <button
                key={filter.id}
                onClick={() => onFilterToggle(filter.id)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-300 border flex items-center gap-1.5",
                  activeFilters.includes(filter.id)
                    ? "bg-gold/20 text-gold border-gold/50"
                    : "bg-transparent text-silver border-white/10 hover:border-white/30"
                )}
              >
                <span>{filter.icon}</span>
                {t(filter.id.replace('-', '_'))}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsSheetOpen(true)}
            className="sm:hidden shrink-0 px-3 py-2 rounded-full border border-white/10 bg-white/5 text-ivory text-xs tracking-wider uppercase font-accent hover:border-gold/40 hover:text-gold transition-colors"
            aria-label={t('filters')}
          >
            {t('filters')}
            {activeFilters.length > 0 ? (
              <span className="ml-2 inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-gold text-obsidian text-[10px] font-bold font-mono">
                {activeFilters.length}
              </span>
            ) : null}
          </button>
        </div>

        <div className="hidden sm:flex sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-silver border-t border-white/5 pt-2">
          <div className="flex items-center gap-2">
            <ArrowUpDown size={12} />
            <select 
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-transparent outline-none text-ivory font-medium appearance-none cursor-pointer"
            >
              <option value="default">{t('sort_default')}</option>
              <option value="price-asc">{t('sort_price_asc')}</option>
              <option value="price-desc">{t('sort_price_desc')}</option>
              <option value="name-asc">{t('sort_name_asc')}</option>
            </select>
          </div>

          <div className="flex bg-white/5 rounded-lg p-0.5 w-fit">
            <button 
              onClick={() => onViewModeChange('grid')}
              className={cn(
                "px-3 py-1 rounded-md transition-all",
                viewMode === 'grid' ? "bg-charcoal text-gold shadow-sm" : "text-silver hover:text-ivory"
              )}
            >
              {t('view_grid')}
            </button>
            <button 
              onClick={() => onViewModeChange('list')}
              className={cn(
                "px-3 py-1 rounded-md transition-all",
                viewMode === 'list' ? "bg-charcoal text-gold shadow-sm" : "text-silver hover:text-ivory"
              )}
            >
              {t('view_list')}
            </button>
          </div>
        </div>
      </div>

      {typeof document !== 'undefined'
        ? createPortal(
            <AnimatePresence>
              {isSheetOpen ? (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[10000] bg-obsidian/80 backdrop-blur-sm"
                    onClick={() => setIsSheetOpen(false)}
                  />
                  <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 40, opacity: 0 }}
                    transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                    className="fixed z-[10001] left-0 right-0 bottom-0 bg-charcoal border-t border-white/10 rounded-t-2xl shadow-2xl"
                    role="dialog"
                    aria-modal="true"
                    aria-label={t('filters')}
                    ref={sheetRef}
                    style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
                  >
                    <div className="px-5 pt-4 pb-3 border-b border-white/10 flex items-center justify-between">
                      <div className="font-accent text-xs tracking-[0.25em] uppercase text-gold">{t('filters')}</div>
                      <button
                        type="button"
                        ref={sheetCloseRef}
                        onClick={() => setIsSheetOpen(false)}
                        className="p-2 rounded-full hover:bg-white/5 text-silver hover:text-ivory transition-colors"
                        aria-label={t('close')}
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <div className="px-5 py-4 space-y-5">
                      <div>
                        <div className="text-[11px] text-ash uppercase tracking-wider font-mono mb-2">{t('filters')}</div>
                        <div className="flex flex-wrap gap-2">
                          {FILTERS.map((filter) => (
                            <button
                              key={filter.id}
                              onClick={() => onFilterToggle(filter.id)}
                              className={cn(
                                "px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-300 border flex items-center gap-1.5",
                                activeFilters.includes(filter.id)
                                  ? "bg-gold/20 text-gold border-gold/50"
                                  : "bg-transparent text-silver border-white/10 hover:border-white/30"
                              )}
                            >
                              <span>{filter.icon}</span>
                              {t(filter.id.replace('-', '_'))}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <div className="text-[11px] text-ash uppercase tracking-wider font-mono">{t('sort')}</div>
                          <div className="flex items-center gap-2 text-xs text-silver">
                            <ArrowUpDown size={12} />
                            <span className="text-ivory font-medium">
                              {sortOptions.find((o) => o.value === sortOption)?.label || t('sort_default')}
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          {sortOptions.map((opt) => {
                            const isActive = opt.value === sortOption;
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => onSortChange(opt.value)}
                                className={cn(
                                  "w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-colors",
                                  isActive
                                    ? "border-gold/50 bg-gold/10 text-gold"
                                    : "border-white/10 bg-obsidian/40 text-ivory hover:bg-white/5 hover:border-white/20"
                                )}
                              >
                                <span className="text-sm font-medium">{opt.label}</span>
                                {isActive ? <Check size={18} /> : <span className="w-[18px]" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <div className="text-[11px] text-ash uppercase tracking-wider font-mono">{t('view')}</div>
                        <div className="flex bg-white/5 rounded-lg p-0.5 w-fit">
                          <button 
                            onClick={() => onViewModeChange('grid')}
                            className={cn(
                              "px-3 py-1.5 rounded-md transition-all text-xs",
                              viewMode === 'grid' ? "bg-obsidian text-gold shadow-sm" : "text-silver hover:text-ivory"
                            )}
                          >
                            {t('view_grid')}
                          </button>
                          <button 
                            onClick={() => onViewModeChange('list')}
                            className={cn(
                              "px-3 py-1.5 rounded-md transition-all text-xs",
                              viewMode === 'list' ? "bg-obsidian text-gold shadow-sm" : "text-silver hover:text-ivory"
                            )}
                          >
                            {t('view_list')}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="px-5 pt-3 pb-4 border-t border-white/10 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => onClearFilters()}
                        disabled={activeFilters.length === 0}
                        className="flex-1 py-3 rounded-lg border border-white/10 text-ivory hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {t('clear')}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsSheetOpen(false)}
                        className="flex-1 py-3 rounded-lg bg-gold text-obsidian font-bold tracking-wider uppercase hover:bg-gold-light transition-colors"
                      >
                        {t('done')}
                      </button>
                    </div>
                  </motion.div>
                </>
              ) : null}
            </AnimatePresence>,
            document.body
          )
        : null}
    </div>
  );
}
