import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UtensilsCrossed, Mountain, Landmark, ShoppingBag, Menu, ChevronDown } from "lucide-react";
import { useLocations } from "@/hooks/useLocations";
import type { Location } from "@/types";

// The Category type is now a flexible string
export type Category = string;

interface FilterBarProps {
  activeCategory: Category;
  activeSubcategory: string | null;
  onCategoryChange: (category: Category) => void;
  onSubcategoryChange: (subcategory: string | null) => void;
  onMenuToggle: () => void;
}

// This array still defines the primary categories and their icons for the UI
const categories = [
  { id: 'todo', label: 'Todo', icon: Menu },
  { id: 'gastronomía', label: 'Gastronomía', icon: UtensilsCrossed },
  { id: 'aventura', label: 'Aventura', icon: Mountain },
  { id: 'cultura', label: 'Cultura', icon: Landmark },
  { id: 'tiendas', label: 'Tiendas', icon: ShoppingBag },
];

// Helper function to get subcategories dynamically from the data
const getSubcategoriesFor = (category: Category, locations: Location[]): string[] => {
  if (category === 'todo') return [];
  const subcategories = locations
    .filter(location => location.category === category)
    .map(location => location.subcategory);
  return [...new Set(subcategories)].filter(Boolean); // Return unique, non-empty subcategories
};

export function FilterBar({ activeCategory, activeSubcategory, onCategoryChange, onSubcategoryChange, onMenuToggle }: FilterBarProps) {
  const { data: locations = [] } = useLocations();
  const handleCategoryClick = (category: Category) => {
    if (activeCategory === category) {
      onCategoryChange('todo');
      onSubcategoryChange(null);
    } else {
      onCategoryChange(category);
      onSubcategoryChange(null);
    }
  };

  const handleSubcategoryClick = (subcategory: string) => {
    onSubcategoryChange(subcategory);
  };

  const renderCategory = (category: typeof categories[0], isMobile = false) => {
    const Icon = category.icon;
    const subcategories = getSubcategoriesFor(category.id, locations);
    const hasSubs = subcategories.length > 0;
    const isActive = activeCategory === category.id;

    if (category.id === 'todo') {
      return (
        <Button
          key={category.id}
          variant={isActive ? "default" : "filter"}
          size="sm"
          onClick={() => handleCategoryClick(category.id)}
          className={`transition-smooth ${isMobile ? 'flex-shrink-0' : ''}`}
        >
          <Icon className="h-4 w-4 mr-2" />
          {category.label}
        </Button>
      );
    }

    return (
      <DropdownMenu key={category.id}>
        <DropdownMenuTrigger asChild>
          <Button
            variant={isActive ? "default" : "filter"}
            size="sm"
            onClick={!hasSubs ? () => handleCategoryClick(category.id) : undefined}
            className={`transition-smooth ${isMobile ? 'flex-shrink-0' : ''}`}
          >
            <Icon className="h-4 w-4 mr-2" />
            {category.label}
            {hasSubs && <ChevronDown className="h-3 w-3 ml-1" />}
          </Button>
        </DropdownMenuTrigger>
        {hasSubs && (
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem
              onClick={() => handleCategoryClick(category.id)}
              className={isActive && !activeSubcategory ? "bg-accent" : ""}
            >
              Todo {category.label.toLowerCase()}
            </DropdownMenuItem>
            {subcategories.map((subcategory) => (
              <DropdownMenuItem
                key={subcategory}
                onClick={() => {
                  if (activeCategory !== category.id) {
                    onCategoryChange(category.id);
                  }
                  handleSubcategoryClick(subcategory);
                }}
                className={isActive && activeSubcategory === subcategory ? "bg-accent" : ""}
              >
                {subcategory}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    );
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b shadow-elegant">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">            
            <h2 className="text-lg font-semibold text-foreground">
              Explorador San Gil
            </h2>
          </div>
          
          {/* Desktop Categories */}
          <div className="hidden md:flex items-center space-x-2">
            {categories.map(category => renderCategory(category, false))}
          </div>
        </div>
        
        {/* Mobile Categories */}
        <div className="md:hidden mt-3 flex gap-2 overflow-x-auto pb-2">
          {categories.map(category => renderCategory(category, true))}
        </div>
      </div>
    </div>
  );
}
