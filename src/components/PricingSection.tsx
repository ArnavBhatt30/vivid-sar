import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "forever",
    description: "For researchers exploring SAR colorization.",
    features: ["50 images / month", "Standard resolution", "PNG export", "Community support"],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/ month",
    description: "For teams processing satellite imagery at scale.",
    features: ["5,000 images / month", "Full resolution output", "GeoTIFF + API access", "Priority support", "Batch processing", "Version history"],
    cta: "Start Pro Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For defense & government with compliance needs.",
    features: ["Unlimited images", "On-premise deployment", "Custom model training", "SLA guarantee", "Dedicated support", "SOC 2 compliant"],
    cta: "Contact Sales",
    highlighted: false,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-32 mesh-bg relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-xs font-medium uppercase tracking-widest text-primary mb-4 block">Pricing</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold tracking-tight mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground text-lg">
            Start free. Scale when you're ready.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`glass-card p-8 flex flex-col ${
                plan.highlighted ? "glow-border border-primary/40 relative" : ""
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                  Most Popular
                </div>
              )}
              <h3 className="font-heading font-semibold text-lg text-foreground">{plan.name}</h3>
              <div className="mt-4 mb-2 flex items-baseline gap-1">
                <span className="text-4xl font-heading font-bold text-foreground">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-foreground/80">
                    <Check size={16} className="text-primary flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                className={
                  plan.highlighted
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 w-full"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80 w-full"
                }
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
