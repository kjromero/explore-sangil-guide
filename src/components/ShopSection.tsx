import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Instagram, ChevronLeft, ChevronRight } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useState, useEffect } from "react";

// Helper to dynamically import images from assets
const getImageUrl = (imageName: string) => {
  return new URL(`../assets/${imageName}`, import.meta.url).href;
};

export function ShopSection() {
  const { data: products = [], isLoading, error } = useProducts();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  // Update items per view based on screen size
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const totalSlides = Math.ceil(products.length / itemsPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Get products for current slide
  const getCurrentProducts = () => {
    const startIndex = currentIndex * itemsPerView;
    const endIndex = startIndex + itemsPerView;
    return products.slice(startIndex, endIndex);
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              San Gil
              <span className="bg-gradient-sunset bg-clip-text text-transparent"> Merch</span>
            </h2>
          </div>
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              San Gil
              <span className="bg-gradient-sunset bg-clip-text text-transparent"> Merch</span>
            </h2>
          </div>
          <div className="text-center text-red-600">
            Error al cargar los productos
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-hero">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            San Gil
            <span className="bg-gradient-sunset bg-clip-text text-transparent"> Merch</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Lleva una pieza de el espíritu aventurero de San Gil contigo.
            Prendas de alta calidad con impresionantes obras de arte locales.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-6xl mx-auto">
          {/* Navigation Buttons */}
          {totalSlides > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 rounded-full bg-white/90 backdrop-blur-sm border-primary/20 hover:bg-white transition-all duration-200 shadow-lg"
                onClick={prevSlide}
                disabled={totalSlides <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 rounded-full bg-white/90 backdrop-blur-sm border-primary/20 hover:bg-white transition-all duration-200 shadow-lg"
                onClick={nextSlide}
                disabled={totalSlides <= 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Carousel Track */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div
                  key={slideIndex}
                  className="flex-shrink-0 w-full"
                >
                  <div className={`grid gap-8 ${itemsPerView === 1 ? 'grid-cols-1 max-w-md mx-auto' : itemsPerView === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                    {products
                      .slice(slideIndex * itemsPerView, (slideIndex + 1) * itemsPerView)
                      .map((product) => (
                        <Card key={product.id} className="bg-gradient-card shadow-elegant hover:shadow-warm transition-all duration-300 transform hover:scale-105">
                          <CardHeader className="p-0">
                            <div className="h-64 rounded-t-lg overflow-hidden">
                              <img
                                src={getImageUrl(product.image)}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </CardHeader>

                          <CardContent className="p-6">
                            <CardTitle className="text-xl mb-2">{product.name}</CardTitle>
                            <p className="text-muted-foreground mb-4">{product.description}</p>
                            <div className="text-2xl font-bold text-primary">{product.price}</div>
                          </CardContent>

                          <CardFooter className="p-6 pt-0 flex gap-3">
                            <Button
                              variant="explore"
                              className="flex-1"
                              onClick={() => window.open(product.instagramUrl, '_blank')}
                            >
                              <Instagram className="h-4 w-4 mr-2" />
                              Ver en Instagram
                            </Button>
                          </CardFooter>
                        </Card>
                      ))
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Indicators */}
          {totalSlides > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentIndex
                      ? 'bg-primary scale-125'
                      : 'bg-primary/30 hover:bg-primary/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            variant="secondary" 
            onClick={() => window.open('https://instagram.com/sangiltourism', '_blank')}
          >
            <Instagram className="h-4 w-4 mr-2" />
            Sigue a @sangiltourism para más
          </Button>
        </div>
      </div>
    </section>
  );
}
