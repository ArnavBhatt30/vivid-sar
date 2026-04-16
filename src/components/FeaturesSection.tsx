import { motion } from "framer-motion";
import { Satellite, Brain, Zap, Layers, Download, Globe } from "lucide-react";
import { ParallaxCard } from "./MicroInteractions";

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

const features = [
  {
    icon: Satellite,
    title: "SAR Data Input",
    desc: "Ingest SAR data from Sentinel-1 or custom radar sources. Supports common satellite imagery formats.",
  },
  {
    icon: Brain,
    title: "GAN-Powered Engine",
    desc: "Conditional adversarial network with U-Net generator delivers photorealistic colorization at pixel level.",
  },
  {
    icon: Zap,
    title: "Fast Inference",
    desc: "Optimized pipeline processes images in seconds. Designed for efficient batch processing.",
  },
  {
    icon: Globe,
    title: "Global Coverage",
    desc: "Process SAR imagery from any location on Earth captured by supported satellite platforms.",
  },
  {
    icon: Layers,
    title: "Multi-Format Export",
    desc: "Export colorized results in GeoTIFF, PNG, or JPEG format with geospatial metadata preserved.",
  },
  {
    icon: Download,
    title: "API Access",
    desc: "REST API for programmatic access. Integrate colorization into your own analysis pipelines.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 sm:py-36 relative">
      <div className="absolute inset-0 bg-mesh opacity-50" />
      <div className="container mx-auto px-5 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          className="text-center mb-12 sm:mb-20"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/70 mb-4 sm:mb-5">
            Capabilities
          </p>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.045em] mb-4 sm:mb-6">
            Tools to{" "}
            <span className="text-gradient-hero">transform SAR data</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed font-light px-2 sm:px-0">
            From raw radar to RGB imagery — a research pipeline for satellite image colorization.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <ParallaxCard key={f.title}>
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08, ease }}
                className="group glass-card rounded-2xl p-5 sm:p-8 hover:glass-elevated transition-all duration-500 cursor-default h-full"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl glass-elevated flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 group-hover:glow-sm transition-all duration-400">
                  <f.icon size={20} className="text-primary/70 group-hover:text-primary transition-colors duration-300" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold tracking-[-0.02em] mb-2 sm:mb-3">{f.title}</h3>
                <p className="text-sm sm:text-[15px] text-muted-foreground leading-[1.75] font-light">{f.desc}</p>
              </motion.div>
            </ParallaxCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
