import { motion } from "framer-motion";
import { User, Bell, Palette, Shield, Key, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

const settingsSections = [
  {
    title: "Profile",
    icon: User,
    fields: [
      { label: "Display Name", value: "Arnav", type: "text" },
      { label: "Email", value: "arnav@sarchroma.ai", type: "email" },
      { label: "Organization", value: "SARChroma Labs", type: "text" },
    ],
  },
  {
    title: "Notifications",
    icon: Bell,
    toggles: [
      { label: "Email notifications", desc: "Receive alerts when colorization completes", enabled: true },
      { label: "Processing updates", desc: "Real-time status updates via browser", enabled: false },
      { label: "Weekly digest", desc: "Summary of activity and usage", enabled: true },
    ],
  },
  {
    title: "API Access",
    icon: Key,
    fields: [
      { label: "API Key", value: "sk-sar-••••••••••••3f9a", type: "password" },
      { label: "Webhook URL", value: "https://api.example.com/webhook", type: "url" },
    ],
  },
];

const SettingsPage = () => {
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({
    "Email notifications": true,
    "Processing updates": false,
    "Weekly digest": true,
  });

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
        {settingsSections.map((section, si) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: si * 0.08, ease }}
            className="glass-elevated rounded-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 p-5 border-b border-border/30">
              <div className="w-8 h-8 rounded-lg bg-foreground/[0.04] flex items-center justify-center">
                <section.icon size={15} className="text-muted-foreground" />
              </div>
              <h2 className="text-sm font-semibold tracking-[-0.01em]">{section.title}</h2>
            </div>

            <div className="p-5 space-y-4">
              {section.fields?.map((field) => (
                <div key={field.label}>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    defaultValue={field.value}
                    className="w-full h-10 rounded-lg bg-secondary/60 border border-border/40 px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all duration-200"
                  />
                </div>
              ))}

              {section.toggles?.map((toggle) => (
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
        ))}

        {/* Save */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3, ease }}
          className="flex justify-end"
        >
          <Button variant="glow" size="lg">
            Save Changes
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;
