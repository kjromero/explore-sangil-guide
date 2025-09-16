import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
}

export class AuthService {
  private static auth = getAuth();

  // Sign in with email and password
  static async login(email: string, password: string): Promise<UserProfile> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      const user = userCredential.user;

      return {
        id: user.uid,
        email: user.email || '',
        name: user.displayName || user.email?.split('@')[0] || 'Usuario'
      };
    } catch (error) {
      console.error("Error signing in:", error);
      throw this.handleAuthError(error);
    }
  }

  // Sign out
  static async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error("Error signing out:", error);
      throw new Error("Error al cerrar sesión");
    }
  }

  // Get current user
  static getCurrentUser(): UserProfile | null {
    const user = this.auth.currentUser;
    if (!user) return null;

    return {
      id: user.uid,
      email: user.email || '',
      name: user.displayName || user.email?.split('@')[0] || 'Usuario'
    };
  }

  // Listen to auth state changes
  static onAuthStateChanged(callback: (user: UserProfile | null) => void): () => void {
    return onAuthStateChanged(this.auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        callback({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuario'
        });
      } else {
        callback(null);
      }
    });
  }

  // Handle Firebase auth errors
  private static handleAuthError(error: any): Error {
    const errorCode = error.code;
    const errorMessage = error.message;

    switch (errorCode) {
      case 'auth/user-not-found':
        return new Error('Usuario no encontrado');
      case 'auth/wrong-password':
        return new Error('Contraseña incorrecta');
      case 'auth/invalid-email':
        return new Error('Correo electrónico inválido');
      case 'auth/user-disabled':
        return new Error('Usuario deshabilitado');
      case 'auth/too-many-requests':
        return new Error('Demasiados intentos fallidos. Intente más tarde');
      case 'auth/network-request-failed':
        return new Error('Error de red. Verifique su conexión');
      default:
        return new Error('Error de autenticación. Intente nuevamente');
    } 
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return this.auth.currentUser !== null;
  }
}
