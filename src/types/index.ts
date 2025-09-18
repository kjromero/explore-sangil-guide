export interface Subcategory {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  subcategories: Subcategory[];
  createdAt: string;
  updatedAt: string;
}

export interface CategoryOption {
  id: string;
  label: string;
  value: string;
}

export interface SubcategoryOption {
  id: string;
  label: string;
  value: string;
  categoryId: string;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  address: string;
  photo: string;
  mapsUrl: string;
  wazeUrl: string;
  customUrl?: string;
  tags: string[];
  category: string;
  subcategory?: string;
  coordinates: [number, number];
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  instagramUrl: string;
}
