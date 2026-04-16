import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, Loader2, X, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "success" | "processing" | "error";
  time: string;
  read: boolean;
}

const NotificationCenter = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchRecent = async () => {
      const { data } = await supabase
        .from("colorizations")
        .select("id, name, status, created_at")
        .order("created_at", { ascending: false })
        .limit(10);

      if (data) {
        setNotifications(
          data.map((d: any) => ({
            id: d.id,
            title: d.status === "Complete" ? "Colorization complete" : d.status === "Processing" ? "Processing..." : "Failed",
            message: d.name,
            type: d.status === "Complete" ? "success" : d.status === "Processing" ? "processing" : "error",
            time: d.created_at,
            read: d.status === "Complete",
          }))
        );
      }
    };
    fetchRecent();
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const dismiss = (id: string) => setNotifications((prev) => prev.filter((n) => n.id !== id));

  const relativeTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const iconMap = {
    success: <Check size={14} className="text-emerald-400" />,
    processing: <Loader2 size={14} className="text-amber-400 animate-spin" />,
    error: <AlertCircle size={14} className="text-destructive" />,
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors duration-200"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-[9px] font-bold text-primary-foreground flex items-center justify-center"
          >
            {unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute right-0 top-11 z-50 w-80 glass-strong rounded-xl overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
                <h3 className="text-xs font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-[10px] text-primary hover:underline">
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-8">No notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`flex items-start gap-3 px-4 py-3 border-b border-border/10 transition-colors ${
                        !n.read ? "bg-primary/[0.03]" : ""
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-foreground/[0.04] flex items-center justify-center shrink-0 mt-0.5">
                        {iconMap[n.type]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium">{n.title}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{n.message}</p>
                        <p className="text-[10px] text-muted-foreground/50 mt-0.5">{relativeTime(n.time)}</p>
                      </div>
                      <button onClick={() => dismiss(n.id)} className="text-muted-foreground/40 hover:text-foreground transition-colors shrink-0">
                        <X size={12} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;
