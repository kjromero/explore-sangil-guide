import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductsService } from "@/services/products.service";
import type { Product } from "@/types";

// Query keys
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
  byPriceRange: (min: number, max: number) => [...productKeys.lists(), "price", min, max] as const,
  search: (term: string) => [...productKeys.lists(), "search", term] as const,
};

// Base hooks
export const useProducts = () => {
  return useQuery({
    queryKey: productKeys.lists(),
    queryFn: () => ProductsService.getAllProducts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => ProductsService.getProductById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Price range hook
export const useProductsByPriceRange = (minPrice: number, maxPrice: number) => {
  return useQuery({
    queryKey: productKeys.byPriceRange(minPrice, maxPrice),
    queryFn: () => ProductsService.getProductsByPriceRange(minPrice, maxPrice),
    enabled: minPrice >= 0 && maxPrice > minPrice,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Search hook
export const useSearchProducts = (searchTerm: string) => {
  return useQuery({
    queryKey: productKeys.search(searchTerm),
    queryFn: () => ProductsService.searchProducts(searchTerm),
    enabled: searchTerm.length > 0,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Mutation hooks
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product: Omit<Product, 'id'>) =>
      ProductsService.createProduct(product),
    onSuccess: () => {
      // Invalidate all product queries
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Product> }) =>
      ProductsService.updateProduct(id, updates),
    onSuccess: (updatedProduct) => {
      // Update the specific product cache
      queryClient.setQueryData(
        productKeys.detail(updatedProduct.id),
        updatedProduct
      );
      // Invalidate all product queries
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ProductsService.deleteProduct(id),
    onSuccess: (_, id) => {
      // Remove the specific product from cache
      queryClient.removeQueries({ queryKey: productKeys.detail(id) });
      // Invalidate all product queries
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};