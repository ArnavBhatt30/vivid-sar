import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-apple ${
        scrolled
          ? "bg-background/70 backdrop-blur-2xl border-b border-border/30"
          : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="relative h-7 w-7">
            <div className="absolute inset-0 rounded-md bg-primary/20 group-hover:bg-primary/30 transition-colors duration-300" />
            <div className="absolute inset-1.5 rounded-sm bg-primary" />
          </div>
          <span className="text-[15px] font-semibold tracking-[-0.02em] text-foreground">
            SAR<span className="text-primary">Chroma</span>
          </span>
        </a>

        {/* Center nav */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { label: "Colorizer", href: "#colorizer" },
            { label: "Dashboard", href: "/dashboard" },
            { label: "Gallery", href: "/gallery" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="px-4 py-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-lg hover:bg-foreground/5"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Right */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="outline" size="sm">
            Docs
          </Button>
        </div>
      </nav>
    </motion.header>
  );
};

export default Navbar;
