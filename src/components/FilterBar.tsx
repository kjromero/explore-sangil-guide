import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UtensilsCrossed, Mountain, Landmark, ShoppingBag, Menu, ChevronDown } from "lucide-react";
import { SUBCATEGORIES, hasSubcategories } from "@/config/subcategories";

export type Category = 'todo' | 'gastronomía' | 'aventura' | 'cultura' | 'tiendas';

interface FilterBarProps {
  activeCategory: Category;
  activeSubcategory: string | null;
  onCategoryChange: (category: Category) => void;
  onSubcategoryChange: (subcategory: string | null) => void;
  onMenuToggle: () => void;
}

const categories = [
  { id: 'todo' as Category, label: 'Todo', icon: Menu },
  { id: 'gastronomía' as Category, label: 'Gastronomía', icon: UtensilsCrossed },
  { id: 'aventura' as Category, label: 'Aventura', icon: Mountain },
  { id: 'cultura' as Category, label: 'Cultura', icon: Landmark },
  { id: 'tiendas' as Category, label: 'Tiendas', icon: ShoppingBag },
];

export function FilterBar({ activeCategory, activeSubcategory, onCategoryChange, onSubcategoryChange, onMenuToggle }: FilterBarProps) {
  const handleCategoryClick = (category: Category) => {
    if (activeCategory === category) {
      // If clicking the same category, toggle it off or reset to todo
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
            {categories.map((category) => {
              const Icon = category.icon;
              const hasSubs = hasSubcategories(category.id);
              const isActive = activeCategory === category.id;
              
              if (category.id === 'todo') {
                return (
                  <Button
                    key={category.id}
                    variant={isActive ? "default" : "filter"}
                    size="sm"
                    onClick={() => handleCategoryClick(category.id)}
                    className="transition-smooth"
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
                      className="transition-smooth"
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
                      {SUBCATEGORIES[category.id].map((subcategory) => (
                        <DropdownMenuItem
                          key={subcategory}
                          onClick={() => {
                            // Ensure the parent category is set when a subcategory is selected
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
            })}
          </div>
        </div>
        
        {/* Mobile Categories */}
        <div className="md:hidden mt-3 flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => {
            const Icon = category.icon;
            const hasSubs = hasSubcategories(category.id);
            const isActive = activeCategory === category.id;
            
            if (category.id === 'todo') {
              return (
                <Button
                  key={category.id}
                  variant={isActive ? "default" : "filter"}
                  size="sm"
                  onClick={() => handleCategoryClick(category.id)}
                  className="flex-shrink-0 transition-smooth"
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
                    className="flex-shrink-0 transition-smooth"
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
                    {SUBCATEGORIES[category.id].map((subcategory) => (
                      <DropdownMenuItem
                        key={subcategory}
                        onClick={() => {
                          // Ensure the parent category is set when a subcategory is selected
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
          })}
        </div>
      </div>
    </div>
  );
}
