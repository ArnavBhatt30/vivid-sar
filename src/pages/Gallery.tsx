import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Grid3X3, List, Eye, X, ChevronLeft, ChevronRight, Inbox, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

interface ColorItem {
  id: string;
  name: string;
  created_at: string;
  source: string;
  status: string;
  lat: number | null;
  lng: number | null;
}

const Gallery = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<ColorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [viewerIdx, setViewerIdx] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const fetchItems = async () => {
    if (!user) { setItems([]); setLoading(false); return; }
    const { data, error } = await supabase
      .from("colorizations")
      .select("id, name, created_at, source, status, lat, lng")
      .order("created_at", { ascending: false });
    if (error) { console.error(error); toast.error("Failed to load gallery"); }
    setItems((data as ColorItem[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, [user]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("colorizations").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.success("Deleted");
  };

  const filtered = items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

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
          <input type="text" placeholder="Search images..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-10 rounded-xl bg-secondary/60 border border-border/40 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all" />
        </div>
        <div className="flex rounded-lg border border-border/40 overflow-hidden">
          <button onClick={() => setView("grid")} className={`p-2 transition-colors ${view === "grid" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}><Grid3X3 size={14} /></button>
          <button onClick={() => setView("list")} className={`p-2 transition-colors ${view === "list" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}><List size={14} /></button>
        </div>
      </motion.div>

      {loading ? (
        <div className="text-center py-20 text-muted-foreground text-sm">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-foreground/[0.04] flex items-center justify-center mb-4">
            <Inbox size={24} className="text-muted-foreground/50" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">No colorizations yet</p>
          <p className="text-sm text-muted-foreground/60 mt-1 max-w-xs">Upload a SAR image to get started — your results will appear here.</p>
        </div>
      ) : (
        <>
          {view === "grid" ? (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 * i, ease }}
                  className="glass-elevated rounded-2xl overflow-hidden group"
                >
                  <div className="aspect-[16/10] bg-foreground/[0.03] flex items-center justify-center">
                    <span className="text-xs text-muted-foreground/40">Preview not available</span>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold tracking-[-0.01em]">{item.name}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <p className="text-xs text-muted-foreground">{formatDate(item.created_at)}</p>
                        <span className="text-xs font-medium text-primary/80 bg-primary/10 px-2 py-0.5 rounded-full">{item.source}</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${item.status === "Complete" ? "text-emerald-400 bg-emerald-400/10" : "text-amber-400 bg-amber-400/10"}`}>{item.status}</span>
                      </div>
                    </div>
                    <button onClick={() => handleDelete(item.id)} className="text-muted-foreground hover:text-destructive transition-colors p-1">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="glass-elevated rounded-2xl overflow-hidden divide-y divide-border/20">
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.03 * i, ease }}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-foreground/[0.02] transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(item.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-primary/80 bg-primary/10 px-2 py-0.5 rounded-full">{item.source}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${item.status === "Complete" ? "text-emerald-400 bg-emerald-400/10" : "text-amber-400 bg-amber-400/10"}`}>{item.status}</span>
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
    </div>
  );
};

export default Gallery;
