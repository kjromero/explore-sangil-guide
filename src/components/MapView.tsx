import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Category } from './FilterBar';
import type { Location } from '@/types';
import mockData from '@/data/mockData.json';

// You'll need to add your Mapbox token here
// For now, using a placeholder - user will need to provide their token
const MAPBOX_TOKEN = 'sk.eyJ1Ijoia2pyb21lcm8xIiwiYSI6ImNtZWpleHhwYzBkbGUycnE4Yndya3ZucXYifQ.o5-OfhpNMJ-X6P8DJrL0yw';

interface MapViewProps {
  activeCategory: Category;
  onLocationSelect: (location: Location) => void;
}

const categoryIcons = {
  gastronomy: '🍽️',
  adventure: '🏔️',
  culture: '🏛️',
  shops: '🛍️',
};

const categoryColors = {
  gastronomy: '#f59e0b',
  adventure: '#10b981',
  culture: '#8b5cf6',
  shops: '#3b82f6',
};

export function MapView({ activeCategory, onLocationSelect }: MapViewProps) {
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

  const filteredLocations = activeCategory === 'all' 
    ? allLocations 
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

      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.2)';
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
      });

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
      <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm rounded-lg p-4 shadow-elegant">
        <h4 className="font-semibold mb-2 text-sm">Categories</h4>
        <div className="space-y-2">
          {Object.entries(categoryIcons).map(([category, icon]) => (
            <div key={category} className="flex items-center space-x-2 text-sm">
              <div 
                className="w-4 h-4 rounded-full flex items-center justify-center text-xs"
                style={{ backgroundColor: categoryColors[category as keyof typeof categoryColors] }}
              >
                {icon}
              </div>
              <span className="capitalize">{category}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}