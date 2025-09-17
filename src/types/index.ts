export interface Category {
  id: string;
  name: string;
  subcategories: string[];
  createdAt: string;
  updatedAt: string;
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
