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
    <section className="py-32 relative">
      <div className="absolute inset-0 bg-mesh opacity-40" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="text-center mb-20"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-primary/70 mb-5">
            Capabilities
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[-0.045em] mb-5">
            Tools to{" "}
            <span className="text-gradient-hero">transform SAR data</span>
          </h2>
          <p className="text-[15px] text-muted-foreground max-w-lg mx-auto leading-relaxed font-light">
            From raw radar to RGB imagery — a research pipeline for satellite image colorization.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {features.map((f, i) => (
            <ParallaxCard key={f.title}>
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07, ease }}
                className="group glass rounded-3xl p-7 hover:glass-elevated transition-all duration-500 cursor-default h-full"
              >
                <div className="w-12 h-12 rounded-2xl glass-elevated flex items-center justify-center mb-5 group-hover:scale-110 group-hover:glow-sm transition-all duration-400">
                  <f.icon size={20} className="text-primary/80 group-hover:text-primary transition-colors duration-300" />
                </div>
                <h3 className="text-[15px] font-semibold tracking-[-0.02em] mb-2.5">{f.title}</h3>
                <p className="text-[13px] text-muted-foreground leading-[1.7] font-light">{f.desc}</p>
              </motion.div>
            </ParallaxCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
