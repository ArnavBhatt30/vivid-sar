import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Check, Radar } from "lucide-react";
import { Button } from "@/components/ui/button";

type Phase = "idle" | "scanning" | "processing" | "complete";

const ease = [0.25, 0.1, 0.25, 1] as const;

const UploadSection = () => {
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const startUpload = () => {
    setPhase("scanning");
    setProgress(0);

    setTimeout(() => {
      setPhase("processing");
      let p = 0;
      intervalRef.current = setInterval(() => {
        p += Math.random() * 12 + 3;
        if (p >= 100) {
          p = 100;
          clearInterval(intervalRef.current);
          setProgress(100);
          setTimeout(() => setPhase("complete"), 400);
          setTimeout(() => {
            setPhase("idle");
            setProgress(0);
          }, 3000);
        } else {
          setProgress(p);
        }
      }, 200);
    }, 2000);
  };

  return (
    <section className="py-28 relative bg-mesh">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="text-center mb-14"
        >
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary/80 mb-4">
            Try It Now
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em]">
            Upload SAR Data
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="max-w-lg mx-auto"
        >
          <div className="glass-elevated rounded-2xl p-8 sm:p-10 text-center relative overflow-hidden">
            {/* Dotted border */}
            <div className="absolute inset-4 rounded-xl border border-dashed border-border/40 pointer-events-none" />

            <AnimatePresence mode="wait">
              {phase === "idle" && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease }}
                  className="relative z-10"
                >
                  <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center mx-auto mb-5">
                    <Upload size={22} className="text-muted-foreground" />
                  </div>
                  <p className="text-sm text-foreground/90 font-medium mb-1">
                    Upload SAR Intensity Data
                  </p>
                  <p className="text-xs text-muted-foreground mb-6">
                    .tiff, .png, .jpg — max 50MB
                  </p>
                  <Button variant="glow" onClick={startUpload}>
                    Select File
                  </Button>
                </motion.div>
              )}

              {phase === "scanning" && (
                <motion.div
                  key="scanning"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, ease }}
                  className="relative z-10 py-6"
                >
                  <div className="w-20 h-20 mx-auto relative mb-5">
                    {/* Radar scanner */}
                    <div className="absolute inset-0 rounded-full border border-primary/20" />
                    <div className="absolute inset-2 rounded-full border border-primary/15" />
                    <div className="absolute inset-4 rounded-full border border-primary/10" />
                    <div className="absolute inset-0 animate-scan-rotate">
                      <div className="w-1/2 h-px bg-gradient-to-r from-primary to-transparent absolute top-1/2 left-1/2 origin-left" />
                    </div>
                    {/* Pulse rings */}
                    <div className="absolute inset-0 rounded-full border border-primary/30 animate-ring-expand" />
                    <div className="absolute inset-0 rounded-full border border-primary/20 animate-ring-expand" style={{ animationDelay: "0.5s" }} />
                    <Radar size={20} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">Scanning SAR data...</p>
                </motion.div>
              )}

              {phase === "processing" && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease }}
                  className="relative z-10 py-6"
                >
                  <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center mx-auto mb-5">
                    <Radar size={22} className="text-primary animate-pulse-soft" />
                  </div>
                  <p className="text-sm text-foreground/90 font-medium mb-4">
                    Colorizing...
                  </p>
                  {/* Progress bar */}
                  <div className="w-full max-w-xs mx-auto h-1.5 rounded-full bg-secondary overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.2, ease: "linear" }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{Math.round(progress)}%</p>
                </motion.div>
              )}

              {phase === "complete" && (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, ease }}
                  className="relative z-10 py-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                    className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-5"
                  >
                    <Check size={24} className="text-primary" />
                  </motion.div>
                  <p className="text-sm text-foreground/90 font-medium">
                    Colorization Complete
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your RGB output is ready
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default UploadSection;
