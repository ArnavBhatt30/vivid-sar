import { motion } from "framer-motion";
import { User, Bell, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

const SettingsPage = () => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [saving, setSaving] = useState(false);

  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({
    "Email notifications": true,
    "Processing updates": false,
    "Weekly digest": true,
  });

  useEffect(() => {
    if (user) {
      setEmail(user.email ?? "");
      // Load profile
      supabase
        .from("profiles")
        .select("display_name, bio")
        .eq("user_id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data) {
            setDisplayName(data.display_name ?? "");
            setOrganization(data.bio ?? "");
          }
        });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName, bio: organization })
      .eq("user_id", user.id);
    setSaving(false);
    if (error) {
      toast.error("Failed to save changes");
    } else {
      toast.success("Settings saved");
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold tracking-[-0.04em]">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account and preferences</p>
      </motion.div>

      <div className="space-y-6">
        {/* Profile */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease }}
          className="glass-elevated rounded-2xl overflow-hidden"
        >
          <div className="flex items-center gap-3 p-5 border-b border-border/30">
            <div className="w-8 h-8 rounded-lg bg-foreground/[0.04] flex items-center justify-center">
              <User size={15} className="text-muted-foreground" />
            </div>
            <h2 className="text-sm font-semibold tracking-[-0.01em]">Profile</h2>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                className="w-full h-10 rounded-lg bg-secondary/60 border border-border/40 px-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all duration-200"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full h-10 rounded-lg bg-secondary/60 border border-border/40 px-3 text-sm text-foreground/50 focus:outline-none transition-all duration-200 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Organization</label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Your organization"
                className="w-full h-10 rounded-lg bg-secondary/60 border border-border/40 px-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all duration-200"
              />
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08, ease }}
          className="glass-elevated rounded-2xl overflow-hidden"
        >
          <div className="flex items-center gap-3 p-5 border-b border-border/30">
            <div className="w-8 h-8 rounded-lg bg-foreground/[0.04] flex items-center justify-center">
              <Bell size={15} className="text-muted-foreground" />
            </div>
            <h2 className="text-sm font-semibold tracking-[-0.01em]">Notifications</h2>
          </div>
          <div className="p-5 space-y-4">
            {[
              { label: "Email notifications", desc: "Receive alerts when colorization completes" },
              { label: "Processing updates", desc: "Real-time status updates via browser" },
              { label: "Weekly digest", desc: "Summary of activity and usage" },
            ].map((toggle) => (
              <div key={toggle.label} className="flex items-center justify-between py-1">
                <div>
                  <p className="text-sm font-medium">{toggle.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{toggle.desc}</p>
                </div>
                <button
                  onClick={() => setToggleStates((s) => ({ ...s, [toggle.label]: !s[toggle.label] }))}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                    toggleStates[toggle.label] ? "bg-primary" : "bg-secondary"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-foreground shadow-sm transition-transform duration-200 ${
                      toggleStates[toggle.label] ? "translate-x-[22px]" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* API Access */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.16, ease }}
          className="glass-elevated rounded-2xl overflow-hidden"
        >
          <div className="flex items-center gap-3 p-5 border-b border-border/30">
            <div className="w-8 h-8 rounded-lg bg-foreground/[0.04] flex items-center justify-center">
              <Key size={15} className="text-muted-foreground" />
            </div>
            <h2 className="text-sm font-semibold tracking-[-0.01em]">API Access</h2>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">API Key</label>
              <input
                type="password"
                defaultValue=""
                placeholder="No API key configured"
                className="w-full h-10 rounded-lg bg-secondary/60 border border-border/40 px-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all duration-200"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Webhook URL</label>
              <input
                type="url"
                defaultValue=""
                placeholder="https://..."
                className="w-full h-10 rounded-lg bg-secondary/60 border border-border/40 px-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all duration-200"
              />
            </div>
          </div>
        </motion.div>

        {/* Save */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3, ease }}
          className="flex justify-end"
        >
          <Button variant="glow" size="lg" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save Changes"}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;
