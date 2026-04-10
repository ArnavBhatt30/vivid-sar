import { motion } from "framer-motion";
import { Upload, Cpu, Download } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload SAR Data",
    description: "Drag and drop your SAR imagery or connect via API. We support GeoTIFF, HDF5, and all standard formats.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI Colorization",
    description: "Our deep neural network analyzes radar backscatter patterns and generates photorealistic color mappings.",
  },
  {
    icon: Download,
    step: "03",
    title: "Export Results",
    description: "Download colorized imagery with full metadata preservation. GeoTIFF, PNG, or stream via API.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-32 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-xs font-medium uppercase tracking-widest text-primary mb-4 block">How It Works</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold tracking-tight mb-4">
            Three Steps to Color
          </h2>
          <p className="text-muted-foreground text-lg">
            From raw radar to vivid imagery in under a minute.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative text-center"
            >
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary/30 to-transparent" />
              )}
              <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
                <step.icon size={24} className="text-primary" />
              </div>
              <span className="text-xs font-mono text-primary/60 mb-2 block">{step.step}</span>
              <h3 className="font-heading font-semibold text-xl mb-3 text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
