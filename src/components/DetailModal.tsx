import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, ExternalLink } from "lucide-react";
import type { Location } from '@/types';

interface DetailModalProps {
  location: Location | null;
  isOpen: boolean;
  onClose: () => void;
}

// Import images
import restaurantJenny from "@/assets/restaurant-jenny.jpg";
import cuevaDelIndio from "@/assets/cueva-del-indio.jpg";
import paragliding from "@/assets/paragliding.jpg";
import phoneRepair from "@/assets/phone-repair.jpg";

const imageMap: Record<string, string> = {
  "restaurant-jenny.jpg": restaurantJenny,
  "cueva-del-indio.jpg": cuevaDelIndio,
  "paragliding.jpg": paragliding,
  "phone-repair.jpg": phoneRepair,
};

export function DetailModal({ location, isOpen, onClose }: DetailModalProps) {
  if (!location) return null;

  const imageSrc = imageMap[location.photo] || restaurantJenny;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{location.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Hero Image */}
          <div className="relative h-64 rounded-lg overflow-hidden">
            <img 
              src={imageSrc}
              alt={location.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="capitalize">
              {location.category}
            </Badge>
            {location.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
          
          {/* Description */}
          <p className="text-muted-foreground leading-relaxed">
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
