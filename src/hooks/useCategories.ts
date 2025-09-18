import { useQuery } from "@tanstack/react-query";
import { CategoriesService } from "@/services/categories.service";
import type { Category, Subcategory } from "@/types";

// Query keys
export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...categoryKeys.lists(), { filters }] as const,
  details: () => [...categoryKeys.all, "detail"] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
  subcategories: () => [...categoryKeys.all, "subcategories"] as const,
};

// Base hooks
export const useCategories = () => {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: () => CategoriesService.getAllCategories(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useSubcategoriesByCategory = (categoryId: string) => {
  return useQuery<Subcategory[]>({
    queryKey: [...categoryKeys.subcategories(), categoryId],
    queryFn: () => CategoriesService.getSubcategoriesByCategory(categoryId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!categoryId,
  });
};