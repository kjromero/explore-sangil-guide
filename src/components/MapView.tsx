import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Category } from './FilterBar';
import type { Location } from '@/types';
import mockData from '@/data/mockData.json';
import { SUBCATEGORIES } from '@/config/subcategories';

// You'll need to add your Mapbox token here
// For now, using a placeholder - user will need to provide their token
const MAPBOX_TOKEN = 'pk.eyJ1Ijoia2pyb21lcm8xIiwiYSI6ImNtZWpldjl5YjBjeHAybXE4a2JxeG14am8ifQ.gVSUiqu0uC3nAWXoYXRr7A';

interface MapViewProps {
  activeCategory: Category;
  activeSubcategory: string | null;
  onLocationSelect: (location: Location) => void;
}

const categoryIcons = {
  'gastronomía': '🍽️',
  'aventura': '🏔️',
  'cultura': '🏛️',
  'tiendas': '🛍️',
};

const categoryColors = {
  'gastronomía': '#f59e0b',
  'aventura': '#10b981',
  'cultura': '#8b5cf6',
  'tiendas': '#3b82f6',
};

export function MapView({ activeCategory, activeSubcategory, onLocationSelect }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [showTokenInput, setShowTokenInput] = useState(!MAPBOX_TOKEN);
  const [userToken, setUserToken] = useState('');

  const allLocations: Location[] = [
    ...mockData.gastronomy,
    ...mockData.culture,
    ...mockData.adventure,
    ...mockData.shops,
  ] as Location[];

  const filteredLocations = activeCategory === 'todo' 
    ? allLocations 
    : activeSubcategory 
      ? allLocations.filter(location => location.category === activeCategory && location.subcategory === activeSubcategory)
      : allLocations.filter(location => location.category === activeCategory);

  useEffect(() => {
    if (!mapContainer.current || (!MAPBOX_TOKEN && !userToken) || showTokenInput) return;

    const token = userToken || MAPBOX_TOKEN;
    mapboxgl.accessToken = token;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-73.134, 6.554], // San Gil coordinates
        zoom: 13,
        pitch: 45,
      });

      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
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
      setShowTokenInput(true);
    }

    return () => {
      markers.current.forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, [userToken, showTokenInput]);

  useEffect(() => {
    if (map.current) {
      updateMarkers();
    }
  }, [filteredLocations]);

  const updateMarkers = () => {
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
      el.style.backgroundColor = categoryColors[location.category as keyof typeof categoryColors];
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.fontSize = '16px';
      el.style.cursor = 'pointer';
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
      el.style.transition = 'transform 0.2s ease';
      el.textContent = categoryIcons[location.category as keyof typeof categoryIcons];

      el.addEventListener('click', () => {
        onLocationSelect(location);
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat([location.coordinates[1], location.coordinates[0]])
        .addTo(map.current!);

      markers.current.push(marker);
    });
  };


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
                style={{ backgroundColor: categoryColors[activeCategory as keyof typeof categoryColors] }}
              >
                {categoryIcons[activeCategory as keyof typeof categoryIcons]}
              </div>
              <span className="font-medium">{activeSubcategory}</span>
            </div>
          ) : activeCategory === 'todo' ? (
            // Show all categories when "Todo" is selected
            Object.entries(categoryIcons).map(([category, icon]) => (
              <div key={category} className="flex items-center space-x-2 text-sm">
                <div 
                  className="w-4 h-4 rounded-full flex items-center justify-center text-xs"
                  style={{ backgroundColor: categoryColors[category as keyof typeof categoryColors] }}
                >
                  {icon}
                </div>
                <span className="capitalize">{category}</span>
              </div>
            ))
          ) : (
            // Show category and its subcategories when a specific category is selected
            <>
              <div className="flex items-center space-x-2 text-sm">
                <div 
                  className="w-4 h-4 rounded-full flex items-center justify-center text-xs"
                  style={{ backgroundColor: categoryColors[activeCategory as keyof typeof categoryColors] }}
                >
                  {categoryIcons[activeCategory as keyof typeof categoryIcons]}
                </div>
                <span className="font-medium capitalize">{activeCategory}</span>
              </div>
              {SUBCATEGORIES[activeCategory].map((subcategory) => (
                <div key={subcategory} className="flex items-center space-x-2 text-sm ml-6">
                  <div 
                    className="w-3 h-3 rounded-full flex items-center justify-center text-xs"
                    style={{ backgroundColor: categoryColors[activeCategory as keyof typeof categoryColors] }}
                  >
                    <span className="text-[8px]">•</span>
                  </div>
                  <span className="text-muted-foreground">{subcategory}</span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
