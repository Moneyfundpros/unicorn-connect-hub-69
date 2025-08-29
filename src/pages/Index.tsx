
import { Hero } from '@/components/landing/Hero';
import FeaturesSection from '@/components/FeaturesSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturesSection />
      <HowItWorksSection />
      <Footer />
    </div>
  );
};

export default Index;
