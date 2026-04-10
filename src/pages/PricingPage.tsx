import { motion } from "framer-motion";
import { Check, Zap, Shield, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "For exploration and testing",
    icon: Zap,
    features: ["5 colorizations / month", "2048×2048 max resolution", "Sentinel-1 source only", "Community support"],
    cta: "Get Started",
    featured: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/ month",
    desc: "For researchers and professionals",
    icon: Shield,
    features: ["Unlimited colorizations", "8192×8192 max resolution", "All satellite sources", "API access", "Priority support", "Batch processing"],
    cta: "Start Pro Trial",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For organizations at scale",
    icon: Rocket,
    features: ["Everything in Pro", "Custom model training", "On-premise deployment", "SLA guarantee", "Dedicated support", "SSO & RBAC"],
    cta: "Contact Sales",
    featured: false,
  },
];

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute inset-0 bg-radial-hero" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary/80 mb-4">Pricing</p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-[-0.04em] mb-6">Simple, Transparent Pricing</h1>
            <p className="text-base text-muted-foreground max-w-xl mx-auto">Start free, scale as you grow. No hidden fees.</p>
          </motion.div>
        </div>
      </section>

      <section className="pb-28">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1, ease }}
                className={`rounded-2xl p-6 relative transition-all duration-300 ${
                  plan.featured
                    ? "glass-elevated border border-primary/30 shadow-[0_0_30px_-8px_hsl(217_91%_60%_/_0.25)]"
                    : "glass hover:border-border/40"
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground bg-primary px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                )}

                <plan.icon size={20} className="text-primary mb-4" />
                <h3 className="text-lg font-bold tracking-[-0.02em]">{plan.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 mb-4">{plan.desc}</p>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-bold tracking-[-0.03em]">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>

                <Button
                  variant={plan.featured ? "glow" : "outline"}
                  className="w-full mb-6"
                >
                  {plan.cta}
                </Button>

                <ul className="space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                      <Check size={14} className="text-primary shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
