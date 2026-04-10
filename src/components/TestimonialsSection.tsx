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
    <section className="py-28 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="text-center mb-14"
        >
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary/80 mb-4">
            Highlights
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em]">
            What makes SARChroma special
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {highlights.map((h, i) => (
            <ParallaxCard key={h.label}>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1, ease }}
                className="glass-elevated rounded-2xl p-6 flex flex-col group hover:border-border/40 transition-all duration-300 h-full"
              >
                <span className="text-[10px] font-semibold text-primary/80 bg-primary/10 px-2.5 py-1 rounded-full self-start mb-4">
                  {h.label}
                </span>
                <p className="text-sm text-foreground/80 leading-relaxed flex-1">
                  {h.quote}
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
