import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import sarBefore from "@/assets/sar-before.jpg";
import sarAfter from "@/assets/sar-after.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 hero-gradient overflow-hidden">
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-8"
          >
            <Sparkles size={14} className="text-primary" />
            <span className="text-xs font-medium text-primary">AI-Powered SAR Colorization</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-heading font-bold tracking-tight leading-[1.1] mb-6"
          >
            Transform Radar into{" "}
            <span className="text-gradient">Vivid Reality</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Turn monochrome SAR satellite imagery into photorealistic color images
            using state-of-the-art deep learning. See the world in full spectrum.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium px-8 h-12 text-base">
              Start Colorizing <ArrowRight size={16} className="ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-border hover:bg-secondary font-medium px-8 h-12 text-base">
              View Demo
            </Button>
          </motion.div>
        </div>

        {/* Before / After showcase */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 max-w-5xl mx-auto"
        >
          <div className="glass-card glow-border p-2 sm:p-3">
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div className="relative rounded-xl overflow-hidden">
                <img src={sarBefore} alt="SAR grayscale input" width={960} height={640} className="w-full h-full object-cover" />
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm border border-border/50">
                  <span className="text-xs font-medium text-muted-foreground">Input — SAR</span>
                </div>
              </div>
              <div className="relative rounded-xl overflow-hidden">
                <img src={sarAfter} alt="AI colorized output" width={960} height={640} className="w-full h-full object-cover" />
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm border border-border/50">
                  <span className="text-xs font-medium text-primary">Output — Colorized</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
