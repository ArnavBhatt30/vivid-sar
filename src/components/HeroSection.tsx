import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-grid" />
      <div className="absolute inset-0 bg-radial-hero" />

      {/* Ambient orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-primary/[0.07] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-[hsl(180_70%_55%_/_0.04)] blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 pt-24 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass mb-10"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="text-xs font-medium text-muted-foreground tracking-wide">
              Now processing 50K+ images daily
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
            className="text-[clamp(2.5rem,7vw,5.5rem)] font-extrabold tracking-[-0.045em] leading-[1.05] mb-6"
          >
            Giving Radar a{" "}
            <span className="text-gradient-hero animate-gradient-shift glow-text">
              New Lens.
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
            className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed font-light"
          >
            Transform monochrome SAR satellite imagery into photorealistic RGB
            using GAN-based deep learning — revealing what radar sees but eyes cannot.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Button variant="glow" size="lg" className="group text-base" asChild>
              <a href="/auth">
                Start Free Trial
                <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>
            </Button>
            <Button variant="outline" size="lg" className="gap-2" asChild>
              <a href="/research">
                <Play size={14} className="text-primary" />
                How It Works
              </a>
            </Button>
          </motion.div>

          {/* Trust line */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5, ease }}
            className="text-[11px] text-muted-foreground/40 mt-8 tracking-wide"
          >
            No credit card required · 5 free colorizations/month · Cancel anytime
          </motion.p>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;
