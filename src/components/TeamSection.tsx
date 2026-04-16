import { motion } from "framer-motion";
import { User } from "lucide-react";

const members = [
  { name: "Arnav Bhatt", role: "Frontend Development" },
  { name: "Parth Dhanker", role: "Backend Development" },
];

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

const TeamSection = () => {
  return (
    <section id="about" className="py-20 sm:py-36 relative">
      <div className="container mx-auto px-5 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          className="text-center mb-12 sm:mb-20"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/70 mb-4 sm:mb-5">
            The Team
          </p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-[-0.04em]">
            Project Collaborators
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 sm:gap-6 max-w-xl mx-auto">
          {members.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12, ease }}
              whileHover={{ y: -8 }}
              className="glass-card rounded-2xl p-5 sm:p-10 text-center group cursor-default transition-all duration-500 hover:glow-sm"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl glass-elevated flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-400">
                <User size={20} className="sm:hidden text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                <User size={24} className="hidden sm:block text-muted-foreground group-hover:text-primary transition-colors duration-300" />
              </div>
              <h3 className="text-sm sm:text-lg font-semibold text-foreground tracking-[-0.02em]">
                {member.name}
              </h3>
              <p className="text-xs sm:text-[15px] text-muted-foreground/50 mt-1 sm:mt-2 font-light">
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
