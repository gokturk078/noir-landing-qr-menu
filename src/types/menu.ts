export type CategoryId =
  | 'starters'
  | 'salads'
  | 'soups'
  | 'seafood'
  | 'steaks'
  | 'vegetarian'
  | 'pastas'
  | 'cheese'
  | 'desserts'
  | 'hot-drinks'
  | 'cold-drinks'
  | 'cocktails'
  | 'wines'
  | 'spirits';

export type BadgeType = 'chefs-choice' | 'new' | 'spicy' | 'vegetarian' | 'gluten-free' | 'popular' | 'vegan';

export interface Extra {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  categoryId: CategoryId;
  name: string;
  nameEn?: string;
  nameDe?: string;
  nameRu?: string;
  description: string;
  descriptionEn?: string;
  descriptionDe?: string;
  descriptionRu?: string;
  descriptionFr?: string; // Future proofing
  price: number;
  image: string;
  badges: BadgeType[];
  allergens: string[];
  calories?: number;
  isAvailable: boolean;
  preparationTime?: number;
  chefsNote?: string;
  chefsNoteEn?: string;
  chefsNoteDe?: string;
  chefsNoteRu?: string;
  extras?: Extra[];
  pairingSuggestions?: string[]; // IDs of suggested items
}

export interface Category {
  id: CategoryId;
  name: string;
  nameEn?: string;
  nameDe?: string;
  nameRu?: string;
  icon?: string;
}
