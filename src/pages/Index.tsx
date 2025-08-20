import { useState } from 'react';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { FilterBar, type Category } from '@/components/FilterBar';
import { MapView } from '@/components/MapView';
import { DetailModal } from '@/components/DetailModal';
import { ShopSection } from '@/components/ShopSection';
import type { Location } from '@/types';

const Index = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleExplore = () => {
    setShowWelcome(false);
  };

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedLocation(null);
  };

  if (showWelcome) {
    return <WelcomeScreen onExplore={handleExplore} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <FilterBar 
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        onMenuToggle={() => setShowMobileMenu(!showMobileMenu)}
      />
      
      <MapView 
        activeCategory={activeCategory}
        onLocationSelect={handleLocationSelect}
      />
      
      <ShopSection />
      
      <DetailModal 
        location={selectedLocation}
        isOpen={showDetailModal}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Index;
