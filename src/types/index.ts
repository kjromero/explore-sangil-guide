export interface Location {
  id: string;
  name: string;
  description: string;
  address: string;
  photo: string;
  mapsUrl: string;
  bookingUrl?: string;
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
