import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MagneticWrap } from "./MicroInteractions";
import { Link } from "react-router-dom";

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

const CTASection = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-hero opacity-40" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-primary/[0.03] blur-[180px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          className="max-w-3xl mx-auto"
        >
          <div className="glass-strong rounded-[2rem] p-12 sm:p-16 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
            >
              <Sparkles size={13} className="text-primary" />
              <span className="text-[11px] font-medium text-muted-foreground">Free to use — open research project</span>
            </motion.div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.045em] mb-6">
              Ready to see SAR in{" "}
              <span className="text-gradient-hero">full color?</span>
            </h2>
            <p className="text-[15px] text-muted-foreground max-w-md mx-auto mb-12 leading-[1.7] font-light">
              Try SARChroma and see how GAN-based colorization transforms raw radar imagery into interpretable visuals.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <MagneticWrap>
                <Button variant="glow" size="lg" className="group press px-8 h-13 rounded-2xl text-[15px]" asChild>
                  <Link to="/auth">
                    Get Started
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </MagneticWrap>
              <Button variant="outline" size="lg" className="press px-7 h-13 rounded-2xl text-[15px] border-foreground/10 bg-foreground/[0.03] hover:bg-foreground/[0.06]" asChild>
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
