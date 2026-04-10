import { motion } from "framer-motion";
import { User } from "lucide-react";

const members = [
  { name: "Arnav Bhatt", role: "Frontend Development" },
  { name: "Parth Dhanker", role: "Backend Development" },
];

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

const TeamSection = () => {
  return (
    <section id="about" className="py-28 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="text-center mb-14"
        >
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary/80 mb-4">
            The Team
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em]">
            Project Collaborators
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
          {members.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease }}
              whileHover={{ y: -4 }}
              className="glass-elevated rounded-2xl p-6 text-center group cursor-default transition-all duration-300 hover:border-primary/20 hover:glow-sm"
            >
              <div className="w-12 h-12 rounded-full glass flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 transition-colors duration-300">
                <User size={20} className="text-muted-foreground group-hover:text-primary transition-colors duration-300" />
              </div>
              <h3 className="text-sm font-semibold text-foreground tracking-[-0.01em]">
                {member.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {member.role}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
