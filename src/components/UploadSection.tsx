import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Check, Radar, MapPin, Globe, X, Satellite } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Phase = "idle" | "scanning" | "processing" | "complete";
type Source = "sentinel1" | "sentinel2" | "custom";

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

const sources: { id: Source; label: string; subtitle: string; tag?: string; icon: typeof Radar }[] = [
  { id: "sentinel1", label: "Sentinel-1", subtitle: "Radar (Grayscale)", tag: "Recommended", icon: Radar },
  { id: "sentinel2", label: "Sentinel-2", subtitle: "Optical RGB", icon: Satellite },
  { id: "custom", label: "Custom Data", subtitle: ".tiff, .png, .jpg", icon: Upload },
];

const uploadLabels: Record<Source, { title: string; desc: string }> = {
  sentinel1: { title: "Upload Sentinel-1 SAR Data", desc: ".tiff, .safe — radar intensity" },
  sentinel2: { title: "Upload Sentinel-2 Image", desc: ".tiff, .jp2 — optical bands" },
  custom: { title: "Upload Custom Image", desc: ".tiff, .png, .jpg — max 50MB" },
};

const UploadSection = () => {
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [showCoordInput, setShowCoordInput] = useState(false);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [source, setSource] = useState<Source>("sentinel1");
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
          setTimeout(() => { setPhase("idle"); setProgress(0); }, 3000);
        } else {
          setProgress(p);
        }
      }, 200);
    }, 2000);
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) { toast.error("Geolocation not supported"); return; }
    toast.info("Fetching your location...");
    navigator.geolocation.getCurrentPosition(
      (pos) => toast.success(`Location acquired: ${pos.coords.latitude.toFixed(4)}°, ${pos.coords.longitude.toFixed(4)}°`),
      () => toast.error("Unable to retrieve location"),
    );
  };

  const handleCoordSubmit = () => {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    if (isNaN(latNum) || isNaN(lngNum) || latNum < -90 || latNum > 90 || lngNum < -180 || lngNum > 180) {
      toast.error("Please enter valid coordinates"); return;
    }
    toast.success(`Segmenting at ${latNum.toFixed(4)}°, ${lngNum.toFixed(4)}°`);
    setShowCoordInput(false); setLat(""); setLng("");
  };

  const currentUpload = uploadLabels[source];

  return (
    <section className="py-36 relative bg-mesh">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/70 mb-5">
            Try It Now
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-[-0.04em]">
            Upload SAR Data
          </h2>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {/* Source Selection */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="mb-10"
          >
            <p className="text-sm font-medium uppercase tracking-[0.15em] text-muted-foreground/60 text-center mb-6">
              Select Input Source
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {sources.map((s, i) => {
                const selected = source === s.id;
                const Icon = s.icon;
                return (
                  <motion.button
                    key={s.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08, ease }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSource(s.id)}
                    className={`relative rounded-2xl p-6 text-left transition-all duration-300 cursor-pointer outline-none ${
                      selected
                        ? "glass-elevated border border-primary/40 shadow-[0_0_30px_-8px_hsl(217_91%_60%_/_0.35)]"
                        : "glass-card border border-transparent hover:border-foreground/8"
                    }`}
                  >
                    {s.tag && (
                      <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                        {s.tag}
                      </span>
                    )}
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 transition-all duration-300 ${
                      selected ? "bg-primary/15" : "bg-foreground/[0.04]"
                    }`}>
                      <Icon size={20} className={`transition-colors duration-300 ${selected ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <p className={`text-base font-semibold tracking-[-0.01em] transition-colors duration-200 ${selected ? "text-foreground" : "text-foreground/80"}`}>
                      {s.label}
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5">{s.subtitle}</p>
                    {selected && (
                      <motion.div
                        layoutId="source-indicator"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Upload Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
            className="max-w-lg mx-auto"
          >
            <div className="glass-card rounded-3xl p-10 sm:p-12 text-center relative overflow-hidden">
              <div className="absolute inset-5 rounded-2xl border border-dashed border-foreground/[0.06] pointer-events-none" />
              <AnimatePresence mode="wait">
                {phase === "idle" && (
                  <motion.div key={`idle-${source}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35, ease }} className="relative z-10">
                    <div className="w-16 h-16 rounded-2xl glass-elevated flex items-center justify-center mx-auto mb-6">
                      {source === "sentinel1" && <Radar size={24} className="text-muted-foreground" />}
                      {source === "sentinel2" && <Satellite size={24} className="text-muted-foreground" />}
                      {source === "custom" && <Upload size={24} className="text-muted-foreground" />}
                    </div>
                    <p className="text-base text-foreground/90 font-semibold mb-1.5">{currentUpload.title}</p>
                    <p className="text-sm text-muted-foreground mb-8">{currentUpload.desc}</p>
                    <Button variant="glow" size="lg" className="rounded-2xl px-8" onClick={startUpload}>Select File</Button>
                  </motion.div>
                )}
                {phase === "scanning" && (
                  <motion.div key="scanning" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4, ease }} className="relative z-10 py-8">
                    <div className="w-20 h-20 mx-auto relative mb-6">
                      <div className="absolute inset-0 rounded-full border border-primary/20" />
                      <div className="absolute inset-2 rounded-full border border-primary/15" />
                      <div className="absolute inset-4 rounded-full border border-primary/10" />
                      <div className="absolute inset-0 animate-scan-rotate"><div className="w-1/2 h-px bg-gradient-to-r from-primary to-transparent absolute top-1/2 left-1/2 origin-left" /></div>
                      <div className="absolute inset-0 rounded-full border border-primary/30 animate-ring-expand" />
                      <Radar size={22} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" />
                    </div>
                    <p className="text-base text-muted-foreground">Scanning data...</p>
                  </motion.div>
                )}
                {phase === "processing" && (
                  <motion.div key="processing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35, ease }} className="relative z-10 py-8">
                    <div className="w-16 h-16 rounded-2xl glass-elevated flex items-center justify-center mx-auto mb-6">
                      <Radar size={24} className="text-primary animate-pulse-soft" />
                    </div>
                    <p className="text-base text-foreground/90 font-semibold mb-5">Colorizing...</p>
                    <div className="w-full max-w-xs mx-auto h-2 rounded-full bg-secondary overflow-hidden">
                      <motion.div className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.2, ease: "linear" }} />
                    </div>
                    <p className="text-sm text-muted-foreground mt-3">{Math.round(progress)}%</p>
                  </motion.div>
                )}
                {phase === "complete" && (
                  <motion.div key="complete" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4, ease }} className="relative z-10 py-8">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }} className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                      <Check size={28} className="text-primary" />
                    </motion.div>
                    <p className="text-base text-foreground/90 font-semibold">Colorization Complete</p>
                    <p className="text-sm text-muted-foreground mt-1.5">Your RGB output is ready</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Divider */}
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2, ease }} className="flex items-center gap-5 my-10">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-foreground/8 to-transparent" />
              <span className="text-sm font-medium uppercase tracking-[0.15em] text-muted-foreground/50 whitespace-nowrap">Or Segment by Location</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-foreground/8 to-transparent" />
            </motion.div>

            {/* Location buttons */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3, ease }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button onClick={handleCurrentLocation} className="group relative h-16 rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] press glass-card hover:border-primary/30">
                <div className="relative z-10 flex items-center justify-center gap-3 h-full px-6">
                  <MapPin size={18} className="text-primary" />
                  <span className="text-[15px] font-medium tracking-[-0.02em] text-foreground">Use Current Location</span>
                </div>
              </button>
              <button onClick={() => setShowCoordInput(!showCoordInput)} className="group relative h-16 rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] press glass-card hover:border-foreground/15">
                <div className="relative z-10 flex items-center justify-center gap-3 h-full px-6">
                  <Globe size={18} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                  <span className="text-[15px] font-medium tracking-[-0.02em] text-foreground/80 group-hover:text-foreground transition-colors">Enter Coordinates</span>
                </div>
              </button>
            </motion.div>

            {/* Coordinate input */}
            <AnimatePresence>
              {showCoordInput && (
                <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: "auto", marginTop: 16 }} exit={{ opacity: 0, height: 0, marginTop: 0 }} transition={{ duration: 0.35, ease }} className="overflow-hidden">
                  <div className="glass-card rounded-2xl p-6 relative">
                    <button onClick={() => setShowCoordInput(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"><X size={16} /></button>
                    <div className="grid grid-cols-2 gap-4 mb-5">
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Latitude</label>
                        <input type="number" step="any" placeholder="e.g. 28.6139" value={lat} onChange={(e) => setLat(e.target.value)} className="w-full h-12 rounded-xl bg-secondary/60 border border-border/40 px-4 text-base text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Longitude</label>
                        <input type="number" step="any" placeholder="e.g. 77.2090" value={lng} onChange={(e) => setLng(e.target.value)} className="w-full h-12 rounded-xl bg-secondary/60 border border-border/40 px-4 text-base text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200" />
                      </div>
                    </div>
                    <Button variant="glow" size="lg" className="w-full rounded-xl" onClick={handleCoordSubmit}>Start Segmentation</Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default UploadSection;
