import { Button } from "@/components/ui/button";
import heroImage from "@/assets/san-gil-hero.jpg";

interface WelcomeScreenProps {
  onExplore: () => void;
}

export function WelcomeScreen({ onExplore }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Image Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Discover
            <span className="block bg-gradient-sunset bg-clip-text text-transparent">
              San Gil
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
            The adventure capital of Colombia awaits you. Explore authentic flavors, 
            thrilling adventures, and rich culture in the heart of Santander.
          </p>
          
          <Button 
            variant="hero" 
            size="xl"
            onClick={onExplore}
            className="animate-scale-in"
          >
            Explore More
          </Button>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}