import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Folder, Menu, ChevronDown } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import type { Category as CategoryType } from "@/types";

// The Category type is now a flexible string
export type Category = string;

interface FilterBarProps {
  activeCategory: Category;
  activeSubcategory: string | null;
  onCategoryChange: (category: Category) => void;
  onSubcategoryChange: (subcategory: string | null) => void;
  onMenuToggle: () => void;
}

// This array defines the special UI categories ("Todo" is always first)
const specialCategories = [
  { id: 'todo', label: 'Todo', icon: Menu },
];

// Helper function to get subcategories from Firebase categories
const getSubcategoriesFor = (categoryId: string, categories: CategoryType[]): string[] => {
  if (categoryId === 'todo') return [];

  // Get subcategories from Firebase categories
  const firebaseCategory = categories.find(cat => cat.id === categoryId);
  return firebaseCategory ? firebaseCategory.subcategories : [];
};

export function FilterBar({ activeCategory, activeSubcategory, onCategoryChange, onSubcategoryChange, onMenuToggle }: FilterBarProps) {
  const { data: categories = [] } = useCategories();

  // Combine special categories with Firebase categories
  const allCategories = [
    ...specialCategories,
    ...categories.map(category => ({
      id: category.id,
      label: category.name,
      icon: Folder, // Generic icon for all categories
    }))
  ];

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

  const renderCategory = (category: typeof allCategories[0], isMobile = false) => {
    const Icon = category.icon;
    const subcategories = getSubcategoriesFor(category.id, categories);
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
      <div className="mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">            
            <h2 className="text-lg font-semibold text-foreground">
              Explorador San Gil
            </h2>
          </div>
          
          {/* Desktop Categories */}
          <div className="hidden md:flex flex items-center space-x-2 overflow-x-auto pb-2 ml-[100px]">
            {allCategories.map(category => renderCategory(category, false))}
          </div>
        </div>
        
        {/* Mobile Categories */}
        <div className="md:hidden mt-3 flex gap-2 overflow-x-auto pb-2">
          {allCategories.map(category => renderCategory(category, true))}
        </div>
      </div>
    </div>
  );
}
