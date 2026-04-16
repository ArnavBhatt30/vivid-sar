import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Search, LayoutDashboard, Image, Map, Palette, Settings, Home, Beaker, FileText, Command } from "lucide-react";

const routes = [
  { label: "Home", path: "/", icon: Home, keywords: "home landing" },
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard, keywords: "dashboard stats overview" },
  { label: "Colorizer", path: "/colorizer", icon: Palette, keywords: "colorizer upload sar" },
  { label: "Gallery", path: "/gallery", icon: Image, keywords: "gallery history images" },
  { label: "Map View", path: "/map", icon: Map, keywords: "map location satellite" },
  { label: "Settings", path: "/settings", icon: Settings, keywords: "settings profile account" },
  { label: "Research", path: "/research", icon: Beaker, keywords: "research papers" },
  { label: "API Docs", path: "/docs", icon: FileText, keywords: "api documentation docs" },
];

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const navigate = useNavigate();

  const filtered = routes.filter(
    (r) =>
      r.label.toLowerCase().includes(query.toLowerCase()) ||
      r.keywords.includes(query.toLowerCase())
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((p) => !p);
        setQuery("");
        setSelected(0);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const go = useCallback(
    (path: string) => {
      navigate(path);
      setOpen(false);
      setQuery("");
    },
    [navigate]
  );

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((p) => Math.min(p + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((p) => Math.max(p - 1, 0));
      } else if (e.key === "Enter" && filtered[selected]) {
        go(filtered[selected].path);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, selected, filtered, go]);

  useEffect(() => setSelected(0), [query]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[100] bg-background/60 backdrop-blur-xl"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 z-[101] w-[90vw] max-w-md"
          >
            <div className="glass-strong rounded-2xl overflow-hidden shadow-2xl">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border/30">
                <Search size={16} className="text-muted-foreground shrink-0" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search pages..."
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
                />
                <kbd className="hidden sm:flex items-center gap-0.5 text-[10px] text-muted-foreground/50 bg-foreground/[0.06] px-1.5 py-0.5 rounded">
                  ESC
                </kbd>
              </div>
              <div className="max-h-64 overflow-y-auto py-2">
                {filtered.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-6">No results</p>
                ) : (
                  filtered.map((r, i) => (
                    <button
                      key={r.path}
                      onClick={() => go(r.path)}
                      onMouseEnter={() => setSelected(i)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                        i === selected
                          ? "bg-primary/10 text-primary"
                          : "text-foreground/70 hover:bg-foreground/[0.04]"
                      }`}
                    >
                      <r.icon size={16} className="shrink-0" />
                      <span className="font-medium">{r.label}</span>
                    </button>
                  ))
                )}
              </div>
              <div className="px-4 py-2 border-t border-border/20 flex items-center gap-4 text-[10px] text-muted-foreground/40">
                <span className="flex items-center gap-1"><Command size={10} />K to toggle</span>
                <span>↑↓ navigate</span>
                <span>↵ open</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
