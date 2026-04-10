import { motion } from "framer-motion";
import { User } from "lucide-react";

const members = [
  { name: "Arnav Bhatt", role: "Frontend Development" },
  { name: "Parth Dhanker", role: "Backend Development" },
];

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

const TeamSection = () => {
  return (
    <section id="about" className="py-32 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="text-center mb-16"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-primary/70 mb-5">
            The Team
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.04em]">
            Project Collaborators
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5 max-w-xl mx-auto">
          {members.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease }}
              whileHover={{ y: -6 }}
              className="glass rounded-3xl p-8 text-center group cursor-default transition-all duration-500 hover:glass-elevated hover:glow-sm"
            >
              <div className="w-14 h-14 rounded-2xl glass-elevated flex items-center justify-center mx-auto mb-5 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-400">
                <User size={22} className="text-muted-foreground group-hover:text-primary transition-colors duration-300" />
              </div>
              <h3 className="text-[15px] font-semibold text-foreground tracking-[-0.02em]">
                {member.name}
              </h3>
              <p className="text-[13px] text-muted-foreground/60 mt-1.5 font-light">
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
