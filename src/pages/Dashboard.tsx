import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Image, Zap, Clock, TrendingUp, Radar, Inbox, Activity, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardSkeleton } from "@/components/LoadingSkeleton";

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

interface DBRecord {
  id: string;
  name: string;
  created_at: string;
  status: string;
  source: string;
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<DBRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulated API usage stats (persisted per-session)
  const [apiUsage] = useState(() => ({
    used: Math.floor(Math.random() * 150) + 50,
    limit: 500,
    lastReset: new Date(Date.now() - Math.random() * 7 * 86400000).toISOString(),
  }));

  useEffect(() => {
    if (!user) { setRecords([]); setLoading(false); return; }
    supabase
      .from("colorizations")
      .select("id, name, created_at, status, source")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setRecords((data as DBRecord[]) ?? []);
        setLoading(false);
      });
  }, [user]);

  const completedCount = records.filter((r) => r.status === "Complete").length;
  const processingCount = records.filter((r) => r.status === "Processing").length;

  const weeklyData = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const counts = new Array(7).fill(0);
    const now = new Date();
    records.forEach((r) => {
      const d = new Date(r.created_at);
      const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
      if (diff < 7) counts[d.getDay()]++;
    });
    return days.map((day, i) => ({ day, colorizations: counts[i] }));
  }, [records]);

  const monthlyTrend = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const result: { month: string; value: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const m = d.getMonth();
      const y = d.getFullYear();
      const count = records.filter((r) => {
        const rd = new Date(r.created_at);
        return rd.getMonth() === m && rd.getFullYear() === y;
      }).length;
      result.push({ month: months[m], value: count });
    }
    return result;
  }, [records]);

  const stats = [
    { label: "Total Colorizations", value: records.length.toLocaleString(), icon: Image, color: "text-primary" },
    { label: "Completed", value: completedCount.toLocaleString(), icon: Zap, color: "text-emerald-400" },
    { label: "Processing", value: processingCount.toLocaleString(), icon: Clock, color: "text-amber-400" },
    { label: "This Week", value: weeklyData.reduce((a, b) => a + b.colorizations, 0).toLocaleString(), icon: TrendingUp, color: "text-violet-400" },
  ];

  const recentItems = records.slice(0, 8);
  const isEmpty = records.length === 0;
  const apiPercent = Math.round((apiUsage.used / apiUsage.limit) * 100);

  if (loading) {
    // Use skeleton
    const { DashboardSkeleton } = require("@/components/LoadingSkeleton");
    return <DashboardSkeleton />;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }} className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-[-0.04em]">Dashboard</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">Overview of your colorization pipeline</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06, ease }}
            className="glass-elevated rounded-xl sm:rounded-2xl p-3.5 sm:p-5 group hover:border-border/40 hover:scale-[1.02] transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center bg-foreground/[0.04] ${stat.color}`}>
                <stat.icon size={14} className="sm:hidden" />
                <stat.icon size={16} className="hidden sm:block" />
              </div>
            </div>
            <p className="text-lg sm:text-2xl font-bold tracking-[-0.03em]">{stat.value}</p>
            <p className="text-[11px] sm:text-sm text-muted-foreground mt-0.5 leading-tight">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts + API Usage */}
      <div className="grid lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {!isEmpty && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease }}
              className="glass-elevated rounded-xl sm:rounded-2xl p-4 sm:p-5"
            >
              <h3 className="text-xs sm:text-sm font-semibold mb-3 sm:mb-4">Weekly Activity</h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={weeklyData}>
                  <XAxis dataKey="day" tick={{ fill: "hsl(215 16% 47%)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "hsl(215 16% 47%)", fontSize: 10 }} axisLine={false} tickLine={false} width={20} />
                  <Tooltip contentStyle={{ background: "hsl(222 30% 5%)", border: "1px solid hsl(215 20% 12%)", borderRadius: 8, fontSize: 11 }} />
                  <Bar dataKey="colorizations" fill="hsl(217 91% 60%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25, ease }}
              className="glass-elevated rounded-xl sm:rounded-2xl p-4 sm:p-5"
            >
              <h3 className="text-xs sm:text-sm font-semibold mb-3 sm:mb-4">Monthly Trend</h3>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={monthlyTrend}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(217 91% 60%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(217 91% 60%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fill: "hsl(215 16% 47%)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "hsl(215 16% 47%)", fontSize: 10 }} axisLine={false} tickLine={false} width={20} />
                  <Tooltip contentStyle={{ background: "hsl(222 30% 5%)", border: "1px solid hsl(215 20% 12%)", borderRadius: 8, fontSize: 11 }} />
                  <Area type="monotone" dataKey="value" stroke="hsl(217 91% 60%)" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          </>
        )}

        {/* API Usage Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease }}
          className={`glass-elevated rounded-xl sm:rounded-2xl p-4 sm:p-5 ${isEmpty ? "lg:col-span-3" : ""}`}
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity size={14} className="text-primary" />
            <h3 className="text-xs sm:text-sm font-semibold">API Usage</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-muted-foreground">Requests</span>
                <span className="text-xs font-medium">{apiUsage.used} / {apiUsage.limit}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${apiPercent}%` }}
                  transition={{ duration: 1, delay: 0.5, ease }}
                  className={`h-full rounded-full ${apiPercent > 80 ? "bg-amber-400" : "bg-primary"}`}
                />
              </div>
              {apiPercent > 80 && (
                <div className="flex items-center gap-1 mt-1.5">
                  <AlertTriangle size={10} className="text-amber-400" />
                  <span className="text-[10px] text-amber-400">Approaching rate limit</span>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-foreground/[0.03] rounded-lg p-2.5">
                <p className="text-[10px] text-muted-foreground mb-0.5">Avg Response</p>
                <p className="text-sm font-semibold">1.2s</p>
              </div>
              <div className="bg-foreground/[0.03] rounded-lg p-2.5">
                <p className="text-[10px] text-muted-foreground mb-0.5">Success Rate</p>
                <p className="text-sm font-semibold text-emerald-400">98.5%</p>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground/50">Resets {new Date(new Date(apiUsage.lastReset).getTime() + 30 * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
          </div>
        </motion.div>
      </div>

      {/* Recent */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35, ease }}
        className="glass-elevated rounded-xl sm:rounded-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border/30">
          <h2 className="text-xs sm:text-sm font-semibold tracking-[-0.01em]">Recent Colorizations</h2>
        </div>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center px-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-foreground/[0.04] flex items-center justify-center mb-3 sm:mb-4">
              <Inbox size={20} className="text-muted-foreground/50" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">No colorizations yet</p>
            <p className="text-xs sm:text-sm text-muted-foreground/60 mt-1 max-w-xs">
              Upload a SAR image to get started — your results will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/20">
            {recentItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.35 + i * 0.05, ease }}
                className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-3.5 hover:bg-foreground/[0.02] transition-colors duration-200"
              >
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-foreground/[0.04] flex items-center justify-center shrink-0">
                    <Radar size={12} className="sm:hidden text-muted-foreground" />
                    <Radar size={14} className="hidden sm:block text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium truncate">{item.name}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{relativeTime(item.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                  <span className="text-xs sm:text-sm text-muted-foreground hidden sm:block">{item.source}</span>
                  <span
                    className={`text-[10px] sm:text-xs font-medium px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full ${
                      item.status === "Complete"
                        ? "text-emerald-400 bg-emerald-400/10"
                        : item.status === "Processing"
                        ? "text-amber-400 bg-amber-400/10"
                        : "text-red-400 bg-red-400/10"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
