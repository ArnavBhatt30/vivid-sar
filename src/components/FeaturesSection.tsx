import { motion } from "framer-motion";
import { Zap, Shield, Globe, Layers, BarChart3, Clock } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Real-Time Processing",
    description: "Colorize SAR images in seconds with our GPU-accelerated pipeline. No waiting, just results.",
  },
  {
    icon: Shield,
    title: "Military-Grade Accuracy",
    description: "99.2% spectral accuracy validated against multispectral ground truth datasets.",
  },
  {
    icon: Globe,
    title: "Multi-Band Support",
    description: "Works with C-band, X-band, and L-band SAR data from all major satellite platforms.",
  },
  {
    icon: Layers,
    title: "Batch Processing",
    description: "Upload thousands of images. Our API handles massive datasets with parallel processing.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track usage, accuracy metrics, and processing history in a unified control panel.",
  },
  {
    icon: Clock,
    title: "Version History",
    description: "Every colorization is versioned. Compare, rollback, and fine-tune results effortlessly.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

const FeaturesSection = () => {
  return (
    <section id="features" className="py-32 mesh-bg relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-xs font-medium uppercase tracking-widest text-primary mb-4 block">Features</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold tracking-tight mb-4">
            Built for Scale
          </h2>
          <p className="text-muted-foreground text-lg">
            Enterprise-ready infrastructure designed for researchers, defense agencies, and geospatial teams.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              className="glass-card p-6 group hover:border-primary/30 transition-all duration-300"
            >
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon size={20} className="text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2 text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
