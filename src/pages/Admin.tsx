"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminForm } from "@/components/AdminForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Settings, MapPin, Plus, Eye, Edit, Trash2, Download, Upload, LogOut } from "lucide-react";
import type { Location } from "@/types";
import { exportData, getTempLocations, getAllLocations as fetchAllLocations } from "@/utils/adminData";
import { useAuth } from "@/contexts/AuthContext";

// Mock data - in real app this would come from API
const fetchMockData = async () => {
  const response = await import("@/data/mockData.json");
  return response.default;
};

export default function Admin() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const { user, logout } = useAuth();

  const { data: mockData, isLoading, error } = useQuery({
    queryKey: ["mockData"],
    queryFn: fetchMockData,
  });

  const handleLocationAdd = (newLocation: Location) => {
    setLocations(prev => [...prev, newLocation]);
    toast.success("Ubicación agregada a la lista temporal");
  };

  const handleExportData = async () => {
    try {
      await exportData();
      toast.success("Datos exportados exitosamente");
    } catch (error) {
      toast.error("Error al exportar datos");
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada exitosamente");
  };

  const getAllLocations = (): Location[] => {
    if (!mockData) return [];
    
    return [
      ...mockData.gastronomy.map(l => ({ ...l, category: "gastronomía" })),
      ...mockData.culture.map(l => ({ ...l, category: "cultura" })),
      ...mockData.adventure.map(l => ({ ...l, category: "aventura" })),
      ...mockData.shops.map(l => ({ ...l, category: "tiendas" })),
    ];
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

  const allLocations = getAllLocations();

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
                <Button variant="outline" size="sm" onClick={handleExportData}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Datos
                </Button>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Importar
                </Button>
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
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Info className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-blue-900">Nota importante</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Por ahora, las nuevas ubicaciones se agregan temporalmente. Pronto implementaremos una conexión a base de datos para persistencia permanente.
                  </p>
                </div>
              </div>
            </div>
            
            <AdminForm onLocationAdd={handleLocationAdd} />
            
            {/* Temporary locations list */}
            {getTempLocations().length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Ubicaciones Temporales</CardTitle>
                  <CardDescription>
                    Estas ubicaciones se han agregado en esta sesión pero no están guardadas permanentemente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {getTempLocations().map((location, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{getCategoryIcon(location.category)}</span>
                          <div>
                            <h4 className="font-medium">{location.name}</h4>
                            <p className="text-sm text-muted-foreground">{location.address}</p>
                          </div>
                        </div>
                        <Badge variant="outline">Temporal</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
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
                  <p className="text-3xl font-bold">4</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Subcategorías</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">12</p>
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
                        <TableRow key={`${location.category}-${location.id}`}>
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
                              <Button disabled variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button disabled variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button disabled variant="ghost" size="sm">
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

// Import the Info icon that's used in the component
import { Info } from "lucide-react";
