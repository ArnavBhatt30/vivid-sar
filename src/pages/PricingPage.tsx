import { motion } from "framer-motion";
import { Check, Zap, Shield, Rocket, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "For exploration and testing",
    icon: Zap,
    features: ["5 colorizations / month", "2048×2048 max resolution", "Sentinel-1 source only", "Community support", "Standard processing queue"],
    cta: "Get Started",
    featured: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/ month",
    desc: "For researchers and professionals",
    icon: Shield,
    features: ["Unlimited colorizations", "8192×8192 max resolution", "All satellite sources", "REST API access", "Priority support", "Batch processing", "Custom export formats"],
    cta: "Start Pro Trial",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For organizations at scale",
    icon: Rocket,
    features: ["Everything in Pro", "Custom model training", "On-premise deployment", "99.9% SLA guarantee", "Dedicated support engineer", "SSO & RBAC", "Volume discounts"],
    cta: "Contact Sales",
    featured: false,
  },
];

const faqs = [
  { q: "Can I switch plans anytime?", a: "Yes. Upgrade or downgrade your plan at any time. Changes take effect immediately." },
  { q: "What happens when I hit my limit?", a: "Free tier users are paused until the next month. Pro users have no limits." },
  { q: "Do you offer academic discounts?", a: "Yes! We offer 50% off Pro for verified academic institutions. Contact us for details." },
  { q: "Is my data secure?", a: "All data is encrypted at rest and in transit. We're SOC 2 Type II compliant." },
];

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="relative pt-24 sm:pt-32 pb-12 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute inset-0 bg-radial-hero" />
        <div className="container mx-auto px-5 sm:px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="max-w-3xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease }} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass mb-5 sm:mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-[11px] sm:text-xs font-medium text-muted-foreground">14-day free trial on Pro</span>
            </motion.div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.04em] mb-4 sm:mb-6 leading-[1.05]">
              Simple, <span className="text-gradient-hero">transparent</span> pricing
            </h1>
            <p className="text-sm sm:text-lg text-muted-foreground max-w-xl mx-auto px-2 sm:px-0">Start free, scale as you grow. No hidden fees, no surprises.</p>
          </motion.div>
        </div>
      </section>

      <section className="pb-16 sm:pb-20">
        <div className="container mx-auto px-5 sm:px-6">
          <div className="grid md:grid-cols-3 gap-4 sm:gap-5 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1, ease }}
                className={`rounded-2xl p-5 sm:p-7 relative transition-all duration-300 ${
                  plan.featured
                    ? "glass-elevated border border-primary/30 shadow-[0_0_40px_-10px_hsl(217_91%_60%_/_0.3)] md:scale-[1.02]"
                    : "glass hover:border-border/40"
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground bg-primary px-4 py-1 rounded-full shadow-lg whitespace-nowrap">
                    Most Popular
                  </span>
                )}

                <plan.icon size={22} className="text-primary mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-bold tracking-[-0.02em]">{plan.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 mb-4 sm:mb-5">{plan.desc}</p>

                <div className="flex items-baseline gap-1 mb-5 sm:mb-6 flex-wrap">
                  <span className="text-3xl sm:text-4xl font-extrabold tracking-[-0.03em]">{plan.price}</span>
                  <span className="text-xs sm:text-sm text-muted-foreground">{plan.period}</span>
                </div>

                <Button variant={plan.featured ? "glow" : "outline"} className="w-full mb-5 sm:mb-6 group">
                  {plan.cta}
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                </Button>

                <ul className="space-y-2.5 sm:space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-xs sm:text-[13px] text-muted-foreground">
                      <Check size={14} className="text-primary shrink-0 mt-0.5" />
                      <span className="break-words min-w-0">{f}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 bg-mesh">
        <div className="container mx-auto px-5 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease }} className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.03em]">Frequently Asked Questions</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 max-w-3xl mx-auto">
            {faqs.map((faq, i) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08, ease }}
                className="glass-elevated rounded-xl p-4 sm:p-5"
              >
                <p className="text-sm font-semibold mb-2">{faq.q}</p>
                <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default PricingPage;
