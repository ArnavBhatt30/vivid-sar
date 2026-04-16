import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Palette, Image, Map, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

const ONBOARDING_KEY = "sarchroma_onboarded";

const steps = [
  {
    icon: Palette,
    title: "Welcome to SARChroma",
    description: "Transform grayscale SAR satellite imagery into vivid, colorized visualizations using AI.",
  },
  {
    icon: LayoutDashboard,
    title: "Your Dashboard",
    description: "Track all your colorizations, monitor processing status, and view weekly/monthly analytics.",
  },
  {
    icon: Image,
    title: "Upload & Colorize",
    description: "Upload Sentinel-1 SAR data or custom images. Drag & drop supported. Add coordinates for geo-referencing.",
  },
  {
    icon: Map,
    title: "Map & Gallery",
    description: "Browse your colorization history in the Gallery. See geo-referenced results plotted on an interactive map.",
  },
];

const OnboardingTour = () => {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const done = localStorage.getItem(ONBOARDING_KEY);
    if (!done) {
      setTimeout(() => setShow(true), 1500);
    }
  }, []);

  const finish = () => {
    setShow(false);
    localStorage.setItem(ONBOARDING_KEY, "true");
  };

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else finish();
  };

  const current = steps[step];
  const Icon = current.icon;

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-background/70 backdrop-blur-xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-6"
          >
            <div className="glass-strong rounded-2xl p-6 sm:p-8 max-w-md w-full relative overflow-hidden">
              <button onClick={finish} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
                <X size={16} />
              </button>

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                    <Icon size={24} className="text-primary" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold tracking-[-0.03em] mb-2">{current.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">{current.description}</p>
                </motion.div>
              </AnimatePresence>

              {/* Progress dots */}
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  {steps.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === step ? "w-6 bg-primary" : i < step ? "w-1.5 bg-primary/40" : "w-1.5 bg-foreground/10"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={finish} className="text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5">
                    Skip
                  </button>
                  <Button variant="glow" size="sm" className="rounded-xl gap-1.5" onClick={next}>
                    {step < steps.length - 1 ? (
                      <>Next <ArrowRight size={14} /></>
                    ) : (
                      "Get Started"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OnboardingTour;
