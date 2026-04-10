import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MagneticWrap } from "./MicroInteractions";
import { Link } from "react-router-dom";

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div className="absolute inset-0 bg-radial-hero" />
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-primary/[0.05] blur-[180px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[20%] w-[400px] h-[300px] rounded-full bg-[hsl(190_80%_55%/0.04)] blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 pt-28 pb-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease }}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass mb-12"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            <span className="text-[11px] font-medium text-muted-foreground tracking-[0.02em]">
              Open-source SAR colorization project
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: 0.1, ease }}
            className="text-[clamp(2.5rem,7vw,5.5rem)] font-extrabold tracking-[-0.05em] leading-[1.02] mb-7"
          >
            Giving Radar a{" "}
            <span className="text-gradient-hero glow-text">
              New Lens.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
            className="text-[clamp(0.95rem,2vw,1.25rem)] text-muted-foreground max-w-2xl mx-auto mb-14 leading-[1.7] font-light"
          >
            Transform monochrome SAR satellite imagery into photorealistic RGB
            using GAN-based deep learning — revealing what radar sees but eyes cannot.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <MagneticWrap>
              <Button variant="glow" size="lg" className="group text-[15px] px-8 h-13 rounded-2xl press" asChild>
                <Link to="/auth">
                  Try It Out
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
            </MagneticWrap>
            <Button variant="outline" size="lg" className="gap-2.5 px-7 h-13 rounded-2xl text-[15px] press border-foreground/10 bg-foreground/[0.03] hover:bg-foreground/[0.06]" asChild>
              <Link to="/research">
                <Play size={13} className="text-primary" />
                How It Works
              </Link>
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6, ease }}
            className="text-[11px] text-muted-foreground/30 mt-10 tracking-[0.03em] font-light"
          >
            Free to use · Built with PyTorch · College research project
          </motion.p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;
