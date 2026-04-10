import { motion } from "framer-motion";
import { Satellite, Brain, Zap, Shield, Globe, Layers, Download, Lock } from "lucide-react";

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

const features = [
  {
    icon: Satellite,
    title: "Multi-Source Input",
    desc: "Ingest SAR data from Sentinel-1, Sentinel-2, ALOS-2, or custom radar sources with zero configuration.",
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
    title: "Sub-3s Inference",
    desc: "Optimized CUDA pipeline processes 4K images in under 3 seconds. Batch mode for large datasets.",
    gradient: "from-amber-500/20 to-orange-500/20",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    desc: "SOC 2 compliant infrastructure. End-to-end encryption for all satellite data in transit and at rest.",
    gradient: "from-emerald-500/20 to-teal-500/20",
  },
  {
    icon: Globe,
    title: "Global Coverage",
    desc: "Process imagery from any coordinate on Earth. Integrated with ESA and NASA open data programs.",
    gradient: "from-sky-500/20 to-blue-500/20",
  },
  {
    icon: Layers,
    title: "Multi-Band Export",
    desc: "Export in GeoTIFF, PNG, JPEG, or COG format with full geospatial metadata preserved.",
    gradient: "from-rose-500/20 to-pink-500/20",
  },
  {
    icon: Download,
    title: "REST API Access",
    desc: "Full-featured API with webhooks, batch processing, and SDKs for Python, JavaScript, and Go.",
    gradient: "from-indigo-500/20 to-violet-500/20",
  },
  {
    icon: Lock,
    title: "Access Control",
    desc: "Role-based permissions, SSO integration, audit logs, and team management for organizations.",
    gradient: "from-fuchsia-500/20 to-pink-500/20",
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
            Platform Capabilities
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[-0.04em] mb-4">
            Everything you need to{" "}
            <span className="text-gradient-hero">transform SAR data</span>
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            From raw radar to actionable RGB imagery — a complete pipeline built for researchers and enterprises.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06, ease }}
              className="group glass rounded-2xl p-6 hover:glass-elevated hover:border-border/40 transition-all duration-500 cursor-default"
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <f.icon size={20} className="text-foreground/80" />
              </div>
              <h3 className="text-sm font-semibold tracking-[-0.01em] mb-2">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
