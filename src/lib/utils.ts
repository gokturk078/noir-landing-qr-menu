import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { MenuItem } from "@/types/menu"
import { MENU_ITEM_DESCRIPTION_I18N } from "@/lib/data/menu-item-translations"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getLocalizedItem(item: MenuItem, language: string) {
  const baseLanguage = (language || 'tr').split('-')[0];

  // Start with default (Turkish)
  let name = item.name;
  let description = item.description;

  // Helper for safe translation lookup
  const getI18nDesc = (lang: 'en' | 'de' | 'ru') =>
    MENU_ITEM_DESCRIPTION_I18N[lang]?.[item.id];

  if (baseLanguage === 'en') {
    name = item.nameEn || item.name;
    description = item.descriptionEn || getI18nDesc('en') || item.description;
  } else if (baseLanguage === 'de') {
    name = item.nameDe || item.nameEn || item.name;
    description =
      item.descriptionDe ||
      item.descriptionEn ||
      getI18nDesc('de') ||
      getI18nDesc('en') ||
      item.description;
  } else if (baseLanguage === 'ru') {
    name = item.nameRu || item.nameEn || item.name;
    description =
      item.descriptionRu ||
      item.descriptionEn ||
      getI18nDesc('ru') ||
      getI18nDesc('en') ||
      item.description;
  }

  return { ...item, name, description };
}

export function getLocalizedCategory(category: any, language: string) {
  const baseLanguage = language.split('-')[0];
  let name = category.name;

  if (baseLanguage === 'en') {
    name = category.nameEn || category.name;
  } else if (baseLanguage === 'de') {
    name = category.nameDe || category.nameEn || category.name;
  } else if (baseLanguage === 'ru') {
    name = category.nameRu || category.nameEn || category.name;
  }

  return { ...category, name };
}
