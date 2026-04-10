import { motion } from "framer-motion";
import { Satellite, Brain, Zap, Layers, Download, Globe } from "lucide-react";
import { ParallaxCard } from "./MicroInteractions";

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

const features = [
  {
    icon: Satellite,
    title: "SAR Data Input",
    desc: "Ingest SAR data from Sentinel-1 or custom radar sources. Supports common satellite imagery formats.",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    icon: Brain,
    title: "GAN-Powered Engine",
    desc: "Conditional adversarial network with U-Net generator delivers photorealistic colorization at pixel level.",
    gradient: "from-violet-500/20 to-purple-500/20",
  },
  {
    icon: Zap,
    title: "Fast Inference",
    desc: "Optimized pipeline processes images in seconds. Designed for efficient batch processing.",
    gradient: "from-amber-500/20 to-orange-500/20",
  },
  {
    icon: Globe,
    title: "Global Coverage",
    desc: "Process SAR imagery from any location on Earth captured by supported satellite platforms.",
    gradient: "from-sky-500/20 to-blue-500/20",
  },
  {
    icon: Layers,
    title: "Multi-Format Export",
    desc: "Export colorized results in GeoTIFF, PNG, or JPEG format with geospatial metadata preserved.",
    gradient: "from-rose-500/20 to-pink-500/20",
  },
  {
    icon: Download,
    title: "API Access",
    desc: "REST API for programmatic access. Integrate colorization into your own analysis pipelines.",
    gradient: "from-indigo-500/20 to-violet-500/20",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-28 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="text-center mb-16"
        >
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary/80 mb-4">
            Capabilities
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[-0.04em] mb-4">
            Tools to{" "}
            <span className="text-gradient-hero">transform SAR data</span>
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            From raw radar to RGB imagery — a research pipeline for satellite image colorization.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {features.map((f, i) => (
            <ParallaxCard key={f.title}>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06, ease }}
                className="group glass rounded-2xl p-6 hover:glass-elevated hover:border-border/40 transition-all duration-500 cursor-default h-full"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon size={20} className="text-foreground/80" />
                </div>
                <h3 className="text-sm font-semibold tracking-[-0.01em] mb-2">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            </ParallaxCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
