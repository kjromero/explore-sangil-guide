// Utility functions for admin data management
// TODO: Replace with API calls in production

import type { Location } from "@/types";

// Temporary in-memory storage for new locations
let tempLocations: Location[] = [];

/**
 * Add a new location to temporary storage.
 * In a real app, this would be a POST request to an API.
 */
export const addLocation = async (location: Location): Promise<Location> => {
  tempLocations.push(location);
  console.log("Location added to temporary storage:", location);
  return location;
};

/**
 * Get all locations from the JSON file.
 * In a real app, this would be a GET request to /api/locations.
 */
export const getAllLocations = async (): Promise<Location[]> => {
  const response = await import("@/data/locations.json");
  const existingLocations = (response.default as unknown as Location[]) || [];
  return [...existingLocations, ...tempLocations];
};

/**
 * Creates a downloadable JSON file of the current locations.
 */
export const exportData = async (): Promise<void> => {
  try {
    const response = await import("@/data/locations.json");
    const dataStr = JSON.stringify(response.default, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "locations-export.json";
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error exporting data:", error);
    throw new Error("No se pudieron exportar los datos");
  }
};

/**
 * Get temporary locations that have been added in the current session.
 */
export const getTempLocations = (): Location[] => {
  return [...tempLocations];
};

/**
 * Generate the next available location ID based on existing IDs.
 */
export const generateNextId = async (): Promise<string> => {
  const response = await import("@/data/locations.json");
  const allLocations = (response.default as unknown as Location[]) || [];
  
  const maxId = allLocations.reduce((max, loc) => {
    // Safely parse the numeric part of the ID
    const currentId = parseInt(loc.id.replace('loc-', ''), 10);
    return !isNaN(currentId) && currentId > max ? currentId : max;
  }, 0);
  
  return `loc-${maxId + 1}`;
};