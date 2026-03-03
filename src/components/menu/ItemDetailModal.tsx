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

  // We keep a reference to the last non-null item to allow exit animations to show the data
  const lastItemRef = useRef<MenuItem | null>(null);
  if (item) lastItemRef.current = item;

  const displayItem = item || lastItemRef.current;

  useDialog({ isOpen, onClose, containerRef: modalRef, initialFocusRef: closeButtonRef });

  if (typeof document === 'undefined') return null;

  const getLocalizedContent = (it: MenuItem | null) => {
    if (!it) return null;
    const loc = getLocalizedItem(it, i18n.language);

    // Localized chefsNote
    let chefsNote = it.chefsNote;
    if (currentLanguage === 'en') chefsNote = it.chefsNoteEn || it.chefsNote;
    else if (currentLanguage === 'de') chefsNote = it.chefsNoteDe || it.chefsNoteEn || it.chefsNote;
    else if (currentLanguage === 'ru') chefsNote = it.chefsNoteRu || it.chefsNoteEn || it.chefsNote;

    return { ...loc, chefsNote };
  };

  const localizedItem = getLocalizedContent(displayItem);
  const unitPrice = displayItem
    ? formatCurrency({ amount: displayItem.price, language: i18n.language, currency: 'TRY' })
    : '';

  const pairingItems = displayItem?.pairingSuggestions
    ? MENU_ITEMS.filter(i => displayItem.pairingSuggestions?.includes(i.id))
    : [];

  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && displayItem && localizedItem && (
        <div className="fixed inset-0 z-[10000] flex items-end justify-center sm:items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-obsidian/40 backdrop-blur-md"
          />

          <motion.div
            initial={{ y: '100%', opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300, mass: 0.8 }}
            className="relative w-full z-10 bg-charcoal/90 backdrop-blur-xl rounded-t-3xl overflow-hidden max-h-[94vh] flex flex-col md:max-w-2xl md:mx-4 md:rounded-3xl border border-white/10 shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.5)] pb-[env(safe-area-inset-bottom)]"
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

              {localizedItem.chefsNote ? (
                <div className="mt-6 bg-white/5 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-gold mb-2">
                    <ChefHat size={16} />
                    <span className="font-accent text-[10px] uppercase tracking-[0.2em]">{t('chefs_note')}</span>
                  </div>
                  <p className="text-silver/90 text-sm italic font-serif leading-relaxed">"{localizedItem.chefsNote}"</p>
                </div>
              ) : null}

              {pairingItems.length > 0 ? (
                <div className="mt-8">
                  <h4 className="font-accent text-[10px] text-gold uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <Award size={14} /> {t('pairing_suggestion')}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {pairingItems.map((pItem) => {
                      const locPItem = getLocalizedItem(pItem, i18n.language);
                      return (
                        <button
                          type="button"
                          key={pItem.id}
                          className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-gold/30 hover:bg-white/10 transition-all duration-300 group text-left"
                          onClick={() => onOpenDetail && onOpenDetail(pItem)}
                        >
                          <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-white/10">
                            <Image
                              src={pItem.image}
                              alt={locPItem.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              containerClassName="w-full h-full"
                              sizes="56px"
                              maxWidth={192}
                              quality={70}
                            />
                          </div>
                          <div className="overflow-hidden min-w-0 flex-grow">
                            <h5 className="text-ivory text-sm font-medium truncate mb-0.5">{locPItem.name}</h5>
                            <span className="text-gold/90 text-xs font-mono font-bold">
                              {formatCurrency({ amount: pItem.price, language: i18n.language, currency: 'TRY' })}
                            </span>
                          </div>
                          <ArrowRight size={16} className="ml-auto text-white/20 group-hover:text-gold group-hover:translate-x-1 transition-all" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="p-5 border-t border-white/5 bg-charcoal/50 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <Button asChild className="flex-1 h-12 rounded-xl bg-gold text-obsidian hover:bg-gold/90 transition-colors shadow-lg shadow-gold/10">
                  <a href={`tel:${RESTAURANT_INFO.phone}`} className="flex items-center justify-center gap-2 font-bold uppercase tracking-wider text-xs">
                    <Phone size={16} />
                    {t('call_restaurant')}
                  </a>
                </Button>
                <Button variant="secondary" onClick={onClose} className="px-6 h-12 rounded-xl border-white/10 hover:bg-white/5 transition-colors">
                  {t('close')}
                </Button>
              </div>
              <div className="mt-3 text-[10px] text-ash text-center uppercase tracking-widest opacity-60">
                {t('call_restaurant_hint')}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
