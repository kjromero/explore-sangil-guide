"use client";

import { useState } from "react";
import { AdminForm } from "@/components/AdminForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Settings, MapPin, Plus, Eye, Edit, Trash2, Download, Upload, LogOut, CheckCircle } from "lucide-react";
import type { Location } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useLocations, useCreateLocation, useUpdateLocation, useDeleteLocation } from "@/hooks/useLocations";

export default function Admin() {
  const { user, logout } = useAuth();
  const { data: allLocations = [], isLoading, error } = useLocations();
  const createLocation = useCreateLocation();
  const updateLocation = useUpdateLocation();
  const deleteLocation = useDeleteLocation();

  const handleLocationAdd = async (newLocation: Omit<Location, 'id'>) => {
    try {
      await createLocation.mutateAsync(newLocation);
      toast.success("Ubicación agregada exitosamente");
    } catch (error) {
      toast.error("Error al agregar la ubicación");
    }
  };

  const handleLocationEdit = async (id: string, updates: Partial<Location>) => {
    try {
      await updateLocation.mutateAsync({ id, updates });
      toast.success("Ubicación actualizada exitosamente");
    } catch (error) {
      toast.error("Error al actualizar la ubicación");
    }
  };

  const handleLocationDelete = async (id: string) => {
    try {
      await deleteLocation.mutateAsync(id);
      toast.success("Ubicación eliminada exitosamente");
    } catch (error) {
      toast.error("Error al eliminar la ubicación");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Sesión cerrada exitosamente");
    } catch (error) {
      toast.error("Error al cerrar sesión");
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      "gastronomía": "🍽️",
      "aventura": "🏔️",
      "cultura": "🏛️",
      "tiendas": "🛍️",
    };
    return icons[category] || "📍";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>No se pudieron cargar los datos. Por favor intente nuevamente.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalCategories = new Set(allLocations.map(l => l.category)).size;
  const totalSubcategories = new Set(allLocations.map(l => l.subcategory)).size;

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className="border-b bg-white/90 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="h-6 w-6" />
              <div>
                <h1 className="text-2xl font-bold">Panel de Administración</h1>
                <p className="text-sm text-muted-foreground">
                  Explorador San Gil - Gestión de Ubicaciones
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="destructive" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="add" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="add" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Agregar Ubicación
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Gestionar Ubicaciones
            </TabsTrigger>
          </TabsList>

          <TabsContent value="add" className="space-y-6">
            <AdminForm onLocationAdd={handleLocationAdd} />
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Ubicaciones</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{allLocations.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Categorías</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{totalCategories}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Subcategorías</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{totalSubcategories}</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Todas las Ubicaciones</CardTitle>
                <CardDescription>
                  Lista completa de ubicaciones en el sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Subcategoría</TableHead>
                        <TableHead>Dirección</TableHead>
                        <TableHead>Coordenadas</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allLocations.map((location) => (
                        <TableRow key={location.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <span>{getCategoryIcon(location.category)}</span>
                              {location.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{location.category}</Badge>
                          </TableCell>
                          <TableCell>{location.subcategory || "-"}</TableCell>
                          <TableCell className="max-w-xs truncate">{location.address}</TableCell>
                          <TableCell className="font-mono text-sm">
                            {location.coordinates[0].toFixed(3)}, {location.coordinates[1].toFixed(3)}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  alert(`Ubicación: ${location.name}\nDirección: ${location.address}\nCategoría: ${location.category}\nDescripción: ${location.description}`);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  // Simple edit for now - just updates the timestamp
                                  handleLocationEdit(location.id, { ...location });
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  if (confirm(`¿Estás seguro de que quieres eliminar "${location.name}"?`)) {
                                    handleLocationDelete(location.id);
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
