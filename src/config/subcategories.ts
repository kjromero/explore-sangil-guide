import type { Category } from '@/components/FilterBar';

export const SUBCATEGORIES: Record<Category, string[]> = {
  todo: [],
  gastronomía: ['Restaurantes', 'Cafés', 'Bares'],
  aventura: ['Deportes Extremos', 'Naturaleza', 'Aire Libre'],
  cultura: ['Museos', 'Sitios Históricos', 'Arte'],
  tiendas: ['Artesanías', 'Servicios', 'Ropa'],
};

export const hasSubcategories = (category: Category): boolean => {
  return SUBCATEGORIES[category].length > 0;
};