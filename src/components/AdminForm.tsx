"use client";

import { useState, useMemo, useEffect } from "react";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { MapPin, Plus, X, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import type { Location } from "@/types";
import { useCategories, useSubcategoriesByCategory } from "@/hooks/useCategories";
import { CategoriesService } from "@/services/categories.service";
import { uploadLocationImage, validateImageFile } from "@/services/storage.service";

// Zod schema for location validation
const locationSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  address: z.string().min(5, "La dirección debe tener al menos 5 caracteres"),
  photo: z.string().min(1, "La foto es requerida"),
  customUrl: z.string().url("Ingrese una URL válida").optional().or(z.literal("")),
  category: z.string().min(1, "La categoría es requerida"),
  subcategory: z.string().optional(),
  coordinates: z.tuple([z.number(), z.number()])
    .refine(([lat, _lng]) => lat >= -90 && lat <= 90, "La latitud debe estar entre -90 y 90")
    .refine(([_lat, lng]) => lng >= -180 && lng <= 180, "La longitud debe estar entre -180 y 180"),
  tags: z.array(z.string()).min(1, "Debe agregar al menos una etiqueta"),
});

interface ImageUploadState {
  file: File | null;
  previewUrl: string | null;
  isUploading: boolean;
  error: string | null;
}

type LocationFormData = z.infer<typeof locationSchema>;

interface AdminFormProps {
  onLocationAdd: (location: Omit<Location, 'id'>) => Promise<void>;
  onLocationUpdate?: (id: string, updates: Partial<Location>) => Promise<void>;
  editingLocation?: Location | null;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function AdminForm({ onLocationAdd, onLocationUpdate, editingLocation, onCancel, isLoading = false }: AdminFormProps) {
  const [newTag, setNewTag] = useState("");
  const [imageUpload, setImageUpload] = useState<ImageUploadState>({
    file: null,
    previewUrl: null,
    isUploading: false,
    error: null,
  });
  const { data: categories = [] } = useCategories();
  const isEditing = !!editingLocation;

  const form = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      photo: "",
      customUrl: "",
      category: "",
      subcategory: "",
      coordinates: [],
      tags: [],
    },
  });

  // Populate form when editing
  React.useEffect(() => {
    if (editingLocation) {
      form.reset({
        name: editingLocation.name,
        description: editingLocation.description,
        address: editingLocation.address,
        photo: editingLocation.photo,
        customUrl: editingLocation.customUrl || "",
        category: editingLocation.category,
        subcategory: editingLocation.subcategory || "",
        coordinates: editingLocation.coordinates,
        tags: editingLocation.tags,
      });

      // Set preview URL if it's a Firebase Storage URL
      setImageUpload(prev => ({
        ...prev,
        previewUrl: editingLocation.photo,
        file: null,
        error: null,
      }));
    } else {
      form.reset();
      setImageUpload({
        file: null,
        previewUrl: null,
        isUploading: false,
        error: null,
      });
    }
  }, [editingLocation, form]);

  const watchedCategory = form.watch("category");
  const watchedTags = form.watch("tags");

  // Get subcategories for the selected category
  const { data: subcategories = [] } = useSubcategoriesByCategory(watchedCategory);

  // Get categories from Firebase
  const existingCategories = useMemo(() => {
    return categories.map(cat => cat.slug);
  }, [categories]);

  const handleAddTag = () => {
    if (newTag.trim() && !watchedTags.includes(newTag.trim())) {
      form.setValue("tags", [...watchedTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    form.setValue("tags", watchedTags.filter(tag => tag !== tagToRemove));
  };

  // Image upload handlers
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setImageUpload(prev => ({
        ...prev,
        error: validation.error,
        file: null,
        previewUrl: null,
      }));
      toast.error(validation.error);
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);

    setImageUpload(prev => ({
      ...prev,
      file,
      previewUrl,
      error: null,
    }));

    form.setValue("photo", previewUrl);
  };

  const handleImageRemove = () => {
    // Clean up preview URL
    if (imageUpload.previewUrl) {
      URL.revokeObjectURL(imageUpload.previewUrl);
    }

    setImageUpload({
      file: null,
      previewUrl: null,
      isUploading: false,
      error: null,
    });

    form.setValue("photo", "");
  };

  // Clean up preview URLs on unmount
  useEffect(() => {
    return () => {
      if (imageUpload.previewUrl) {
        URL.revokeObjectURL(imageUpload.previewUrl);
      }
    };
  }, [imageUpload.previewUrl]);

  const onSubmit = async (data: LocationFormData) => {
    try {
      let finalPhotoUrl = data.photo;

      // If we have a new file to upload, upload it first
      if (imageUpload.file) {
        setImageUpload(prev => ({ ...prev, isUploading: true, error: null }));

        try {
          const uploadResult = await uploadLocationImage(
            imageUpload.file,
            editingLocation?.id
          );
          finalPhotoUrl = uploadResult.downloadUrl;
          toast.success("Imagen subida exitosamente");
        } catch (uploadError) {
          const errorMessage = uploadError instanceof Error ? uploadError.message : "Error al subir la imagen";
          setImageUpload(prev => ({ ...prev, error: errorMessage, isUploading: false }));
          toast.error(errorMessage);
          return;
        } finally {
          setImageUpload(prev => ({ ...prev, isUploading: false }));
        }
      }

      // Check if we have a valid image
      if (!finalPhotoUrl) {
        toast.error("Por favor, selecciona una imagen antes de guardar");
        return;
      }

      const locationData = {
        ...data,
        photo: finalPhotoUrl,
        subcategory: data.subcategory || undefined,
      };

      if (isEditing && editingLocation && onLocationUpdate) {
        // Update existing location
        await onLocationUpdate(editingLocation.id, locationData);
        toast.success("¡Ubicación actualizada exitosamente!");
      } else {
        // Add new location
        const newLocation: Omit<Location, 'id'> = locationData;

        await onLocationAdd(newLocation);
        toast.success("¡Ubicación agregada exitosamente!");
        form.reset();

        // Reset image upload state
        setImageUpload({
          file: null,
          previewUrl: null,
          isUploading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error("Error saving location:", error);
      toast.error(isEditing ? "Error al actualizar la ubicación" : "Error al agregar la ubicación");
    }
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-6 w-6" />
          {isEditing ? 'Editar Ubicación' : 'Agregar Nueva Ubicación'}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? 'Modifique los datos de la ubicación seleccionada'
            : 'Complete el formulario para agregar una nueva ubicación al directorio de San Gil'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Restaurante Jenny" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección</FormLabel>
                    <FormControl>
                      <Input placeholder="Calle 10 #5-20, San Gil" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Auténtica comida santandereana con platos tradicionales..." 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category and Subcategory */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          // Reset subcategory when category changes
                          form.setValue("subcategory", "");
                        }}
                      >
                        <option value="">Seleccionar categoría</option>
                        {existingCategories.map(cat => {
                          const category = categories.find(c => c.slug === cat);
                          return (
                            <option key={cat} value={cat}>
                              {category ? category.name : cat}
                            </option>
                          );
                        })}
                      </select>
                    </FormControl>
                    <FormDescription>
                      Selecciona una categoría de la lista
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subcategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subcategoría</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={!watchedCategory}
                      >
                        <option value="">
                          {watchedCategory ? "Seleccionar subcategoría" : "Primero selecciona una categoría"}
                        </option>
                        {subcategories.map(sub => (
                          <option key={sub.id} value={sub.id}>
                            {sub.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormDescription>
                      Selecciona una subcategoría de la lista
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Coordinates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="coordinates.0"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitud</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step=".01"
                        placeholder="6,554"
                        {...field}
                        onChange={(e) => {
                          field.onChange(parseFloat(e.target.value) || 0);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Entre -90 y 90
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="coordinates.1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitud</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step=".01"
                        placeholder="-73,134"
                        {...field}
                        onChange={(e) => {
                          field.onChange(parseFloat(e.target.value) || 0);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Entre -180 y 180
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Media and Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Image Upload Component */}
              <div className="space-y-2">
                <FormLabel>Imagen</FormLabel>

                {/* Hidden input for form validation */}
                <FormField
                  control={form.control}
                  name="photo"
                  render={({ field }) => (
                    <input type="hidden" {...field} />
                  )}
                />

                {/* Image Upload UI */}
                <div className="space-y-4">
                  {!imageUpload.previewUrl ? (
                    // Upload area
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <div className="space-y-4">
                        <div className="flex justify-center">
                          <ImageIcon className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Arrastra una imagen aquí o haz clic para seleccionar
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            PNG, JPG, WebP, GIF hasta 5MB
                          </p>
                        </div>
                        <div>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                            id="image-upload"
                            disabled={imageUpload.isUploading}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('image-upload')?.click()}
                            disabled={imageUpload.isUploading}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Seleccionar Imagen
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Preview area
                    <div className="space-y-4">
                      <div className="relative">
                        <img
                          src={imageUpload.previewUrl}
                          alt="Vista previa"
                          className="w-full h-48 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={handleImageRemove}
                          disabled={imageUpload.isUploading}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Upload status */}
                      {imageUpload.isUploading && (
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">
                            Subiendo imagen...
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Error message */}
                  {imageUpload.error && (
                    <p className="text-sm text-red-600">{imageUpload.error}</p>
                  )}

                  {/* Form error message */}
                  {form.formState.errors.photo && (
                    <p className="text-sm text-red-600">{form.formState.errors.photo.message}</p>
                  )}
                </div>
              </div>

              <FormField
                control={form.control}
                name="customUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Personalizada (opcional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://mi-sitio.com"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enlace a sitio web, reservas, o página de redes sociales
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

  
            {/* Tags */}
            <div className="space-y-2">
              <FormLabel>Etiquetas</FormLabel>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Agregar etiqueta..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1"
                />
                <Button type="button" onClick={handleAddTag} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {watchedTags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleRemoveTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
              {form.formState.errors.tags && (
                <p className="text-sm text-red-500">{form.formState.errors.tags.message}</p>
              )}
            </div>

            <div className="flex gap-2">
              {isEditing && onCancel && (
                <Button type="button" variant="outline" onClick={onCancel} className="flex-1" disabled={isLoading}>
                  Cancelar
                </Button>
              )}
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isEditing ? 'Actualizando...' : 'Agregando...'}
                  </>
                ) : (
                  isEditing ? 'Actualizar Ubicación' : 'Agregar Ubicación'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

