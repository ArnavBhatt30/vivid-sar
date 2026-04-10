import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import UserAvatarDropdown from "./UserAvatarDropdown";

const navLinks = [
  { label: "Features", href: "#colorizer" },
  { label: "Research", href: "/research" },
  { label: "Pricing", href: "/pricing" },
  { label: "API Docs", href: "/docs" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-apple ${
          scrolled || mobileOpen
            ? "bg-background/50 backdrop-blur-3xl border-b border-foreground/[0.04]"
            : "bg-transparent"
        }`}
      >
        <nav className="container mx-auto flex h-[4.5rem] items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative h-8 w-8">
              <div className="absolute inset-0 rounded-lg bg-primary/15 group-hover:bg-primary/25 transition-colors duration-400" />
              <div className="absolute inset-1.5 rounded-md bg-primary" />
            </div>
            <span className="text-lg font-semibold tracking-[-0.03em] text-foreground">
              SAR<span className="text-primary">Chroma</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => (
              item.href.startsWith("#") ? (
                <a key={item.label} href={item.href} className="px-5 py-2.5 text-[15px] text-muted-foreground/60 hover:text-foreground transition-colors duration-300 rounded-xl hover:bg-foreground/[0.04]">
                  {item.label}
                </a>
              ) : (
                <Link key={item.label} to={item.href} className="px-5 py-2.5 text-[15px] text-muted-foreground/60 hover:text-foreground transition-colors duration-300 rounded-xl hover:bg-foreground/[0.04]">
                  {item.label}
                </Link>
              )
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {loading ? null : user ? (
              <>
                <Button variant="glow" size="default" className="rounded-xl text-[15px]" asChild>
                  <Link to="/dashboard">Open App</Link>
                </Button>
                <UserAvatarDropdown />
              </>
            ) : (
              <>
                <Button variant="ghost" size="default" className="rounded-xl text-[15px]" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button variant="glow" size="default" className="rounded-xl text-[15px]" asChild>
                  <Link to="/auth">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button onClick={() => setMobileOpen(!mobileOpen)} className="relative w-11 h-11 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04] transition-colors">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0 z-40 bg-background/90 backdrop-blur-3xl md:hidden">
            <motion.nav initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }} className="flex flex-col items-center justify-center h-full gap-3 px-6">
              {navLinks.map((item, i) => (
                <motion.div key={item.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: i * 0.05 }}>
                  {item.href.startsWith("#") ? (
                    <a href={item.href} onClick={() => setMobileOpen(false)} className="block w-full max-w-xs text-center py-5 text-xl font-medium text-foreground/60 hover:text-foreground rounded-2xl hover:bg-foreground/[0.04] transition-all duration-300">{item.label}</a>
                  ) : (
                    <Link to={item.href} onClick={() => setMobileOpen(false)} className="block w-full max-w-xs text-center py-5 text-xl font-medium text-foreground/60 hover:text-foreground rounded-2xl hover:bg-foreground/[0.04] transition-all duration-300">{item.label}</Link>
                  )}
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: navLinks.length * 0.05 }} className="mt-8">
                {user ? (
                  <Button variant="glow" size="lg" className="rounded-2xl px-10 text-base" asChild onClick={() => setMobileOpen(false)}>
                    <Link to="/dashboard">Open App</Link>
                  </Button>
                ) : (
                  <Button variant="glow" size="lg" className="rounded-2xl px-10 text-base" asChild onClick={() => setMobileOpen(false)}>
                    <Link to="/auth">Get Started</Link>
                  </Button>
                )}
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
