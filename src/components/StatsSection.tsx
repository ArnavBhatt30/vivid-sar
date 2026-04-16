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
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease }}
      className="text-center glass-card rounded-2xl p-4 sm:p-8 md:p-10"
    >
      <p className="text-2xl sm:text-4xl md:text-6xl font-extrabold tracking-[-0.05em] text-gradient-hero mb-1.5 sm:mb-4 whitespace-nowrap">
        {prefix}{count.toLocaleString()}{suffix}
      </p>
      <p className="text-xs sm:text-base font-medium text-foreground/80 mb-0.5 sm:mb-1.5 tracking-[-0.01em]">{label}</p>
      <p className="text-[10px] sm:text-sm text-muted-foreground/50 font-light">{sublabel}</p>
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
    <section className="py-20 sm:py-32 relative">
      <div className="absolute inset-0 bg-radial-hero opacity-30" />
      <div className="container mx-auto px-5 sm:px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5 max-w-6xl mx-auto">
          {stats.map((stat, i) => (
            <AnimatedStat key={stat.label} {...stat} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
