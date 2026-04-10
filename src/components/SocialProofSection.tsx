import { motion } from "framer-motion";

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

const logos = [
  { name: "ESA", letters: "ESA" },
  { name: "NASA", letters: "NASA" },
  { name: "ISRO", letters: "ISRO" },
  { name: "DLR", letters: "DLR" },
  { name: "JAXA", letters: "JAXA" },
  { name: "CNES", letters: "CNES" },
];

const SocialProofSection = () => {
  return (
    <section className="py-16 relative border-y border-border/10">
      <div className="container mx-auto px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          className="text-center text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground/50 mb-10"
        >
          Trusted by researchers at leading space agencies
        </motion.p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {logos.map((logo, i) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06, ease }}
              className="text-xl sm:text-2xl font-bold tracking-[0.1em] text-muted-foreground/20 hover:text-muted-foreground/40 transition-colors duration-300 select-none"
            >
              {logo.letters}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
