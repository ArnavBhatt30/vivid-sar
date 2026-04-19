import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Grid3X3, List, Inbox, Trash2, Star, Download, Eye } from "lucide-react";
import { GallerySkeleton } from "@/components/LoadingSkeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { AnimatePresence } from "framer-motion";

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

interface ColorItem {
  id: string;
  name: string;
  created_at: string;
  source: string;
  status: string;
  lat: number | null;
  lng: number | null;
  original_url: string | null;
  colorized_url: string | null;
}

const FAVORITES_KEY = "sarchroma_favorites";

function loadFavorites(): string[] {
  try { return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]"); } catch { return []; }
}

const Gallery = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<ColorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<string[]>(loadFavorites);
  const [filter, setFilter] = useState<"all" | "favorites">("all");
  const [previewItem, setPreviewItem] = useState<ColorItem | null>(null);
  const [comparePos, setComparePos] = useState(50);

  const fetchItems = async () => {
    if (!user) { setItems([]); setLoading(false); return; }
    const { data, error } = await supabase
      .from("colorizations")
      .select("id, name, created_at, source, status, lat, lng, original_url, colorized_url")
      .order("created_at", { ascending: false });
    if (error) { console.error(error); toast.error("Failed to load gallery"); }
    setItems((data as ColorItem[]) ?? []);
    setLoading(false);
    setInitialLoad(false);
  };

  useEffect(() => { fetchItems(); }, [user]);

  // Realtime: refresh when a new colorization is saved
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("gallery-items")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "colorizations", filter: `user_id=eq.${user.id}` },
        (payload) => {
          setItems((prev) => [payload.new as ColorItem, ...prev]);
        },
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("colorizations").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.success("Deleted");
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
  };

  const handleExport = (item: ColorItem, format: "png" | "geotiff") => {
    if (item.colorized_url) {
      const a = document.createElement("a");
      a.href = item.colorized_url;
      a.download = `${item.name}_colorized.${format === "geotiff" ? "tiff" : "png"}`;
      a.click();
      toast.success(`Downloading as ${format.toUpperCase()}`);
    } else {
      toast.info("No colorized image available for download yet");
    }
  };

  let filtered = items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));
  if (filter === "favorites") filtered = filtered.filter((i) => favorites.includes(i.id));

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }} className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-[-0.04em]">Gallery</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">Browse your colorization history</p>
      </motion.div>

      {/* Toolbar */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1, ease }} className="flex items-center gap-2 sm:gap-3 mb-5 sm:mb-6">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-9 sm:h-10 rounded-lg sm:rounded-xl bg-secondary/60 border border-border/40 pl-8 sm:pl-9 pr-3 sm:pr-4 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all" />
        </div>
        <div className="flex rounded-lg border border-border/40 overflow-hidden shrink-0">
          <button onClick={() => setFilter("all")} className={`px-2.5 py-2 text-[10px] sm:text-xs font-medium transition-colors ${filter === "all" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}>All</button>
          <button onClick={() => setFilter("favorites")} className={`px-2.5 py-2 transition-colors ${filter === "favorites" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}><Star size={13} /></button>
        </div>
        <div className="flex rounded-lg border border-border/40 overflow-hidden shrink-0">
          <button onClick={() => setView("grid")} className={`p-2 transition-colors ${view === "grid" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}><Grid3X3 size={14} /></button>
          <button onClick={() => setView("list")} className={`p-2 transition-colors ${view === "list" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}><List size={14} /></button>
        </div>
      </motion.div>

      {loading && initialLoad ? (
        <GallerySkeleton />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-foreground/[0.04] flex items-center justify-center mb-3 sm:mb-4">
            <Inbox size={20} className="text-muted-foreground/50" />
          </div>
          <p className="text-xs sm:text-sm font-medium text-muted-foreground">
            {filter === "favorites" ? "No favorites yet" : "No colorizations yet"}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground/60 mt-1 max-w-xs">
            {filter === "favorites" ? "Star items to add them to favorites." : "Upload a SAR image to get started."}
          </p>
        </div>
      ) : (
        <>
          {view === "grid" ? (
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 * i, ease }}
                  className="glass-elevated rounded-xl sm:rounded-2xl overflow-hidden group hover:border-border/40 transition-all duration-300"
                >
                  <div className="aspect-[16/10] bg-foreground/[0.03] flex items-center justify-center relative">
                    {item.colorized_url ? (
                      <img src={item.colorized_url} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] sm:text-xs text-muted-foreground/40">Preview not available</span>
                    )}
                    {/* Hover actions */}
                    <div className="absolute inset-0 bg-background/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                      <button onClick={() => setPreviewItem(item)} className="w-8 h-8 rounded-lg bg-foreground/10 flex items-center justify-center text-foreground hover:bg-foreground/20 transition-colors" title="Preview">
                        <Eye size={14} />
                      </button>
                      <button onClick={() => handleExport(item, "png")} className="w-8 h-8 rounded-lg bg-foreground/10 flex items-center justify-center text-foreground hover:bg-foreground/20 transition-colors" title="Download PNG">
                        <Download size={14} />
                      </button>
                      <button onClick={() => toggleFavorite(item.id)} className={`w-8 h-8 rounded-lg bg-foreground/10 flex items-center justify-center transition-colors hover:bg-foreground/20 ${favorites.includes(item.id) ? "text-amber-400" : "text-foreground"}`} title="Favorite">
                        <Star size={14} fill={favorites.includes(item.id) ? "currentColor" : "none"} />
                      </button>
                    </div>
                  </div>
                  <div className="p-3 sm:p-4 flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold tracking-[-0.01em] truncate">{item.name}</p>
                      <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-1.5 flex-wrap">
                        <p className="text-[10px] sm:text-xs text-muted-foreground">{formatDate(item.created_at)}</p>
                        <span className="text-[10px] sm:text-xs font-medium text-primary/80 bg-primary/10 px-1.5 sm:px-2 py-0.5 rounded-full">{item.source}</span>
                        <span className={`text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 rounded-full ${item.status === "Complete" ? "text-emerald-400 bg-emerald-400/10" : "text-amber-400 bg-amber-400/10"}`}>{item.status}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <button onClick={() => toggleFavorite(item.id)} className={`p-1 transition-colors ${favorites.includes(item.id) ? "text-amber-400" : "text-muted-foreground hover:text-amber-400"}`}>
                        <Star size={13} fill={favorites.includes(item.id) ? "currentColor" : "none"} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="text-muted-foreground hover:text-destructive transition-colors p-1">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="glass-elevated rounded-xl sm:rounded-2xl overflow-hidden divide-y divide-border/20">
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.03 * i, ease }}
                  className="flex items-center justify-between px-3 sm:px-5 py-3 sm:py-3.5 hover:bg-foreground/[0.02] transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium truncate">{item.name}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{formatDate(item.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 ml-2">
                    <span className="text-[10px] sm:text-xs font-medium text-primary/80 bg-primary/10 px-1.5 sm:px-2 py-0.5 rounded-full hidden sm:inline">{item.source}</span>
                    <span className={`text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 rounded-full ${item.status === "Complete" ? "text-emerald-400 bg-emerald-400/10" : "text-amber-400 bg-amber-400/10"}`}>{item.status}</span>
                    <button onClick={() => handleExport(item, "png")} className="text-muted-foreground hover:text-primary transition-colors p-1" title="Download"><Download size={13} /></button>
                    <button onClick={() => toggleFavorite(item.id)} className={`p-1 transition-colors ${favorites.includes(item.id) ? "text-amber-400" : "text-muted-foreground hover:text-amber-400"}`}>
                      <Star size={13} fill={favorites.includes(item.id) ? "currentColor" : "none"} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="text-muted-foreground hover:text-destructive transition-colors p-1">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Before/After Preview Modal */}
      <AnimatePresence>
        {previewItem && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-background/70 backdrop-blur-xl" onClick={() => setPreviewItem(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="fixed inset-0 z-[101] flex items-center justify-center p-6"
            >
              <div className="glass-strong rounded-2xl p-4 sm:p-6 max-w-2xl w-full relative">
                <button onClick={() => setPreviewItem(null)} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors z-10">
                  <span className="sr-only">Close</span>✕
                </button>
                <h3 className="text-sm font-semibold mb-3">{previewItem.name}</h3>

                {previewItem.original_url && previewItem.colorized_url ? (
                  <div className="relative aspect-video rounded-xl overflow-hidden select-none">
                    <img src={previewItem.colorized_url} alt="Colorized" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - comparePos}% 0 0)` }}>
                      <img src={previewItem.original_url} alt="Original" className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                    <input
                      type="range" min={0} max={100} value={comparePos}
                      onChange={(e) => setComparePos(Number(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-col-resize z-10"
                    />
                    <div className="absolute top-0 bottom-0 w-0.5 bg-white/80 pointer-events-none" style={{ left: `${comparePos}%` }}>
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white shadow-lg flex items-center justify-center">
                        <span className="text-[8px] text-black font-bold">⟷</span>
                      </div>
                    </div>
                    <div className="absolute top-2 left-2 text-[10px] font-semibold bg-black/50 text-white px-2 py-0.5 rounded-full">Original</div>
                    <div className="absolute top-2 right-2 text-[10px] font-semibold bg-primary/80 text-white px-2 py-0.5 rounded-full">Colorized</div>
                  </div>
                ) : (
                  <div className="aspect-video rounded-xl bg-foreground/[0.03] flex items-center justify-center">
                    <p className="text-xs text-muted-foreground">Before/after comparison will be available when images are processed by the model</p>
                  </div>
                )}

                <div className="flex items-center gap-2 mt-3">
                  <button onClick={() => handleExport(previewItem, "png")} className="text-xs text-primary hover:underline flex items-center gap-1"><Download size={12} /> PNG</button>
                  <button onClick={() => handleExport(previewItem, "geotiff")} className="text-xs text-primary hover:underline flex items-center gap-1"><Download size={12} /> GeoTIFF</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
