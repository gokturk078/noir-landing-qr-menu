import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDialog } from '@/lib/hooks/useDialog';

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
}

export default function SearchBar({ isOpen, onClose, onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useDialog({ isOpen, onClose, containerRef, initialFocusRef: inputRef, lockScroll: false });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-0 left-0 right-0 z-50 bg-obsidian border-b border-white/10 px-4 pb-4 pt-[calc(env(safe-area-inset-top)+1rem)] shadow-2xl"
          role="dialog"
          aria-modal="true"
          aria-label={t('search_placeholder')}
          ref={containerRef}
        >
          <div className="container mx-auto relative flex items-center gap-4">
            <Search className="text-gold" size={24} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleSearch}
              placeholder={t('search_placeholder')}
              className="w-full bg-transparent text-ivory text-lg placeholder:text-ash outline-none border-none font-body"
            />
            <button 
              onClick={clearSearch}
              className="p-2 bg-white/5 rounded-full text-silver hover:text-ivory hover:bg-white/10 transition-colors"
              aria-label={t('close')}
            >
              <X size={20} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
