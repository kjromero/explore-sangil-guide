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
import type { Product } from "@/types";

const PRODUCTS_COLLECTION = "products";

// Convert Product to Firestore document format
const productToFirestore = (product: Omit<Product, 'id'>) => ({
  ...product,
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
});

// Convert Firestore document to Product
const firestoreToProduct = (doc: DocumentSnapshot): Product => {
  const data = doc.data();
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    price: data.price,
    image: data.image,
    instagramUrl: data.instagramUrl,
  };
};

export class ProductsService {
  // Get all products
  static async getAllProducts(): Promise<Product[]> {
    try {
      const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
      return querySnapshot.docs.map(doc => firestoreToProduct(doc));
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  // Get product by ID
  static async getProductById(id: number): Promise<Product | null> {
    try {
      const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
      const products = querySnapshot.docs.map(doc => firestoreToProduct(doc));
      return products.find(product => product.id === id) || null;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  }

  // Create new product
  static async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    try {
      // Generate next available ID
      const allProducts = await this.getAllProducts();
      const maxId = allProducts.reduce((max, p) => Math.max(max, p.id), 0);
      const newId = maxId + 1;

      const productWithId = {
        ...product,
        id: newId,
      };

      const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION),
        productToFirestore(productWithId)
      );

      return productWithId;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }

  // Update product
  static async updateProduct(id: number, updates: Partial<Product>): Promise<Product> {
    try {
      const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
      const products = querySnapshot.docs.map(doc => firestoreToProduct(doc));
      const productDoc = querySnapshot.docs.find(doc => {
        const product = firestoreToProduct(doc);
        return product.id === id;
      });

      if (!productDoc) {
        throw new Error(`Product with ID ${id} not found`);
      }

      const docRef = productDoc.ref;
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });

      const updatedDoc = await getDoc(docRef);
      return firestoreToProduct(updatedDoc);
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }

  // Delete product
  static async deleteProduct(id: number): Promise<void> {
    try {
      const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
      const productDoc = querySnapshot.docs.find(doc => {
        const product = firestoreToProduct(doc);
        return product.id === id;
      });

      if (!productDoc) {
        throw new Error(`Product with ID ${id} not found`);
      }

      await deleteDoc(productDoc.ref);
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }

  // Get products by price range
  static async getProductsByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]> {
    try {
      // Note: This is a client-side filter since Firestore doesn't support
      // querying by string price values. In production, consider storing
      // prices as numbers for better querying capabilities.
      const allProducts = await this.getAllProducts();

      return allProducts.filter(product => {
        const price = parseInt(product.price.replace(/[^\d]/g, ''), 10);
        return price >= minPrice && price <= maxPrice;
      });
    } catch (error) {
      console.error("Error fetching products by price range:", error);
      throw error;
    }
  }

  // Search products
  static async searchProducts(searchTerm: string): Promise<Product[]> {
    try {
      const allProducts = await this.getAllProducts();
      const term = searchTerm.toLowerCase();

      return allProducts.filter(product =>
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.price.toLowerCase().includes(term)
      );
    } catch (error) {
      console.error("Error searching products:", error);
      throw error;
    }
  }
}