import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MagneticWrap } from "./MicroInteractions";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

const HeroSection = () => {
  const { user } = useAuth();
  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
      {/* Ambient layers */}
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute inset-0 bg-radial-hero" />
      <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full bg-primary/[0.06] blur-[200px] pointer-events-none" />
      <div className="absolute bottom-[15%] right-[15%] w-[500px] h-[400px] rounded-full bg-[hsl(190_80%_55%/0.05)] blur-[150px] pointer-events-none" />
      <div className="absolute top-[40%] left-[10%] w-[300px] h-[300px] rounded-full bg-[hsl(260_60%_50%/0.04)] blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 pt-32 pb-28">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, ease }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-card mb-14"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="text-sm font-medium text-muted-foreground tracking-[-0.01em]">
              Open-source SAR colorization project
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.1, ease }}
            className="text-[clamp(3rem,8vw,6.5rem)] font-extrabold tracking-[-0.055em] leading-[0.95] mb-8"
          >
            Giving Radar a{" "}
            <br className="hidden sm:block" />
            <span className="text-gradient-hero glow-text">
              New Lens.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: 0.25, ease }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 sm:mb-16 leading-[1.65] font-light"
          >
            Transform monochrome SAR satellite imagery into photorealistic RGB
            using GAN-based deep learning — revealing what radar sees but eyes cannot.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <MagneticWrap>
              <Button variant="glow" size="lg" className="group text-base px-10 h-14 rounded-2xl press" asChild>
                <Link to={user ? "/colorizer" : "/auth"}>
                  Try It Out
                  <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
            </MagneticWrap>
            <Button variant="outline" size="lg" className="gap-3 px-8 h-14 rounded-2xl text-base press border-foreground/8 bg-foreground/[0.03] hover:bg-foreground/[0.06]" asChild>
              <Link to="/research">
                <Play size={14} className="text-primary" />
                How It Works
              </Link>
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7, ease }}
            className="text-sm text-muted-foreground/40 mt-14 tracking-[-0.01em] font-light"
          >
            Free to use · Built with PyTorch · College research project
          </motion.p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;
