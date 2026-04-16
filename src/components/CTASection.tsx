import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MagneticWrap } from "./MicroInteractions";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

const CTASection = () => {
  const { user } = useAuth();
  return (
    <section className="py-20 sm:py-36 relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-hero opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[400px] sm:h-[600px] rounded-full bg-primary/[0.04] blur-[150px] sm:blur-[200px] pointer-events-none" />

      <div className="container mx-auto px-5 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease }}
          className="max-w-3xl mx-auto"
        >
          <div className="glass-strong rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-14 md:p-20 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease }}
              className="inline-flex items-center gap-2 sm:gap-2.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full glass-card mb-8 sm:mb-10"
            >
              <Sparkles size={14} className="text-primary" />
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">Free to use — open research project</span>
            </motion.div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-[-0.045em] mb-4 sm:mb-7">
              Ready to see SAR in{" "}
              <span className="text-gradient-hero">full color?</span>
            </h2>
            <p className="text-sm sm:text-lg text-muted-foreground max-w-lg mx-auto mb-8 sm:mb-14 leading-[1.7] font-light">
              Try SARChroma and see how GAN-based colorization transforms raw radar imagery into interpretable visuals.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <MagneticWrap>
                <Button variant="glow" size="lg" className="group press px-8 sm:px-10 h-12 sm:h-14 rounded-2xl text-base w-full sm:w-auto" asChild>
                  <Link to={user ? "/dashboard" : "/auth"}>
                    Get Started
                    <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </MagneticWrap>
              <Button variant="outline" size="lg" className="press px-6 sm:px-8 h-12 sm:h-14 rounded-2xl text-base border-foreground/8 bg-foreground/[0.03] hover:bg-foreground/[0.06] w-full sm:w-auto" asChild>
                <Link to="/research">Learn More</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
