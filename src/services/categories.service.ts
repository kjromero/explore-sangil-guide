import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy
} from "firebase/firestore";
import type { DocumentSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Category, Subcategory } from "@/types";

const CATEGORIES_COLLECTION = "categories";

// Convert Firestore document to Category
const firestoreToCategory = (doc: DocumentSnapshot): Category => {
  const data = doc.data();
  return {
    id: data.slug,
    slug: data.slug || doc.id,
    name: data.name,
    subcategories: (data.subcategories || []).map((sub: Subcategory) => ({
      id: sub.id,
      name: sub.name,
      description: sub.description || '',
      createdAt: sub.createdAt,
      updatedAt: sub.updatedAt,
    })),
    createdAt: data.createdAt?.toDate()?.toISOString() || new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate()?.toISOString() || new Date().toISOString(),
  };
};


export class CategoriesService {
  // Get all categories
  static async getAllCategories(): Promise<Category[]> {
    try {
      const q = query(collection(db, CATEGORIES_COLLECTION), orderBy("name", "asc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => firestoreToCategory(doc));
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }

  // Get category by ID
  static async getCategoryById(id: string): Promise<Category | null> {
    try {
      const docRef = doc(db, CATEGORIES_COLLECTION, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return firestoreToCategory(docSnap);
      }
      return null;
    } catch (error) {
      console.error("Error fetching category:", error);
      throw error;
    }
  }

  // Get subcategories by category ID
  static async getSubcategoriesByCategory(categoryId: string): Promise<Subcategory[]> {
    try {
      const category = await this.getCategoryById(categoryId);
      if (!category) {
        return [];
      }
      return category.subcategories;
    } catch (error) {
      console.error("Error fetching subcategories by category:", error);
      throw error;
    }
  }

  // Get category name by ID (utility for display)
  static getCategoryNameById(categories: Category[], categoryId: string): string {
    const category = categories.find(cat => cat.slug === categoryId);
    return category ? category.name : categoryId;
  }

  // Get subcategory name by ID (utility for display)
  static getSubcategoryNameById(categories: Category[], subcategoryId?: string): string {
    if (!subcategoryId) return "";

    for (const category of categories) {
      const subcategory = category.subcategories.find(sub => sub.id === subcategoryId);
      if (subcategory) {
        return subcategory.name;
      }
    }

    return subcategoryId; // Fallback to ID if not found
  }
}
