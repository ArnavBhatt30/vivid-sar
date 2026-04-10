import { motion } from "framer-motion";
import { Image, Zap, Clock, TrendingUp, ArrowUpRight, Radar } from "lucide-react";

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

const stats = [
  { label: "Total Colorizations", value: "1,247", change: "+12%", icon: Image, color: "text-primary" },
  { label: "Processing Speed", value: "2.3s", change: "-18%", icon: Zap, color: "text-emerald-400" },
  { label: "Avg. Resolution", value: "4K", change: "+8%", icon: TrendingUp, color: "text-violet-400" },
  { label: "Uptime", value: "99.9%", change: "Stable", icon: Clock, color: "text-amber-400" },
];

const recentItems = [
  { name: "sentinel1_mumbai_2026.tiff", date: "2 hours ago", status: "Complete", resolution: "4096×4096" },
  { name: "sar_scan_delhi_patch.png", date: "5 hours ago", status: "Complete", resolution: "2048×2048" },
  { name: "s1_coastal_goa.tiff", date: "1 day ago", status: "Complete", resolution: "4096×4096" },
  { name: "radar_intensity_jaipur.tiff", date: "2 days ago", status: "Processing", resolution: "8192×8192" },
  { name: "sentinel2_bangalore_rgb.jp2", date: "3 days ago", status: "Complete", resolution: "2048×2048" },
];

const Dashboard = () => {
  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold tracking-[-0.04em]">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of your colorization pipeline</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06, ease }}
            className="glass-elevated rounded-2xl p-5 group hover:border-border/40 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-foreground/[0.04] ${stat.color}`}>
                <stat.icon size={16} />
              </div>
              <span className="text-[11px] font-medium text-emerald-400/80 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold tracking-[-0.03em]">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25, ease }}
        className="glass-elevated rounded-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-5 border-b border-border/30">
          <h2 className="text-sm font-semibold tracking-[-0.01em]">Recent Colorizations</h2>
          <button className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
            View All <ArrowUpRight size={12} />
          </button>
        </div>
        <div className="divide-y divide-border/20">
          {recentItems.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 + i * 0.05, ease }}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-foreground/[0.02] transition-colors duration-200"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-foreground/[0.04] flex items-center justify-center shrink-0">
                  <Radar size={14} className="text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-[11px] text-muted-foreground">{item.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span className="text-xs text-muted-foreground hidden sm:block">{item.resolution}</span>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                  item.status === "Complete"
                    ? "text-emerald-400 bg-emerald-400/10"
                    : "text-amber-400 bg-amber-400/10"
                }`}>
                  {item.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
