import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Folder, Menu, ChevronDown, X, ChevronRight } from "lucide-react";
import { useCategories, useSubcategoriesByCategory } from "@/hooks/useCategories";
import { useState } from "react";

// The Category type is now a flexible string
export type Category = string;

interface FilterBarProps {
  activeCategory: Category;
  activeSubcategory: string | null;
  onCategoryChange: (category: Category) => void;
  onSubcategoryChange: (subcategory: string | null) => void;
  onMenuToggle: () => void;
}

// This array defines a special UI category ("Todo" is always first)
const specialCategories = [
  { id: 'todo', label: 'Todo', icon: Menu },
];

export function FilterBar({ activeCategory, activeSubcategory, onCategoryChange, onSubcategoryChange, onMenuToggle }: FilterBarProps) {
  const { data: categories = [] } = useCategories();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Get subcategories for the active category
  const { data: activeSubcategories = [] } = useSubcategoriesByCategory(
    activeCategory === 'todo' ? '' : activeCategory
  );

  // Combine "Todo" category with Firebase categories
  const allCategories = [
    ...specialCategories,
    ...categories.map(category => ({
      id: category.slug,
      label: category.name,
      icon: Folder,
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
    if (activeSubcategory === subcategory) {
      onSubcategoryChange(null);
    } else {
      onSubcategoryChange(subcategory);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const handleMobileCategoryClick = (category: Category) => {
    if (activeCategory === category) {
      onCategoryChange('todo');
      onSubcategoryChange(null);
    } else {
      onCategoryChange(category);
      onSubcategoryChange(null);
    }
    setIsMobileMenuOpen(false);
    setExpandedCategory(null);
  };

  const handleMobileSubcategoryClick = (subcategory: string, categoryId: Category) => {
    if (activeSubcategory === subcategory) {
      onSubcategoryChange(null);
    } else {
      if (activeCategory !== categoryId) {
        onCategoryChange(categoryId);
      }
      onSubcategoryChange(subcategory);
    }
    setIsMobileMenuOpen(false);
    setExpandedCategory(null);
  };

  const renderCategory = (category: typeof allCategories[0], isMobile = false) => {
    const Icon = category.icon;
    // Use activeSubcategories if this is the active category, otherwise fetch from categories
    const subcategories = activeCategory === category.id ? activeSubcategories :
      categories.find(cat => cat.slug === category.id)?.subcategories || [];
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
              Todo en {category.label.toLowerCase()}
            </DropdownMenuItem>
            {subcategories.map((subcategory) => (
              <DropdownMenuItem
                key={subcategory.id}
                onClick={() => {
                  if (activeCategory !== category.id) {
                    onCategoryChange(category.id);
                  }
                  handleSubcategoryClick(subcategory.id);
                }}
                className={isActive && activeSubcategory === subcategory.id ? "bg-accent" : ""}
              >
                {subcategory.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    );
  };

  const renderMobileCategory = (category: typeof allCategories[0]) => {
    const Icon = category.icon;
    const subcategories = activeCategory === category.id ? activeSubcategories :
      categories.find(cat => cat.slug === category.id)?.subcategories || [];
    const hasSubs = subcategories.length > 0;
    const isActive = activeCategory === category.id;
    const isExpanded = expandedCategory === category.id;

    return (
      <div key={category.id} className="border-b border-border">
        <Button
          variant="ghost"
          className="w-full justify-between p-4 h-auto hover:bg-accent"
          onClick={() => {
            if (!hasSubs) {
              handleMobileCategoryClick(category.id);
            } else {
              toggleCategoryExpansion(category.id);
            }
          }}
        >
          <div className="flex items-center">
            <Icon className="h-4 w-4 mr-3" />
            <span>{category.label}</span>
          </div>
          {hasSubs && (
            <ChevronRight
              className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            />
          )}
        </Button>

        {hasSubs && isExpanded && (
          <div className="pl-8 pb-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start p-2 h-8 mb-1 hover:bg-accent"
              onClick={() => handleMobileCategoryClick(category.id)}
            >
              <span className="text-sm text-muted-foreground">
                Todo en {category.label.toLowerCase()}
              </span>
            </Button>
            {subcategories.map((subcategory) => (
              <Button
                key={subcategory.id}
                variant="ghost"
                size="sm"
                className={`w-full justify-start p-2 h-8 mb-1 hover:bg-accent ${
                  isActive && activeSubcategory === subcategory.id ? "bg-accent" : ""
                }`}
                onClick={() => handleMobileSubcategoryClick(subcategory.id, category.id)}
              >
                <span className="text-sm">{subcategory.name}</span>
              </Button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
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

            {/* Mobile Hamburger Menu */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={toggleMobileMenu}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={toggleMobileMenu}
          />
          <div className="fixed top-0 right-0 z-50 h-full w-80 bg-background border-l shadow-lg transform transition-transform duration-300 ease-in-out">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Categorías</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="overflow-y-auto h-full pb-20">
              {allCategories.map(category => renderMobileCategory(category))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
