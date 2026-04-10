import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SocialProofSection from "@/components/SocialProofSection";
import ComparisonSlider from "@/components/ComparisonSlider";
import FeaturesSection from "@/components/FeaturesSection";
import StatsSection from "@/components/StatsSection";
import UploadSection from "@/components/UploadSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import TeamSection from "@/components/TeamSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <SocialProofSection />
      <ComparisonSlider />
      <FeaturesSection />
      <StatsSection />
      <UploadSection />
      <TestimonialsSection />
      <TeamSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
