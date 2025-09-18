import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Location } from '@/types';
import { useLocations } from '@/hooks/useLocations';
import { useCategories } from '@/hooks/useCategories';
import { CategoriesService } from '@/services/categories.service';

// You'll need to add your Mapbox token here
// For now, using a placeholder - user will need to provide their token
const MAPBOX_TOKEN = 'pk.eyJ1Ijoia2pyb21lcm8xIiwiYSI6ImNtZWpldjl5YjBjeHAybXE4a2JxeG14am8ifQ.gVSUiqu0uC3nAWXoYXRr7A';

interface MapViewProps {
  activeCategory: string;
  activeSubcategory: string | null;
  onLocationSelect: (location: Location) => void;
}

// Dynamic category icons and colors - will be populated from Firebase data
const getCategoryIcon = (categoryId: string, categories: { id: string }[]): string => {
  const iconMap: Record<string, string> = {
    'comidas': '🍽️',
    'hospedajes': '🏨',
    'aventura': '🏔️',
    'cultural': '🏛️',
    'market': '🛒',
    'shops': '🛍️',
    'drogueria': '💊',
    'emergencias': '🚨',
    'emprendedores': '🚀',
    'artesanias': '🎨',
    'mall': '🏬',
    'recomendado-pet': '🐕',
    'recomendado-kits': '📦',
    'recomendado-del-mes': '⭐',
    'vecinos': '🏘️',
  };
  return iconMap[categoryId] || '📍';
};

const getCategoryColor = (categoryId: string): string => {
  const colorMap: Record<string, string> = {
    'comidas': '#f59e0b',
    'hospedajes': '#3b82f6',
    'aventura': '#10b981',
    'cultural': '#8b5cf6',
    'market': '#ef4444',
    'shops': '#f97316',
    'drogueria': '#6b7280',
    'emergencias': '#dc2626',
    'emprendedores': '#8b5cf6',
    'artesanias': '#f59e0b',
    'mall': '#3b82f6',
    'recomendado-pet': '#06b6d4',
    'recomendado-kits': '#84cc16',
    'recomendado-del-mes': '#f59e0b',
    'vecinos': '#10b981',
  };
  return colorMap[categoryId] || '#6b7280';
};

export function MapView({ activeCategory, activeSubcategory, onLocationSelect }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  const { data: allLocations = [], isLoading, error } = useLocations();
  const { data: categories = [] } = useCategories();

  const filteredLocations = useMemo(() => {
    if (activeCategory === 'todo') {
      return allLocations;
    }

    return allLocations.filter(location => {
      // Match by category
      if (location.category !== activeCategory) {
        return false;
      }

      // If no subcategory filter, category match is enough
      if (!activeSubcategory) {
        return true;
      }

      // Match by subcategory
      return location.subcategory === activeSubcategory;
    });
  }, [allLocations, activeCategory, activeSubcategory]);

  const updateMarkers = useCallback(() => {
    if (!map.current) return;

    // Remove existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add new markers
    filteredLocations.forEach(location => {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = getCategoryColor(location.category);
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.fontSize = '16px';
      el.style.cursor = 'pointer';
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
      el.style.transition = 'transform 0.2s ease';
      el.textContent = getCategoryIcon(location.category, categories);

      el.addEventListener('click', () => {
        onLocationSelect(location);
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat([location.coordinates[1], location.coordinates[0]])
        .addTo(map.current!);

      markers.current.push(marker);
    });
  }, [filteredLocations, categories, onLocationSelect]);

  useEffect(() => {
    if (!mapContainer.current || !MAPBOX_TOKEN || isLoading) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        zoom: 13,
        pitch: 45,
      });

      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'bottom-right'
      );

      // Add atmosphere and lighting
      map.current.on('style.load', () => {
        map.current?.setFog({
          color: 'rgb(255, 255, 255)',
          'high-color': 'rgb(200, 200, 225)',
          'horizon-blend': 0.02,
        });
      });

      updateMarkers();
    } catch (error) {
      console.error('Error initializing map:', error);
    }

    return () => {
      markers.current.forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, [isLoading]);

  useEffect(() => {
    if (!map.current) return;
    if (filteredLocations.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      filteredLocations.forEach(location => {
        bounds.extend([location.coordinates[1], location.coordinates[0]]);
      });
      map.current.fitBounds(bounds, { padding: 100, maxZoom: 15, duration: 1000 });
      updateMarkers();
    } else {
      // Clear all markers if no locations match filter
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
    }
  }, [filteredLocations, updateMarkers]);

  
  // Get subcategories for the active category to show in legend
  const subcategoriesForActiveCategory = useMemo(() => {
    if (activeCategory === 'todo') return [];

    const category = categories.find(cat => cat.id === activeCategory);
    return category ? category.subcategories : [];
  }, [activeCategory, categories]);

  if (isLoading) {
    return (
      <div className="relative h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Cargando ubicaciones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error al cargar las ubicaciones</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen pt-16">
      <div ref={mapContainer} className="absolute inset-0" />

      {/* Category Legend */}
      <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm rounded-lg p-4 shadow-elegant max-h-64 overflow-y-auto">
        <h4 className="font-semibold mb-2 text-sm">
          {activeSubcategory ? 'Subcategoría' : activeCategory === 'todo' ? 'Categorías' : 'Categoría'}
        </h4>
        <div className="space-y-2">
          {activeSubcategory ? (
            // Show active subcategory
            <div className="flex items-center space-x-2 text-sm">
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center text-xs"
                style={{ backgroundColor: getCategoryColor(activeCategory) }}
              >
                {getCategoryIcon(activeCategory, categories)}
              </div>
              <span className="font-medium">
                {CategoriesService.getSubcategoryNameById(categories, activeSubcategory)}
              </span>
            </div>
          ) : activeCategory === 'todo' ? (
            // Show all categories when "Todo" is selected
            categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2 text-sm">
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center text-xs"
                  style={{ backgroundColor: getCategoryColor(category.slug) }}
                >
                  {getCategoryIcon(category.slug, categories)}
                </div>
                <span className="capitalize">{category.name}</span>
              </div>
            ))
          ) : (
            // Show category and its subcategories when a specific category is selected
            <>
              <div className="flex items-center space-x-2 text-sm">
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center text-xs"
                  style={{ backgroundColor: getCategoryColor(activeCategory) }}
                >
                  {getCategoryIcon(activeCategory, categories)}
                </div>
                <span className="font-medium">
                  {CategoriesService.getCategoryNameById(categories, activeCategory)}
                </span>
              </div>
              {subcategoriesForActiveCategory.map((subcategory) => (
                <div key={subcategory.id} className="flex items-center space-x-2 text-sm ml-6">
                  <div
                    className="w-3 h-3 rounded-full flex items-center justify-center text-xs"
                    style={{ backgroundColor: getCategoryColor(activeCategory) }}
                  >
                    <span className="text-[8px]">•</span>
                  </div>
                  <span className="text-muted-foreground">{subcategory.name}</span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
