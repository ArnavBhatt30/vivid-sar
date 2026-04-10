import { motion } from "framer-motion";

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

const techStack = [
  { name: "PyTorch" },
  { name: "Sentinel-1" },
  { name: "Python" },
  { name: "React" },
  { name: "GAN" },
  { name: "CUDA" },
];

const SocialProofSection = () => {
  return (
    <section className="py-20 relative border-y border-foreground/[0.04]">
      <div className="container mx-auto px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="text-center text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground/40 mb-12"
        >
          Built with industry-standard tools
        </motion.p>
        <div className="flex flex-wrap items-center justify-center gap-x-14 gap-y-8">
          {techStack.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07, ease }}
              className="text-2xl sm:text-3xl font-bold tracking-[0.08em] text-muted-foreground/15 hover:text-muted-foreground/35 transition-colors duration-500 select-none"
            >
              {item.name}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
