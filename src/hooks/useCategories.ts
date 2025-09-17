import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoriesService } from "@/services/categories.service";
import type { Category } from "@/types";

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

export const useCategory = (id: string) => {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => CategoriesService.getCategoryById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useAllSubcategories = () => {
  return useQuery({
    queryKey: categoryKeys.subcategories(),
    queryFn: () => CategoriesService.getAllSubcategories(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Mutation hooks
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (category: Omit<Category, 'id'>) =>
      CategoriesService.createCategory(category),
    onSuccess: () => {
      // Invalidate all category queries
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.subcategories() });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Category> }) =>
      CategoriesService.updateCategory(id, updates),
    onSuccess: (updatedCategory) => {
      // Update the specific category cache
      queryClient.setQueryData(
        categoryKeys.detail(updatedCategory.id),
        updatedCategory
      );
      // Invalidate all category queries
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.subcategories() });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => CategoriesService.deleteCategory(id),
    onSuccess: (_, id) => {
      // Remove the specific category from cache
      queryClient.removeQueries({ queryKey: categoryKeys.detail(id) });
      // Invalidate all category queries
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.subcategories() });
    },
  });
};

export const useAddSubcategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryId, subcategory }: { categoryId: string; subcategory: string }) =>
      CategoriesService.addSubcategory(categoryId, subcategory),
    onSuccess: (updatedCategory) => {
      // Update the specific category cache
      queryClient.setQueryData(
        categoryKeys.detail(updatedCategory.id),
        updatedCategory
      );
      // Invalidate all category queries
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.subcategories() });
    },
  });
};

export const useRemoveSubcategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryId, subcategory }: { categoryId: string; subcategory: string }) =>
      CategoriesService.removeSubcategory(categoryId, subcategory),
    onSuccess: (updatedCategory) => {
      // Update the specific category cache
      queryClient.setQueryData(
        categoryKeys.detail(updatedCategory.id),
        updatedCategory
      );
      // Invalidate all category queries
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.subcategories() });
    },
  });
};