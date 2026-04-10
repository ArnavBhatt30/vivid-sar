import { motion } from "framer-motion";
import { useCountUp } from "@/hooks/useCountUp";

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

const AnimatedStat = ({ value, suffix, prefix, label, sublabel, delay }: {
  value: number; suffix?: string; prefix?: string; label: string; sublabel: string; delay: number;
}) => {
  const { count, ref } = useCountUp(value, 2000);
  return (
    <motion.div
      ref={ref as React.Ref<HTMLDivElement>}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease }}
      className="text-center"
    >
      <p className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.04em] text-gradient-hero mb-2">
        {prefix}{count.toLocaleString()}{suffix}
      </p>
      <p className="text-sm font-semibold text-foreground/80 mb-0.5">{label}</p>
      <p className="text-[11px] text-muted-foreground">{sublabel}</p>
    </motion.div>
  );
};

const stats = [
  { value: 500, suffix: "+", label: "Images Processed", sublabel: "during development" },
  { value: 94, suffix: "%", prefix: "", label: "SSIM Score", sublabel: "structural accuracy" },
  { value: 3, prefix: "~", suffix: "s", label: "Inference Time", sublabel: "per image" },
  { value: 2, suffix: "", label: "Team Members", sublabel: "building this" },
];

const StatsSection = () => {
  return (
    <section className="py-24 relative bg-mesh">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {stats.map((stat, i) => (
            <AnimatedStat key={stat.label} {...stat} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
