import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  Timestamp,
  query,
  orderBy
} from "firebase/firestore";
import type { DocumentSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Category } from "@/types";

const CATEGORIES_COLLECTION = "categories";

// Convert Firestore document to Category
const firestoreToCategory = (doc: DocumentSnapshot): Category => {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name,
    subcategories: data.subcategories || [],
    createdAt: data.createdAt?.toDate()?.toISOString() || new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate()?.toISOString() || new Date().toISOString(),
  };
};

// Convert Category to Firestore document format
const categoryToFirestore = (category: Omit<Category, 'id'>) => ({
  ...category,
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
});

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

  // Create new category
  static async createCategory(category: Omit<Category, 'id'>): Promise<Category> {
    try {
      const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), categoryToFirestore(category));
      return {
        id: docRef.id,
        ...category,
      };
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  }

  // Update category
  static async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    try {
      const docRef = doc(db, CATEGORIES_COLLECTION, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });

      const updatedDoc = await getDoc(docRef);
      return firestoreToCategory(updatedDoc);
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  }

  // Delete category
  static async deleteCategory(id: string): Promise<void> {
    try {
      const docRef = doc(db, CATEGORIES_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  }

  // Add subcategory to a category
  static async addSubcategory(categoryId: string, subcategory: string): Promise<Category> {
    try {
      const category = await this.getCategoryById(categoryId);
      if (!category) {
        throw new Error("Category not found");
      }

      const updatedSubcategories = [...category.subcategories, subcategory];
      return await this.updateCategory(categoryId, { subcategories: updatedSubcategories });
    } catch (error) {
      console.error("Error adding subcategory:", error);
      throw error;
    }
  }

  // Remove subcategory from a category
  static async removeSubcategory(categoryId: string, subcategory: string): Promise<Category> {
    try {
      const category = await this.getCategoryById(categoryId);
      if (!category) {
        throw new Error("Category not found");
      }

      const updatedSubcategories = category.subcategories.filter(sub => sub !== subcategory);
      return await this.updateCategory(categoryId, { subcategories: updatedSubcategories });
    } catch (error) {
      console.error("Error removing subcategory:", error);
      throw error;
    }
  }

  // Get all subcategories across all categories
  static async getAllSubcategories(): Promise<string[]> {
    try {
      const categories = await this.getAllCategories();
      const allSubcategories = categories.flatMap(category => category.subcategories);
      return [...new Set(allSubcategories)].sort();
    } catch (error) {
      console.error("Error fetching all subcategories:", error);
      throw error;
    }
  }
}