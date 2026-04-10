import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ComparisonSlider from "@/components/ComparisonSlider";
import UploadSection from "@/components/UploadSection";
import TeamSection from "@/components/TeamSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ComparisonSlider />
      <UploadSection />
      <TeamSection />
      <Footer />
    </div>
  );
};

export default Index;
