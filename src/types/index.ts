export interface Location {
  id: number;
  name: string;
  description: string;
  address: string;
  photo: string;
  mapsUrl: string;
  bookingUrl?: string;
  tags: string[];
  category: string;
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