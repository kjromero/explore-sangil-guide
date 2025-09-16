import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Instagram, ShoppingCart } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";

// Helper to dynamically import images from assets
const getImageUrl = (imageName: string) => {
  return new URL(`../assets/${imageName}`, import.meta.url).href;
};

export function ShopSection() {
  const { data: products = [], isLoading, error } = useProducts();

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
            Take a piece of San Gil's adventure spirit home with you.
            Premium quality apparel featuring stunning local artwork.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {products.map((product) => (
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
                  View on Instagram
                </Button>
                
                <Button 
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    // Mock add to cart functionality
                    console.log('Added to cart:', product.name);
                  }}
                >
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            variant="secondary" 
            onClick={() => window.open('https://instagram.com/sangiltourism', '_blank')}
          >
            <Instagram className="h-4 w-4 mr-2" />
            Follow @sangiltourism for more
          </Button>
        </div>
      </div>
    </section>
  );
}
