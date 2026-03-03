import { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MenuHeader from '@/components/menu/MenuHeader';
import CategoryNav from '@/components/menu/CategoryNav';
import FilterBar from '@/components/menu/FilterBar';
import MenuGrid from '@/components/menu/MenuGrid';
import ItemDetailModal from '@/components/menu/ItemDetailModal';
import SearchBar from '@/components/menu/SearchBar';
import { MENU_ITEMS } from '@/lib/data/menu-data';
import { MenuItem, CategoryId, BadgeType } from '@/types/menu';
import { useTranslation } from 'react-i18next';
import { getLocalizedItem } from '@/lib/utils';

export default function MenuPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language;
  
  // State
  const [activeCategory, setActiveCategory] = useState<CategoryId>('starters');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<BadgeType[]>([]);
  const [sortOption, setSortOption] = useState('default');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isGridLoading, setIsGridLoading] = useState(true);
  
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Sync URL with Category
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category') as CategoryId;
    if (category) {
      setActiveCategory(category);
    }
  }, [location.search]);

  const handleCategoryChange = (id: CategoryId) => {
    setActiveCategory(id);
    navigate(`/menu?category=${id}`, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtering Logic
  const filteredItems = useMemo(() => {
    let items = MENU_ITEMS;
    const query = searchQuery.trim().toLowerCase();

    // 1. Category Filter (only if not searching)
    if (!searchQuery) {
      items = items.filter(item => item.categoryId === activeCategory);
    }

    // 2. Search Filter
    if (query) {
      items = items.filter(item => {
        const localized = getLocalizedItem(item, language);
        const haystack = [
          localized.name,
          localized.description,
          item.name,
          item.description,
          item.nameEn,
          item.descriptionEn,
          item.nameDe,
          item.descriptionDe,
          item.nameRu,
          item.descriptionRu,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return haystack.includes(query);
      });
    }

    // 3. Badge Filters
    if (activeFilters.length > 0) {
      items = items.filter(item => 
        activeFilters.every(filter => item.badges.includes(filter))
      );
    }

    // 4. Sorting
    switch (sortOption) {
      case 'price-asc':
        items = [...items].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        items = [...items].sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        items = [...items].sort((a, b) => {
          const aName = getLocalizedItem(a, language).name;
          const bName = getLocalizedItem(b, language).name;
          return aName.localeCompare(bName);
        });
        break;
      default:
        // Default sorting (by ID or original order)
        break;
    }

    return items;
  }, [activeCategory, searchQuery, activeFilters, sortOption, language]);

  const handleFilterToggle = (filter: BadgeType) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter) 
        : [...prev, filter]
    );
  };

  useEffect(() => {
    setIsGridLoading(true);
    const id = window.setTimeout(() => setIsGridLoading(false), 220);
    return () => window.clearTimeout(id);
  }, [activeCategory, searchQuery, activeFilters, sortOption, viewMode]);

  const clearFilters = () => setActiveFilters([]);

  const openDetail = (item: MenuItem) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
    // Delay clearing item to allow exit animation
    setTimeout(() => setSelectedItem(null), 300);
  };

  return (
    <div className="bg-obsidian min-h-screen text-ivory font-body pb-[calc(env(safe-area-inset-bottom)+1rem)]">
      <div className="noise-overlay" />
      
      <MenuHeader 
        onSearchClick={() => setIsSearchOpen(true)} 
      />
      
      <CategoryNav 
        activeCategory={activeCategory} 
        onCategoryChange={handleCategoryChange} 
      />
      
      <FilterBar 
        activeFilters={activeFilters} 
        onFilterToggle={handleFilterToggle}
        onClearFilters={clearFilters}
        sortOption={sortOption}
        onSortChange={setSortOption}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <main className="container mx-auto px-4 py-4 md:py-6">
        <MenuGrid 
          items={filteredItems} 
          viewMode={viewMode} 
          onOpenDetail={openDetail}
          isLoading={isGridLoading}
        />
      </main>

      {/* Modals & Drawers */}
      <ItemDetailModal 
        item={selectedItem} 
        isOpen={isDetailOpen} 
        onClose={closeDetail} 
        onOpenDetail={openDetail}
      />
      
      <SearchBar 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onSearch={setSearchQuery} 
      />
    </div>
  );
}
