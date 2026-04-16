import { motion } from "framer-motion";
import { ParallaxCard } from "./MicroInteractions";

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

const highlights = [
  {
    quote: "The GAN architecture produces remarkably realistic colorizations from raw SAR data, making interpretation significantly easier.",
    label: "Research Insight",
  },
  {
    quote: "Processing a 4K SAR image takes just seconds, making it practical for real-time analysis workflows.",
    label: "Performance",
  },
  {
    quote: "Supports multiple SAR input formats including Sentinel-1 and custom radar sources with minimal preprocessing.",
    label: "Flexibility",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 sm:py-36 relative">
      <div className="container mx-auto px-5 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          className="text-center mb-12 sm:mb-20"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/70 mb-4 sm:mb-5">
            Highlights
          </p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-[-0.04em]">
            What makes SARChroma special
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 max-w-6xl mx-auto">
          {highlights.map((h, i) => (
            <ParallaxCard key={h.label}>
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease }}
                className="glass-card rounded-2xl p-5 sm:p-9 flex flex-col group hover:glass-elevated transition-all duration-500 h-full"
              >
                <span className="text-xs font-semibold text-primary/80 bg-primary/8 border border-primary/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full self-start mb-5 sm:mb-7 tracking-[0.03em]">
                  {h.label}
                </span>
                <p className="text-[15px] sm:text-[17px] text-foreground/70 leading-[1.85] flex-1 font-light">
                  "{h.quote}"
                </p>
              </motion.div>
            </ParallaxCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
