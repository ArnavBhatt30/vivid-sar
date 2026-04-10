import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Grid3X3, List, Download, Eye, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import sarColorized from "@/assets/sar-colorized.jpg";
import sarGrayscale from "@/assets/sar-grayscale.jpg";

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

const galleryItems = [
  { id: 1, name: "Mumbai Coastal", date: "Apr 8, 2026", source: "Sentinel-1", resolution: "4096×4096", img: sarColorized },
  { id: 2, name: "Delhi Urban Scan", date: "Apr 7, 2026", source: "Sentinel-1", resolution: "2048×2048", img: sarGrayscale },
  { id: 3, name: "Goa Shoreline", date: "Apr 5, 2026", source: "Sentinel-2", resolution: "4096×4096", img: sarColorized },
  { id: 4, name: "Jaipur Desert", date: "Apr 3, 2026", source: "Custom", resolution: "8192×8192", img: sarGrayscale },
  { id: 5, name: "Bangalore Metro", date: "Apr 2, 2026", source: "Sentinel-2", resolution: "2048×2048", img: sarColorized },
  { id: 6, name: "Chennai Port", date: "Mar 30, 2026", source: "Sentinel-1", resolution: "4096×4096", img: sarGrayscale },
];

const Gallery = () => {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [viewerIdx, setViewerIdx] = useState<number | null>(null);
  const [exportFormat, setExportFormat] = useState<string | null>(null);

  const handleExport = (name: string, format: string) => {
    toast.success(`Exporting ${name} as ${format.toUpperCase()}...`);
    setExportFormat(null);
  };

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }} className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-[-0.04em]">Gallery</h1>
        <p className="text-sm text-muted-foreground mt-1">Browse your colorization history</p>
      </motion.div>

      {/* Toolbar */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1, ease }} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="Search images..." className="w-full h-10 rounded-xl bg-secondary/60 border border-border/40 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2"><Filter size={14} /> Filter</Button>
          <div className="flex rounded-lg border border-border/40 overflow-hidden">
            <button onClick={() => setView("grid")} className={`p-2 transition-colors ${view === "grid" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}><Grid3X3 size={14} /></button>
            <button onClick={() => setView("list")} className={`p-2 transition-colors ${view === "list" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}><List size={14} /></button>
          </div>
        </div>
      </motion.div>

      {/* Grid */}
      <div className={`grid gap-4 ${view === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
        {galleryItems.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.05, ease }}
            className="glass-elevated rounded-2xl overflow-hidden group cursor-pointer hover:border-border/40 transition-all duration-300"
          >
            <div className="relative aspect-[16/10] overflow-hidden" onClick={() => setViewerIdx(i)}>
              <img src={item.img} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:bg-foreground/10 transition-colors" onClick={(e) => { e.stopPropagation(); setViewerIdx(i); }}>
                  <Eye size={14} />
                </button>
                <div className="relative">
                  <button className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:bg-foreground/10 transition-colors" onClick={(e) => { e.stopPropagation(); setExportFormat(exportFormat === item.name ? null : item.name); }}>
                    <Download size={14} />
                  </button>
                  <AnimatePresence>
                    {exportFormat === item.name && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute bottom-full right-0 mb-2 glass-elevated rounded-lg p-1.5 min-w-[100px]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {["GeoTIFF", "PNG", "JPEG"].map((f) => (
                          <button key={f} onClick={() => handleExport(item.name, f)} className="w-full text-left px-3 py-1.5 text-xs hover:bg-foreground/5 rounded-md transition-colors">
                            {f}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm font-semibold tracking-[-0.01em]">{item.name}</p>
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-xs text-muted-foreground">{item.date}</p>
                <span className="text-xs font-medium text-primary/80 bg-primary/10 px-2 py-0.5 rounded-full">{item.source}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Full-screen viewer */}
      <AnimatePresence>
        {viewerIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-2xl flex items-center justify-center"
            onClick={() => setViewerIdx(null)}
          >
            <button className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors z-10" onClick={() => setViewerIdx(null)}>
              <X size={24} />
            </button>
            {viewerIdx > 0 && (
              <button className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-foreground/10 transition-colors z-10" onClick={(e) => { e.stopPropagation(); setViewerIdx(viewerIdx - 1); }}>
                <ChevronLeft size={20} />
              </button>
            )}
            {viewerIdx < galleryItems.length - 1 && (
              <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-foreground/10 transition-colors z-10" onClick={(e) => { e.stopPropagation(); setViewerIdx(viewerIdx + 1); }}>
                <ChevronRight size={20} />
              </button>
            )}
            <motion.div
              key={viewerIdx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease }}
              className="max-w-4xl max-h-[80vh] px-6"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={galleryItems[viewerIdx].img} alt={galleryItems[viewerIdx].name} className="w-full h-full object-contain rounded-xl" />
              <div className="text-center mt-4">
                <p className="text-sm font-semibold">{galleryItems[viewerIdx].name}</p>
                <p className="text-xs text-muted-foreground mt-1">{galleryItems[viewerIdx].resolution} · {galleryItems[viewerIdx].source}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
