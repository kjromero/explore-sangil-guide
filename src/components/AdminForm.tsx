"use client";

import { useState, useMemo } from "react";
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
import { MapPin, Plus, X } from "lucide-react";
import type { Location } from "@/types";
import { useCategories } from "@/hooks/useCategories";

// Zod schema for location validation
const locationSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  address: z.string().min(5, "La dirección debe tener al menos 5 caracteres"),
  photo: z.string().min(1, "La foto es requerida"),
  customUrl: z.string().url("Ingrese una URL válida").optional(),
  category: z.string().min(1, "La categoría es requerida"),
  subcategory: z.string().optional(),
  coordinates: z.tuple([z.number(), z.number()])
    .refine(([lat, _lng]) => lat >= -90 && lat <= 90, "La latitud debe estar entre -90 y 90")
    .refine(([_lat, lng]) => lng >= -180 && lng <= 180, "La longitud debe estar entre -180 y 180"),
  tags: z.array(z.string()).min(1, "Debe agregar al menos una etiqueta"),
});

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
    } else {
      form.reset();
    }
  }, [editingLocation, form]);

  const watchedCategory = form.watch("category");
  const watchedTags = form.watch("tags");

  // Get categories from Firebase
  const existingCategories = useMemo(() => {
    return categories.map(cat => cat.id);
  }, [categories]);

  const subcategoriesForCategory = useMemo(() => {
    if (!watchedCategory) return [];

    // Get subcategories from Firebase categories
    const firebaseCategory = categories.find(cat => cat.id === watchedCategory);
    return firebaseCategory ? firebaseCategory.subcategories : [];
  }, [watchedCategory, categories]);

  const handleAddTag = () => {
    if (newTag.trim() && !watchedTags.includes(newTag.trim())) {
      form.setValue("tags", [...watchedTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    form.setValue("tags", watchedTags.filter(tag => tag !== tagToRemove));
  };

  const onSubmit = async (data: LocationFormData) => {
    try {
      const locationData = {
        ...data,
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
                          const category = categories.find(c => c.id === cat);
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
                        {subcategoriesForCategory.map(sub => (
                          <option key={sub} value={sub}>
                            {sub}
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
                        step="any"
                        placeholder="6.554"
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
                        step="any"
                        placeholder="-73.134"
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
              <FormField
                control={form.control}
                name="photo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del archivo de foto</FormLabel>
                    <FormControl>
                      <Input placeholder="restaurant-jenny.jpg" {...field} />
                    </FormControl>
                    <FormDescription>
                      Nombre del archivo de imagen (ej: restaurant-jenny.jpg)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

