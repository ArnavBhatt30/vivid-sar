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
    <section className="py-32 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="text-center mb-16"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-primary/70 mb-5">
            Highlights
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.04em]">
            What makes SARChroma special
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {highlights.map((h, i) => (
            <ParallaxCard key={h.label}>
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1, ease }}
                className="glass rounded-3xl p-8 flex flex-col group hover:glass-elevated transition-all duration-500 h-full"
              >
                <span className="text-[10px] font-medium text-primary/70 bg-primary/8 border border-primary/10 px-3 py-1.5 rounded-full self-start mb-6 tracking-[0.03em]">
                  {h.label}
                </span>
                <p className="text-[15px] text-foreground/75 leading-[1.8] flex-1 font-light">
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
