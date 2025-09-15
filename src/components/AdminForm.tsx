"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { MapPin, Plus, X } from "lucide-react";
import type { Location } from "@/types";
import type { Category } from "@/components/FilterBar";
import { SUBCATEGORIES } from "@/config/subcategories";
import { addLocation, generateNextId } from "@/utils/adminData";

// Zod schema for location validation
const locationSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  address: z.string().min(5, "La dirección debe tener al menos 5 caracteres"),
  photo: z.string().min(1, "La foto es requerida"),
  mapsUrl: z.string().url("Ingrese una URL válida de Google Maps"),
  bookingUrl: z.string().url("Ingrese una URL válida").optional().or(z.literal("")),
  category: z.enum(["gastronomía", "aventura", "cultura", "tiendas"]),
  subcategory: z.string().optional(),
  coordinates: z.tuple([z.number(), z.number()])
    .refine(([lat, lng]) => lat >= -90 && lat <= 90, "La latitud debe estar entre -90 y 90")
    .refine(([lat, lng]) => lng >= -180 && lng <= 180, "La longitud debe estar entre -180 y 180"),
  tags: z.array(z.string()).min(1, "Debe agregar al menos una etiqueta"),
});

type LocationFormData = z.infer<typeof locationSchema>;

interface AdminFormProps {
  onLocationAdd: (location: Location) => void;
}

export function AdminForm({ onLocationAdd }: AdminFormProps) {
  const [newTag, setNewTag] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "">("");
  
  const form = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      photo: "",
      mapsUrl: "",
      bookingUrl: "",
      category: "gastronomía",
      subcategory: "",
      coordinates: [6.554, -73.134], // Default San Gil coordinates
      tags: [],
    },
  });

  const watchedCategory = form.watch("category");
  const watchedTags = form.watch("tags");

  const handleAddTag = () => {
    if (newTag.trim() && !watchedTags.includes(newTag.trim())) {
      form.setValue("tags", [...watchedTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    form.setValue("tags", watchedTags.filter(tag => tag !== tagToRemove));
  };

  const handleCategoryChange = (category: Category) => {
    setSelectedCategory(category);
    form.setValue("category", category);
    form.setValue("subcategory", ""); // Reset subcategory when category changes
  };

  const onSubmit = async (data: LocationFormData) => {
    try {
      // Generate new ID using utility function
      const nextId = await generateNextId(data.category);
      
      const newLocation: Location = {
        id: nextId,
        ...data,
        bookingUrl: data.bookingUrl || undefined,
        subcategory: data.subcategory || undefined,
      };

      // Add location using utility function
      await addLocation(newLocation);
      
      // Notify parent component
      onLocationAdd(newLocation);
      
      toast.success("¡Ubicación agregada exitosamente!");
      form.reset();
      setSelectedCategory("");
    } catch (error) {
      console.error("Error adding location:", error);
      toast.error("Error al agregar la ubicación");
    }
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-6 w-6" />
          Agregar Nueva Ubicación
        </CardTitle>
        <CardDescription>
          Complete el formulario para agregar una nueva ubicación al directorio de San Gil
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
                    <Select onValueChange={(value) => handleCategoryChange(value as Category)} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="gastronomía">Gastronomía</SelectItem>
                        <SelectItem value="aventura">Aventura</SelectItem>
                        <SelectItem value="cultura">Cultura</SelectItem>
                        <SelectItem value="tiendas">Tiendas</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedCategory && SUBCATEGORIES[selectedCategory as Category]?.length > 0 && (
                <FormField
                  control={form.control}
                  name="subcategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subcategoría</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una subcategoría" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SUBCATEGORIES[selectedCategory as Category].map((subcategory) => (
                            <SelectItem key={subcategory} value={subcategory}>
                              {subcategory}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
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
                name="mapsUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL de Google Maps</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://maps.google.com/?q=6.556,-73.133"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="bookingUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL de Reservas (opcional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://reservations.mock/jenny"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Deja en blanco si no aplica
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <Button type="submit" className="w-full">
              Agregar Ubicación
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
