import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LocationsService } from "@/services/locations.service";
import type { Location } from "@/types";

// Query keys
export const locationKeys = {
  all: ["locations"] as const,
  lists: () => [...locationKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...locationKeys.lists(), { filters }] as const,
  details: () => [...locationKeys.all, "detail"] as const,
  detail: (id: string) => [...locationKeys.details(), id] as const,
  byCategory: (category: string) => [...locationKeys.lists(), "category", category] as const,
  bySubcategory: (subcategory: string) => [...locationKeys.lists(), "subcategory", subcategory] as const,
  search: (term: string) => [...locationKeys.lists(), "search", term] as const,
};

// Base hooks
export const useLocations = () => {
  return useQuery({
    queryKey: locationKeys.lists(),
    queryFn: () => LocationsService.getAllLocations(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useLocation = (id: string) => {
  return useQuery({
    queryKey: locationKeys.detail(id),
    queryFn: () => LocationsService.getLocationById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Category and subcategory hooks
export const useLocationsByCategory = (category: string) => {
  return useQuery({
    queryKey: locationKeys.byCategory(category),
    queryFn: () => LocationsService.getLocationsByCategory(category),
    enabled: !!category,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useLocationsBySubcategory = (subcategory: string) => {
  return useQuery({
    queryKey: locationKeys.bySubcategory(subcategory),
    queryFn: () => LocationsService.getLocationsBySubcategory(subcategory),
    enabled: !!subcategory,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Search hook
export const useSearchLocations = (searchTerm: string) => {
  return useQuery({
    queryKey: locationKeys.search(searchTerm),
    queryFn: () => LocationsService.searchLocations(searchTerm),
    enabled: searchTerm.length > 0,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Mutation hooks
export const useCreateLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (location: Omit<Location, 'id'>) =>
      LocationsService.createLocation(location),
    onSuccess: () => {
      // Invalidate all location queries
      queryClient.invalidateQueries({ queryKey: locationKeys.lists() });
    },
  });
};

export const useUpdateLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Location> }) =>
      LocationsService.updateLocation(id, updates),
    onSuccess: (updatedLocation) => {
      // Update the specific location cache
      queryClient.setQueryData(
        locationKeys.detail(updatedLocation.id),
        updatedLocation
      );
      // Invalidate all location queries
      queryClient.invalidateQueries({ queryKey: locationKeys.lists() });
    },
  });
};

export const useDeleteLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => LocationsService.deleteLocation(id),
    onSuccess: (_, id) => {
      // Remove the specific location from cache
      queryClient.removeQueries({ queryKey: locationKeys.detail(id) });
      // Invalidate all location queries
      queryClient.invalidateQueries({ queryKey: locationKeys.lists() });
    },
  });
};