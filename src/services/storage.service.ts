import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  StorageError,
  FullMetadata
} from "firebase/storage";
import { storage } from "@/lib/firebase";

// Allowed image types and their MIME types
const ALLOWED_IMAGE_TYPES = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
} as const;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const STORAGE_PATH = 'locations';

export interface UploadResult {
  downloadUrl: string;
  fileName: string;
  fullPath: string;
  size: number;
  contentType: string;
}

export interface StorageError {
  code: string;
  message: string;
  details?: unknown;
}

/**
 * Validates a file before upload
 * @param file The file to validate
 * @returns Object with validation result and error message if invalid
 */
export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `El archivo es demasiado grande. El tamaño máximo es ${MAX_FILE_SIZE / 1024 / 1024}MB`
    };
  }

  // Check file type
  if (!Object.keys(ALLOWED_IMAGE_TYPES).includes(file.type)) {
    return {
      isValid: false,
      error: `Tipo de archivo no permitido. Solo se permiten: ${Object.values(ALLOWED_IMAGE_TYPES).join(', ')}`
    };
  }

  return { isValid: true };
}

/**
 * Generates a unique filename for storage
 * @param file The original file
 * @param locationId Optional location ID for better organization
 * @returns Generated filename
 */
export function generateStorageFileName(file: File, locationId?: string): string {
  const timestamp = Date.now();
  const uuid = Math.random().toString(36).substring(2, 15);
  const extension = ALLOWED_IMAGE_TYPES[file.type as keyof typeof ALLOWED_IMAGE_TYPES] || '.jpg';

  const prefix = locationId ? `${locationId}-` : '';
  return `${prefix}${timestamp}-${uuid}${extension}`;
}

/**
 * Uploads an image file to Firebase Storage
 * @param file The file to upload
 * @param locationId Optional location ID
 * @returns Promise that resolves with upload result
 */
export async function uploadLocationImage(
  file: File,
  locationId?: string
): Promise<UploadResult> {
  try {
    // Validate file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    // Generate filename and storage reference
    const fileName = generateStorageFileName(file, locationId);
    const storageRef = ref(storage, `${STORAGE_PATH}/${fileName}`);

    // Upload file
    const snapshot = await uploadBytes(storageRef, file, {
      contentType: file.type,
      customMetadata: {
        'uploadedAt': new Date().toISOString(),
        'originalName': file.name,
        'locationId': locationId || 'unknown',
      }
    });

    // Get download URL
    const downloadUrl = await getDownloadURL(snapshot.ref);

    return {
      downloadUrl,
      fileName,
      fullPath: snapshot.ref.fullPath,
      size: snapshot.metadata.size || file.size,
      contentType: snapshot.metadata.contentType || file.type
    };

  } catch (error) {
    console.error('Error uploading image:', error);

    // Convert Firebase Storage errors to user-friendly messages
    if (error instanceof Error) {
      if (error.message.includes('storage/unauthorized')) {
        throw new Error('No tienes permiso para subir archivos. Por favor, contacta al administrador.');
      } else if (error.message.includes('storage/canceled')) {
        throw new Error('La subida fue cancelada.');
      } else if (error.message.includes('storage/unknown')) {
        throw new Error('Error desconocido al subir el archivo. Por favor, intenta de nuevo.');
      } else {
        throw new Error(error.message);
      }
    }

    throw new Error('Error al subir la imagen. Por favor, intenta de nuevo.');
  }
}

/**
 * Deletes a file from Firebase Storage
 * @param fullPath The full path to the file in storage
 * @returns Promise that resolves when deletion is complete
 */
export async function deleteLocationImage(fullPath: string): Promise<void> {
  try {
    const storageRef = ref(storage, fullPath);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting image:', error);

    // Don't throw errors for non-existent files (already deleted)
    if (error instanceof Error && error.message.includes('storage/object-not-found')) {
      return;
    }

    throw new Error('Error al eliminar la imagen. Por favor, intenta de nuevo.');
  }
}

/**
 * Gets file metadata from a storage path
 * @param fullPath The full path to the file
 * @returns Promise with file metadata
 */
export async function getFileMetadata(fullPath: string): Promise<FullMetadata> {
  try {
    const storageRef = ref(storage, fullPath);
    const metadata = await getDownloadURL(storageRef).then(() => {
      // Note: Firebase Storage doesn't have a direct getMetadata method in the SDK
      // This is a workaround - in production, you might want to use the admin SDK
      // or store metadata in Firestore
      throw new Error('Metadata retrieval not implemented in client SDK');
    });
    return metadata;
  } catch (error) {
    console.error('Error getting file metadata:', error);
    throw new Error('Error al obtener información del archivo.');
  }
}

/**
 * Utility function to check if a URL is a Firebase Storage URL
 * @param url The URL to check
 * @returns True if it's a Firebase Storage URL
 */
export function isFirebaseStorageUrl(url: string): boolean {
  return url.includes('firebasestorage.googleapis.com') ||
         url.includes('storage.googleapis.com');
}

/**
 * Utility function to extract file path from Firebase Storage URL
 * @param url The Firebase Storage URL
 * @returns The file path or null if not a valid URL
 */
export function extractPathFromStorageUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathMatch = urlObj.pathname.match(/\/o\/(.*?)\?/);
    return pathMatch ? decodeURIComponent(pathMatch[1]) : null;
  } catch {
    return null;
  }
}

/**
 * Cleans up old images when updating a location
 * @param oldPhotoUrl The old photo URL
 * @param newPhotoUrl The new photo URL
 * @returns Promise that resolves when cleanup is complete
 */
export async function cleanupOldImage(oldPhotoUrl: string, newPhotoUrl: string): Promise<void> {
  // Skip if URLs are the same or if old URL is not a Firebase Storage URL
  if (oldPhotoUrl === newPhotoUrl || !isFirebaseStorageUrl(oldPhotoUrl)) {
    return;
  }

  const oldPath = extractPathFromStorageUrl(oldPhotoUrl);
  if (oldPath) {
    try {
      await deleteLocationImage(oldPath);
    } catch (error) {
      console.warn('Failed to cleanup old image:', error);
      // Don't throw here - we don't want to block the update if cleanup fails
    }
  }
}