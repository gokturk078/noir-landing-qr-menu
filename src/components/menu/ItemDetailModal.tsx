import { motion, AnimatePresence } from 'framer-motion';
import { MenuItem } from '@/types/menu';
import { X, ChefHat, Info, Flame, Leaf, Wheat, ArrowRight, Award, Phone } from 'lucide-react';
import { cn, getLocalizedItem } from '@/lib/utils';
import Image from '@/components/ui/Image';
import { useTranslation } from 'react-i18next';
import { MENU_ITEMS } from '@/lib/data/menu-data';
import { formatCurrency } from '@/lib/format';
import { useRef } from 'react';
import { useDialog } from '@/lib/hooks/useDialog';
import { RESTAURANT_INFO } from '@/lib/data/restaurant-data';
import { createPortal } from 'react-dom';
import Button from '@/components/ui/Button';

interface ItemDetailModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenDetail?: (item: MenuItem) => void; // Allow opening another item
}

export default function ItemDetailModal({ item, isOpen, onClose, onOpenDetail }: ItemDetailModalProps) {
  const { t, i18n } = useTranslation();
  const currentLanguage = (i18n.resolvedLanguage || i18n.language).split('-')[0];
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  if (!item) return null;

  const localizedItem = getLocalizedItem(item, i18n.language);
  const unitPrice = formatCurrency({ amount: item.price, language: i18n.language, currency: 'TRY' });

  const pairingItems = item.pairingSuggestions 
    ? MENU_ITEMS.filter(i => item.pairingSuggestions?.includes(i.id))
    : [];

  useDialog({ isOpen, onClose, containerRef: modalRef, initialFocusRef: closeButtonRef });

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-obsidian/80 backdrop-blur-sm z-[10000]"
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[10001] bg-charcoal rounded-t-2xl overflow-hidden max-h-[92vh] flex flex-col md:max-w-2xl md:mx-auto md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:rounded-2xl border border-white/10 shadow-2xl pb-[env(safe-area-inset-bottom)]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="item-detail-title"
            ref={modalRef}
          >
            <div className="h-1.5 w-12 rounded-full bg-white/10 mx-auto mt-3 mb-1 md:hidden" />

            <button
              onClick={onClose}
              ref={closeButtonRef}
              className="absolute top-4 right-4 z-10 p-2 bg-obsidian/50 backdrop-blur-md rounded-full text-ivory hover:bg-gold hover:text-obsidian transition-colors"
              aria-label={t('close')}
            >
              <X size={20} />
            </button>

            <div className="relative h-52 sm:h-64 md:h-80 shrink-0">
              <Image
                src={item.image}
                alt={localizedItem.name}
                className="w-full h-full object-cover"
                containerClassName="w-full h-full"
                sizes="(min-width: 768px) 640px, 100vw"
                maxWidth={1280}
                quality={72}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent" />
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto flex-grow">
              <div className="flex justify-between items-start gap-4 mb-2">
                <h2 id="item-detail-title" className="font-display italic text-2xl sm:text-3xl text-ivory leading-tight">
                  {localizedItem.name}
                </h2>
                <span className="font-mono text-lg sm:text-xl text-gold font-bold whitespace-nowrap">{unitPrice}</span>
              </div>

              {item.nameEn && currentLanguage !== 'en' ? (
                <p className="text-ash text-sm italic mb-4 font-serif">{item.nameEn}</p>
              ) : null}

              <div className="flex flex-wrap items-center gap-2 mb-5">
                {item.badges.map((badge) => (
                  <span
                    key={badge}
                    className="px-3 py-1 bg-white/5 rounded-full text-[11px] text-silver border border-white/10 uppercase tracking-wider"
                  >
                    {t(badge.replace('-', '_'))}
                  </span>
                ))}
                {item.allergens.map((allergen) => (
                  <span
                    key={allergen}
                    className="px-3 py-1 bg-rouge/10 text-rouge rounded-full text-[11px] border border-rouge/20 uppercase tracking-wider flex items-center gap-1"
                  >
                    ⚠️ {t(allergen, { defaultValue: allergen })}
                  </span>
                ))}
              </div>

              <p className="text-silver leading-relaxed font-light">{localizedItem.description}</p>

              {item.chefsNote ? (
                <div className="mt-6 bg-obsidian/50 p-4 rounded-lg border border-white/10">
                  <div className="flex items-center gap-2 text-gold mb-2">
                    <ChefHat size={16} />
                    <span className="font-accent text-xs uppercase tracking-widest">{t('chefs_note')}</span>
                  </div>
                  <p className="text-silver text-sm italic">"{item.chefsNote}"</p>
                </div>
              ) : null}

              {pairingItems.length > 0 ? (
                <div className="mt-6">
                  <h4 className="font-accent text-xs text-gold uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Award size={14} /> {t('pairing_suggestion')}
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {pairingItems.map((pItem) => {
                      const locPItem = getLocalizedItem(pItem, i18n.language);
                      return (
                        <button
                          type="button"
                          key={pItem.id}
                          className="flex items-center gap-3 p-2 bg-white/5 rounded-lg border border-white/10 hover:border-gold/30 transition-colors text-left"
                          onClick={() => onOpenDetail && onOpenDetail(pItem)}
                        >
                          <div className="w-12 h-12 rounded-md overflow-hidden shrink-0">
                            <Image
                              src={pItem.image}
                              alt={locPItem.name}
                              className="w-full h-full object-cover"
                              containerClassName="w-full h-full"
                              sizes="48px"
                              maxWidth={192}
                              quality={70}
                            />
                          </div>
                          <div className="overflow-hidden min-w-0">
                            <h5 className="text-ivory text-sm font-medium truncate">{locPItem.name}</h5>
                            <span className="text-gold text-xs font-mono">
                              {formatCurrency({ amount: pItem.price, language: i18n.language, currency: 'TRY' })}
                            </span>
                          </div>
                          <ArrowRight size={14} className="ml-auto text-white/20 shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="p-4 border-t border-white/10 bg-obsidian/60 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <Button asChild className="flex-1 gap-2">
                  <a href={`tel:${RESTAURANT_INFO.phone}`}>
                    <Phone size={16} />
                    {t('call_restaurant')}
                  </a>
                </Button>
                <Button variant="secondary" onClick={onClose} className="px-4">
                  {t('close')}
                </Button>
              </div>
              <div className="mt-2 text-[11px] text-ash">{t('call_restaurant_hint')}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
