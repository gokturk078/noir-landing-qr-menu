import { useEffect, useRef } from 'react';
import { CATEGORIES } from '@/lib/data/menu-data';
import { CategoryId } from '@/types/menu';
import { cn, getLocalizedCategory } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface CategoryNavProps {
  activeCategory: CategoryId;
  onCategoryChange: (id: CategoryId) => void;
}

export default function CategoryNav({ activeCategory, onCategoryChange }: CategoryNavProps) {
  const { i18n } = useTranslation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeButtonRef = useRef<HTMLButtonElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeButtonRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const button = activeButtonRef.current;

      const containerWidth = container.offsetWidth;
      const buttonLeft = button.offsetLeft;
      const buttonWidth = button.offsetWidth;

      const scrollLeft = buttonLeft - (containerWidth / 2) + (buttonWidth / 2);

      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  }, [activeCategory]);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const update = () => {
      document.documentElement.style.setProperty('--menu-category-height', `${el.offsetHeight}px`);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="sticky z-30 bg-obsidian/95 backdrop-blur-sm border-b border-white/5 py-2 shadow-md"
      style={{ top: 'var(--menu-header-height, 72px)' }}
    >
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto no-scrollbar px-4 gap-2 snap-x"
      >
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            ref={activeCategory === category.id ? activeButtonRef : null}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 snap-center border",
              activeCategory === category.id
                ? "bg-gold text-obsidian border-gold shadow-[0_0_15px_rgba(201,168,76,0.3)]"
                : "bg-white/5 text-silver border-white/5 hover:border-gold/30 hover:text-ivory"
            )}
          >
            <span className="text-lg">{category.icon}</span>
            <span className="uppercase tracking-wide font-accent text-xs font-bold">
              {getLocalizedCategory(category, i18n.language).name}
            </span>
          </button>
        ))}
      </div>

      {/* Fade Gradients */}
      <div className="absolute top-0 left-0 bottom-0 w-8 bg-gradient-to-r from-obsidian to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-obsidian to-transparent pointer-events-none" />
    </div>
  );
}
