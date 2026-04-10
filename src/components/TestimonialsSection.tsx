import { motion } from "framer-motion";
import { Star } from "lucide-react";

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

const testimonials = [
  {
    quote: "SARChroma has transformed how we analyze flood damage. The colorized outputs are indistinguishable from optical imagery.",
    name: "Dr. Priya Sharma",
    title: "Remote Sensing Lead, ISRO",
    stars: 5,
  },
  {
    quote: "We reduced our SAR interpretation time by 80%. The API integration with our existing pipeline was seamless.",
    name: "Marcus Chen",
    title: "Principal Engineer, Planet Labs",
    stars: 5,
  },
  {
    quote: "The accuracy metrics speak for themselves — 0.94 SSIM across our test set. Best in class for SAR-to-RGB translation.",
    name: "Prof. Elena Kovacs",
    title: "Computer Vision Lab, ETH Zurich",
    stars: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-28 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="text-center mb-14"
        >
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary/80 mb-4">
            Testimonials
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em]">
            Loved by researchers worldwide
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease }}
              className="glass-elevated rounded-2xl p-6 flex flex-col group hover:border-border/40 transition-all duration-300"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.stars }).map((_, si) => (
                  <Star key={si} size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed flex-1 mb-6">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-xs font-semibold">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground">{t.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
