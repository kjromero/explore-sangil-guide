import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, ExternalLink, Image as ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { Location } from '@/types';
import { CategoriesService } from '@/services/categories.service';
import { useCategories } from '@/hooks/useCategories';

interface DetailModalProps {
  location: Location | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DetailModal({ location, isOpen, onClose }: DetailModalProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { data: categories = [] } = useCategories();

  // Reset image states when location changes
  useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
  }, [location]);

  if (!location) return null;

  // Get category and subcategory names for display
  const categoryName = CategoriesService.getCategoryNameById(categories, location.category);
  const subcategoryName = CategoriesService.getSubcategoryNameById(categories, location.subcategory);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleRetry = () => {
    setImageError(false);
    setImageLoaded(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{location.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Hero Image */}
          <div className="relative h-64 rounded-lg overflow-hidden bg-muted">
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}

            {imageError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                <ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-3">
                  No se pudo cargar la imagen
                </p>
                <Button size="sm" variant="outline" onClick={handleRetry}>
                  Reintentar
                </Button>
              </div>
            ) : (
              <>
                <img
                  src={location.photo}
                  alt={location.name}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </>
            )}
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="capitalize">
              {categoryName}
            </Badge>
            {subcategoryName && (
              <Badge variant="outline">
                {subcategoryName}
              </Badge>
            )}
            {location.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
          
          {/* Description */}
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {location.description}
          </p>
          
          {/* Address */}
          <div className="flex items-start space-x-2 text-sm">
            <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
            <span>{location.address}</span>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="explore"
              onClick={() => window.open(location.mapsUrl, '_blank')}
              className="flex-1"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Abrir en Google Maps
            </Button>

            <Button
              variant="secondary"
              onClick={() => window.open(location.wazeUrl, '_blank')}
              className="flex-1"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Abrir en Waze
            </Button>

            {location.customUrl && (
              <Button
                variant="outline"
                onClick={() => window.open(location.customUrl, '_blank')}
                className="flex-1"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Enlace Personalizado
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
