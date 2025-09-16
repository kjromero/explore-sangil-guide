import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  Timestamp
} from "firebase/firestore";
import type { DocumentSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Location } from "@/types";

const LOCATIONS_COLLECTION = "locations";

// Convert Location to Firestore document format
const locationToFirestore = (location: Omit<Location, 'id'>) => ({
  ...location,
  latitude: location.coordinates[0],
  longitude: location.coordinates[1],
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
});

// Convert Firestore document to Location
const firestoreToLocation = (doc: DocumentSnapshot): Location => {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name,
    description: data.description,
    address: data.address,
    photo: data.photo,
    mapsUrl: data.mapsUrl,
    bookingUrl: data.bookingUrl,
    tags: data.tags || [], 
    category: data.category,
    subcategory: data.subcategory,
    coordinates: [data.latitude, data.longitude],
  };
};

export class LocationsService {
  // Get all locations
  static async getAllLocations(): Promise<Location[]> {
    try {
      const querySnapshot = await getDocs(collection(db, LOCATIONS_COLLECTION));
      return querySnapshot.docs.map(doc => firestoreToLocation(doc));
    } catch (error) {
      console.error("Error fetching locations:", error);
      throw error;
    }
  }

  // Get location by ID
  static async getLocationById(id: string): Promise<Location | null> {
    try {
      const docRef = doc(db, LOCATIONS_COLLECTION, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return firestoreToLocation(docSnap);
      }
      return null;
    } catch (error) {
      console.error("Error fetching location:", error);
      throw error;
    }
  }

  // Create new location
  static async createLocation(location: Omit<Location, 'id'>): Promise<Location> {
    try {
      const docRef = await addDoc(collection(db, LOCATIONS_COLLECTION), locationToFirestore(location));
      return {
        id: docRef.id,
        ...location,
      };
    } catch (error) {
      console.error("Error creating location:", error);
      throw error;
    }
  }

  // Update location
  static async updateLocation(id: string, updates: Partial<Location>): Promise<Location> {
    try {
      const docRef = doc(db, LOCATIONS_COLLECTION, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });

      const updatedDoc = await getDoc(docRef);
      return firestoreToLocation(updatedDoc);
    } catch (error) {
      console.error("Error updating location:", error);
      throw error;
    }
  }

  // Delete location
  static async deleteLocation(id: string): Promise<void> {
    try {
      const docRef = doc(db, LOCATIONS_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting location:", error);
      throw error;
    }
  }

  // Get locations by category
  static async getLocationsByCategory(category: string): Promise<Location[]> {
    try {
      const querySnapshot = await getDocs(collection(db, LOCATIONS_COLLECTION));
      return querySnapshot.docs
        .map(doc => firestoreToLocation(doc))
        .filter(location => location.category === category);
    } catch (error) {
      console.error("Error fetching locations by category:", error);
      throw error;
    }
  }

  // Get locations by subcategory
  static async getLocationsBySubcategory(subcategory: string): Promise<Location[]> {
    try {
      const querySnapshot = await getDocs(collection(db, LOCATIONS_COLLECTION));
      return querySnapshot.docs
        .map(doc => firestoreToLocation(doc))
        .filter(location => location.subcategory === subcategory);
    } catch (error) {
      console.error("Error fetching locations by subcategory:", error);
      throw error;
    }
  }

  // Search locations
  static async searchLocations(searchTerm: string): Promise<Location[]> {
    try {
      // Note: Firestore doesn't support native text search
      // This is a simple implementation that searches in name and description
      // For production, consider using Algolia or Cloud Search
      const allLocations = await this.getAllLocations();
      const term = searchTerm.toLowerCase();

      return allLocations.filter(location =>
        location.name.toLowerCase().includes(term) ||
        location.description.toLowerCase().includes(term) ||
        location.address.toLowerCase().includes(term) ||
        location.tags.some(tag => tag.toLowerCase().includes(term))
      );
    } catch (error) {
      console.error("Error searching locations:", error);
      throw error;
    }
  }
}
