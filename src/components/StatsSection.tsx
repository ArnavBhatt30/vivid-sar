import { motion } from "framer-motion";

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

const stats = [
  { value: "2.4M+", label: "Images Processed", sublabel: "and counting" },
  { value: "0.94", label: "SSIM Score", sublabel: "structural accuracy" },
  { value: "<3s", label: "Inference Time", sublabel: "per 4K image" },
  { value: "99.9%", label: "Uptime SLA", sublabel: "enterprise grade" },
];

const StatsSection = () => {
  return (
    <section className="py-24 relative bg-mesh">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease }}
              className="text-center"
            >
              <p className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.04em] text-gradient-hero mb-2">
                {stat.value}
              </p>
              <p className="text-sm font-semibold text-foreground/80 mb-0.5">{stat.label}</p>
              <p className="text-[11px] text-muted-foreground">{stat.sublabel}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
