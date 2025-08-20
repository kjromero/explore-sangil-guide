import { Button } from "@/components/ui/button";
import { UtensilsCrossed, Mountain, Landmark, ShoppingBag, Menu } from "lucide-react";

export type Category = 'all' | 'gastronomy' | 'adventure' | 'culture' | 'shops';

interface FilterBarProps {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
  onMenuToggle: () => void;
}

const categories = [
  { id: 'all' as Category, label: 'All', icon: Menu },
  { id: 'gastronomy' as Category, label: 'Food', icon: UtensilsCrossed },
  { id: 'adventure' as Category, label: 'Adventure', icon: Mountain },
  { id: 'culture' as Category, label: 'Culture', icon: Landmark },
  { id: 'shops' as Category, label: 'Shops', icon: ShoppingBag },
];

export function FilterBar({ activeCategory, onCategoryChange, onMenuToggle }: FilterBarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b shadow-elegant">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuToggle}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <h2 className="text-lg font-semibold text-foreground">
              San Gil Explorer
            </h2>
          </div>
          
          <div className="hidden md:flex items-center space-x-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "filter"}
                  size="sm"
                  onClick={() => onCategoryChange(category.id)}
                  className="transition-smooth"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {category.label}
                </Button>
              );
            })}
          </div>
        </div>
        
        {/* Mobile Categories */}
        <div className="md:hidden mt-3 flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "filter"}
                size="sm"
                onClick={() => onCategoryChange(category.id)}
                className="flex-shrink-0 transition-smooth"
              >
                <Icon className="h-4 w-4 mr-2" />
                {category.label}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}