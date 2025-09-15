// Utility functions for admin data management
// TODO: Replace with API calls in production

import type { Location } from "@/types";
import type { Category } from "@/components/FilterBar";

export interface AdminLocationData {
  id: number;
  name: string;
  description: string;
  address: string;
  photo: string;
  mapsUrl: string;
  bookingUrl?: string;
  tags: string[];
  category: Category;
  subcategory?: string;
  coordinates: [number, number];
}

// Temporary in-memory storage for new locations
// In production, this would be replaced with database operations
let tempLocations: AdminLocationData[] = [];

/**
 * Add a new location to temporary storage
 * This function should be replaced with API calls in production
 */
export const addLocation = async (location: AdminLocationData): Promise<AdminLocationData> => {
  // TODO: Replace with API call
  // Example: POST /api/locations
  
  // For now, add to temporary storage
  tempLocations.push(location);
  console.log("Location added to temporary storage:", location);
  
  return location;
};

/**
 * Get all locations (including temporary ones)
 */
export const getAllLocations = async (): Promise<AdminLocationData[]> => {
  // TODO: Replace with API call
  // Example: GET /api/locations
  
  // Load existing mock data
  const mockData = await import("@/data/mockData.json");
  
  // Convert mock data to AdminLocationData format
  const existingLocations: AdminLocationData[] = [];
  
  // Process each category from mock data
  Object.entries(mockData.default).forEach(([key, locations]: [string, unknown]) => {
    if (Array.isArray(locations)) {
      locations.forEach((location: unknown) => {
        if (location && typeof location === 'object' && 'id' in location) {
          existingLocations.push({
            ...location as Location,
            category: mapMockCategoryToCategory(key),
          });
        }
      });
    }
  });
  
  // Combine existing and temporary locations
  return [...existingLocations, ...tempLocations];
};

/**
 * Map mock data category keys to Category type
 */
const mapMockCategoryToCategory = (mockKey: string): Category => {
  const mapping: Record<string, Category> = {
    'gastronomy': 'gastronomía',
    'culture': 'cultura',
    'adventure': 'aventura',
    'shops': 'tiendas',
  };
  
  return mapping[mockKey] || 'gastronomía';
};

/**
 * Export data as JSON file
 */
export const exportData = async (): Promise<void> => {
  // TODO: Replace with API call
  // Example: GET /api/locations/export
  
  try {
    const mockData = await import("@/data/mockData.json");
    const dataStr = JSON.stringify(mockData.default, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "mockData-export.json";
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error exporting data:", error);
    throw new Error("No se pudieron exportar los datos");
  }
};

/**
 * Import data from JSON file
 */
export const importData = async (file: File): Promise<void> => {
  // TODO: Replace with API call
  // Example: POST /api/locations/import
  
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    console.log("Data imported:", data);
    
    // In production, this would send the data to the server
    // For now, just log it
  } catch (error) {
    console.error("Error importing data:", error);
    throw new Error("No se pudieron importar los datos. Verifique el formato del archivo.");
  }
};

/**
 * Get temporary locations (added in current session)
 */
export const getTempLocations = (): AdminLocationData[] => {
  return [...tempLocations];
};

/**
 * Clear temporary locations
 */
export const clearTempLocations = (): void => {
  tempLocations = [];
};

/**
 * Generate next available ID for a category
 */
export const generateNextId = async (category: Category): Promise<number> => {
  // TODO: Replace with API call
  // Example: GET /api/locations/next-id?category=gastronomía
  
  const mockData = await import("@/data/mockData.json");
  const categoryKey = category === 'gastronomía' ? 'gastronomy' : 
                     category === 'cultura' ? 'culture' :
                     category === 'aventura' ? 'adventure' : 'shops';
  
  const categoryLocations = mockData.default[categoryKey] || [];
  const maxId = Math.max(...categoryLocations.map((l: Location) => l.id), 0);
  
  return maxId + 1;
};
