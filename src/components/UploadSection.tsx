import { useState, useRef, DragEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Check, Radar, MapPin, Globe, X, Plus, FileUp, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import LandCoverBar from "@/components/LandCoverBar";

interface Breakdown {
  urban: number; agriculture: number; rangeland: number; forest: number; water: number; barren: number; unknown: number;
}

type Phase = "idle" | "scanning" | "processing" | "complete";
type Source = "sentinel1" | "custom";

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

const sources: { id: Source; label: string; subtitle: string; tag?: string; icon: typeof Radar }[] = [
  { id: "sentinel1", label: "Sentinel-1", subtitle: "Radar (Grayscale)", tag: "Recommended", icon: Radar },
  { id: "custom", label: "Custom Data", subtitle: ".tiff, .png, .jpg", icon: Upload },
];

const uploadLabels: Record<Source, { title: string; desc: string; accept: string }> = {
  sentinel1: { title: "Upload Sentinel-1 SAR Data", desc: ".tiff, .png, .jpg — radar intensity", accept: ".tiff,.tif,.png,.jpg,.jpeg" },
  custom: { title: "Upload Custom Image", desc: ".tiff, .png, .jpg — max 10MB", accept: ".tiff,.tif,.png,.jpg,.jpeg" },
};

interface UploadSectionProps {
  embedded?: boolean;
}

interface QueueItem {
  id: string;
  file: File;
  progress: number;
  phase: Phase;
}

const fileToBase64 = (file: File): Promise<{ b64: string; mime: string }> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const [meta, b64] = result.split(",");
      const mime = /data:([^;]+)/.exec(meta)?.[1] ?? file.type ?? "image/png";
      resolve({ b64, mime });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const base64ToBlob = (b64: string, mime: string): Blob => {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new Blob([arr], { type: mime });
};

const UploadSection = ({ embedded }: UploadSectionProps) => {
  const { user } = useAuth();
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showCoordInput, setShowCoordInput] = useState(false);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [source, setSource] = useState<Source>("sentinel1");
  const [isDragging, setIsDragging] = useState(false);
  const [batchMode, setBatchMode] = useState(false);
  const [batchQueue, setBatchQueue] = useState<QueueItem[]>([]);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [comparisonBeforeUrl, setComparisonBeforeUrl] = useState<string | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const [breakdown, setBreakdown] = useState<Breakdown | null>(null);
  const [breakdownLoading, setBreakdownLoading] = useState(false);
  const progressTimerRef = useRef<ReturnType<typeof setInterval>>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const batchInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 1 || batchMode) {
      addToBatch(files);
    } else if (files[0]) {
      setSelectedFile(files[0]);
      void runColorization(files[0]);
    }
  };

  const startUpload = () => fileInputRef.current?.click();

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    void runColorization(file);
    e.target.value = "";
  };

  const handleBatchFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addToBatch(files);
    e.target.value = "";
  };

  const addToBatch = (files: File[]) => {
    const newItems: QueueItem[] = files.map((f) => ({
      id: crypto.randomUUID(),
      file: f,
      progress: 0,
      phase: "idle" as Phase,
    }));
    setBatchQueue((prev) => [...prev, ...newItems]);
    setBatchMode(true);
    toast.success(`Added ${files.length} file(s) to queue`);
  };

  // Animate a fake progress bar while the AI call runs
  const startProgressTimer = (onTick: (p: number) => void) => {
    let p = 0;
    progressTimerRef.current = setInterval(() => {
      p += Math.random() * 4 + 2;
      if (p >= 92) p = 92;
      onTick(p);
    }, 250);
  };
  const stopProgressTimer = () => {
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
  };

  // ---- CORE: call the colorize-sar edge function ----
  const callColorizer = async (
    payload: { imageBase64?: string; mimeType?: string; lat?: number; lng?: number },
  ) => {
    const { data, error } = await supabase.functions.invoke("colorize-sar", { body: payload });
    if (error) throw new Error(error.message || "Colorization failed");
    if (!data?.imageBase64) throw new Error(data?.error || "No image returned");
    return data as { imageBase64: string; mimeType: string };
  };

  const uploadToStorage = async (blob: Blob, path: string) => {
    const { error } = await supabase.storage.from("sar-images").upload(path, blob, {
      contentType: blob.type,
      upsert: true,
    });
    if (error) throw error;
    const { data } = supabase.storage.from("sar-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const runColorization = async (file: File) => {
    if (!user) {
      toast.error("Please sign in to colorize images");
      return;
    }
    setResultUrl(null);
    setOriginalPreview(URL.createObjectURL(file));
    setComparisonBeforeUrl(null);
    setPhase("scanning");
    setProgress(0);
    toast.info(`Processing: ${file.name}`);

    try {
      const { b64, mime } = await fileToBase64(file);
      setPhase("processing");
      startProgressTimer(setProgress);

      const result = await callColorizer({ imageBase64: b64, mimeType: mime });
      stopProgressTimer();
      setProgress(96);

      const baseName = file.name.replace(/\.[^/.]+$/, "");
      const ts = Date.now();
      const originalUrl = await uploadToStorage(file, `${user.id}/${ts}-original-${file.name}`);
      const colorBlob = base64ToBlob(result.imageBase64, result.mimeType);
      const ext = result.mimeType.split("/")[1] ?? "png";
      const colorizedUrl = await uploadToStorage(colorBlob, `${user.id}/${ts}-colorized.${ext}`);

      await supabase.from("colorizations").insert({
        user_id: user.id,
        name: baseName,
        source: source === "sentinel1" ? "Sentinel-1" : "Custom",
        status: "Complete",
        original_url: originalUrl,
        colorized_url: colorizedUrl,
        lat: lat ? parseFloat(lat) : null,
        lng: lng ? parseFloat(lng) : null,
      });

      setProgress(100);
      setResultUrl(colorizedUrl);
      setPhase("complete");
      toast.success("Colorization complete!");
    } catch (e: any) {
      stopProgressTimer();
      console.error(e);
      toast.error(e?.message || "Colorization failed");
      setPhase("idle");
      setProgress(0);
    }
  };

  const runColorizationFromCoords = async (latNum: number, lngNum: number) => {
    if (!user) {
      toast.error("Please sign in to generate colorized scenes");
      return;
    }
    setResultUrl(null);
    setOriginalPreview(null);
    setComparisonBeforeUrl(null);
    setPhase("scanning");
    setProgress(0);
    toast.info(`Generating colorized scene at ${latNum.toFixed(4)}°, ${lngNum.toFixed(4)}°`);

    try {
      setPhase("processing");
      startProgressTimer(setProgress);

      const result = await callColorizer({ lat: latNum, lng: lngNum });
      stopProgressTimer();
      setProgress(96);

      const ts = Date.now();
      const colorBlob = base64ToBlob(result.imageBase64, result.mimeType);
      const ext = result.mimeType.split("/")[1] ?? "png";
      const colorizedUrl = await uploadToStorage(colorBlob, `${user.id}/${ts}-colorized.${ext}`);

      await supabase.from("colorizations").insert({
        user_id: user.id,
        name: `Scene @ ${latNum.toFixed(3)}, ${lngNum.toFixed(3)}`,
        source: source === "sentinel1" ? "Sentinel-1" : "Custom",
        status: "Complete",
        colorized_url: colorizedUrl,
        lat: latNum,
        lng: lngNum,
      });

      setProgress(100);
      setResultUrl(colorizedUrl);
      setComparisonBeforeUrl(colorizedUrl);
      setPhase("complete");
      toast.success("Scene generated — saved to Gallery & Map!");
    } catch (e: any) {
      stopProgressTimer();
      console.error(e);
      toast.error(e?.message || "Generation failed");
      setPhase("idle");
      setProgress(0);
    }
  };

  const processBatch = () => {
    const queued = batchQueue.filter((q) => q.phase === "idle");
    queued.forEach((item, idx) => {
      setTimeout(async () => {
        setBatchQueue((prev) => prev.map((q) => q.id === item.id ? { ...q, phase: "processing", progress: 10 } : q));
        try {
          const { b64, mime } = await fileToBase64(item.file);
          setBatchQueue((prev) => prev.map((q) => q.id === item.id ? { ...q, progress: 40 } : q));
          const result = await callColorizer({ imageBase64: b64, mimeType: mime });
          setBatchQueue((prev) => prev.map((q) => q.id === item.id ? { ...q, progress: 75 } : q));

          const baseName = item.file.name.replace(/\.[^/.]+$/, "");
          const ts = Date.now();
          const originalUrl = await uploadToStorage(item.file, `${user!.id}/${ts}-original-${item.file.name}`);
          const colorBlob = base64ToBlob(result.imageBase64, result.mimeType);
          const ext = result.mimeType.split("/")[1] ?? "png";
          const colorizedUrl = await uploadToStorage(colorBlob, `${user!.id}/${ts}-colorized.${ext}`);

          await supabase.from("colorizations").insert({
            user_id: user!.id,
            name: baseName,
            source: source === "sentinel1" ? "Sentinel-1" : "Custom",
            status: "Complete",
            original_url: originalUrl,
            colorized_url: colorizedUrl,
            lat: lat ? parseFloat(lat) : null,
            lng: lng ? parseFloat(lng) : null,
          });

          setBatchQueue((prev) => prev.map((q) => q.id === item.id ? { ...q, progress: 100, phase: "complete" } : q));
        } catch (e: any) {
          console.error(e);
          toast.error(`${item.file.name}: ${e?.message || "failed"}`);
          setBatchQueue((prev) => prev.map((q) => q.id === item.id ? { ...q, phase: "idle", progress: 0 } : q));
        }
      }, idx * 600);
    });
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) { toast.error("Geolocation not supported"); return; }
    toast.info("Fetching your location...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latitude = +pos.coords.latitude.toFixed(4);
        const longitude = +pos.coords.longitude.toFixed(4);
        setLat(String(latitude));
        setLng(String(longitude));
        toast.success(`Location acquired: ${latitude}°, ${longitude}°`);
        void runColorizationFromCoords(latitude, longitude);
      },
      () => toast.error("Unable to retrieve location"),
    );
  };

  const handleCoordSubmit = () => {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    if (isNaN(latNum) || isNaN(lngNum) || latNum < -90 || latNum > 90 || lngNum < -180 || lngNum > 180) {
      toast.error("Please enter valid coordinates"); return;
    }
    setShowCoordInput(false);
    void runColorizationFromCoords(latNum, lngNum);
  };

  const currentUpload = uploadLabels[source];

  return (
    <section className={embedded ? "py-8 sm:py-12" : "py-20 sm:py-36 relative bg-mesh"}>
      <input ref={fileInputRef} type="file" accept={currentUpload.accept} onChange={handleFileSelected} className="hidden" />
      <input ref={batchInputRef} type="file" accept={currentUpload.accept} onChange={handleBatchFiles} className="hidden" multiple />

      <div className={embedded ? "px-4" : "container mx-auto px-5 sm:px-6"}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="text-center mb-10 sm:mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/70 mb-4 sm:mb-5">
            {embedded ? "Colorizer" : "Try It Now"}
          </p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-[-0.04em]">
            Upload SAR Data
          </h2>
          <p className="text-sm text-muted-foreground mt-3 max-w-md mx-auto">
            Powered by Lovable AI — drop a SAR image or pick coordinates and we'll generate a colorized RGB output.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {/* Source Selection */}
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease }} className="mb-8 sm:mb-10">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.15em] text-muted-foreground/60">
                Select Input Source
              </p>
              <button
                onClick={() => { setBatchMode(!batchMode); setBatchQueue([]); }}
                className={`text-[10px] sm:text-xs font-medium px-3 py-1 rounded-full transition-colors ${batchMode ? "bg-primary/10 text-primary" : "bg-foreground/[0.04] text-muted-foreground hover:text-foreground"}`}
              >
                {batchMode ? "Single Mode" : "Batch Mode"}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
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
                    className={`relative rounded-xl sm:rounded-2xl p-4 sm:p-6 text-left transition-all duration-300 cursor-pointer outline-none ${
                      selected
                        ? "glass-elevated border border-primary/40 shadow-[0_0_30px_-8px_hsl(217_91%_60%_/_0.35)]"
                        : "glass-card border border-transparent hover:border-foreground/8"
                    }`}
                  >
                    {s.tag && (
                      <span className="absolute top-2 right-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {s.tag}
                      </span>
                    )}
                    <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3 transition-all duration-300 ${selected ? "bg-primary/15" : "bg-foreground/[0.04]"}`}>
                      <Icon size={18} className={`transition-colors duration-300 ${selected ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <p className={`text-sm sm:text-base font-semibold tracking-[-0.01em] transition-colors duration-200 ${selected ? "text-foreground" : "text-foreground/80"}`}>
                      {s.label}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{s.subtitle}</p>
                    {selected && (
                      <motion.div layoutId="source-indicator" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Upload Card */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease }} className="max-w-lg mx-auto">
            {!batchMode ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`glass-card rounded-2xl p-5 sm:p-10 md:p-12 text-center relative overflow-hidden transition-all duration-300 ${isDragging ? "border-primary/50 bg-primary/5 scale-[1.02]" : ""}`}
              >
                <div className={`absolute inset-3 sm:inset-5 rounded-xl sm:rounded-2xl border border-dashed pointer-events-none transition-colors duration-300 ${isDragging ? "border-primary/40" : "border-foreground/[0.06]"}`} />
                <AnimatePresence mode="wait">
                  {phase === "idle" && (
                    <motion.div key={`idle-${source}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35, ease }} className="relative z-10">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl glass-elevated flex items-center justify-center mx-auto mb-4 sm:mb-6">
                        {source === "sentinel1" && <Radar size={22} className="text-muted-foreground" />}
                        {source === "custom" && <Upload size={22} className="text-muted-foreground" />}
                      </div>
                      <p className="text-sm sm:text-base text-foreground/90 font-semibold mb-1">{currentUpload.title}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-2">{isDragging ? "Drop your file here" : currentUpload.desc}</p>
                      {selectedFile && <p className="text-xs text-primary mb-3 sm:mb-4">Selected: {selectedFile.name}</p>}
                      <Button variant="glow" size="lg" className="rounded-xl sm:rounded-2xl px-6 sm:px-8 h-11 sm:h-12" onClick={startUpload}>Select File</Button>
                      <p className="text-[10px] text-muted-foreground/40 mt-3">or drag & drop</p>
                    </motion.div>
                  )}
                  {phase === "scanning" && (
                    <motion.div key="scanning" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4, ease }} className="relative z-10 py-6 sm:py-8">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto relative mb-4 sm:mb-6">
                        <div className="absolute inset-0 rounded-full border border-primary/20 animate-pulse" />
                        <div className="absolute inset-2 rounded-full border border-primary/15 animate-pulse" />
                        <div className="absolute inset-4 rounded-full border border-primary/10 animate-pulse" />
                        <Radar size={20} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" />
                      </div>
                      <p className="text-sm sm:text-base text-muted-foreground">Preparing data...</p>
                    </motion.div>
                  )}
                  {phase === "processing" && (
                    <motion.div key="processing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35, ease }} className="relative z-10 py-6 sm:py-8">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl glass-elevated flex items-center justify-center mx-auto mb-4 sm:mb-6">
                        <Radar size={22} className="text-primary animate-pulse" />
                      </div>
                      <p className="text-sm sm:text-base text-foreground/90 font-semibold mb-4 sm:mb-5">AI is colorizing...</p>
                      <div className="w-full max-w-xs mx-auto h-1.5 sm:h-2 rounded-full bg-secondary overflow-hidden">
                        <motion.div className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.2, ease: "linear" }} />
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-2 sm:mt-3">{Math.round(progress)}%</p>
                    </motion.div>
                  )}
                  {phase === "complete" && (
                    <motion.div key="complete" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.4, ease }} className="relative z-10 py-2">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }} className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                        <Check size={20} className="text-primary" />
                      </motion.div>
                      <p className="text-sm sm:text-base text-foreground/90 font-semibold text-center">Colorization Complete</p>
                      {resultUrl && (originalPreview || comparisonBeforeUrl) && (
                        <div className="mt-4 sm:mt-5">
                          <BeforeAfterSlider
                            beforeSrc={originalPreview || comparisonBeforeUrl || resultUrl}
                            afterSrc={resultUrl}
                            beforeLabel={originalPreview ? "Original" : "SAR Preview"}
                            afterLabel="AI Colorized"
                            beforeImageClassName={originalPreview ? "" : "grayscale contrast-125 brightness-90"}
                            aspect="aspect-square"
                          />
                          <p className="text-[10px] text-muted-foreground/60 text-center mt-2">Drag to compare</p>
                        </div>
                      )}
                      {resultUrl && !originalPreview && !comparisonBeforeUrl && (
                        <div className="mt-4 sm:mt-5 relative">
                          <img src={resultUrl} alt="Colorized" className="w-full aspect-square object-cover rounded-lg sm:rounded-xl border border-primary/40" />
                          <span className="absolute top-1.5 left-1.5 text-[9px] font-semibold bg-primary/80 text-white px-1.5 py-0.5 rounded-full">AI Colorized</span>
                        </div>
                      )}
                      <div className="flex items-center justify-center gap-2 mt-4">
                        <Button variant="outline" size="sm" className="rounded-lg" onClick={() => { setPhase("idle"); setProgress(0); setSelectedFile(null); setResultUrl(null); setOriginalPreview(null); }}>
                          New
                        </Button>
                        {resultUrl && (
                          <Button variant="glow" size="sm" className="rounded-lg" onClick={() => { const a = document.createElement("a"); a.href = resultUrl; a.download = "colorized.png"; a.click(); }}>
                            Download
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Batch Upload UI */
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`glass-card rounded-2xl p-5 sm:p-8 relative overflow-hidden transition-all duration-300 ${isDragging ? "border-primary/50 bg-primary/5 scale-[1.02]" : ""}`}
              >
                <div className="text-center mb-5">
                  <FileUp size={24} className="mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm font-semibold">Batch Upload</p>
                  <p className="text-xs text-muted-foreground">Drag multiple files or click to add</p>
                </div>

                <Button variant="outline" className="w-full mb-4 rounded-xl" onClick={() => batchInputRef.current?.click()}>
                  <Plus size={14} className="mr-2" /> Add Files
                </Button>

                {batchQueue.length > 0 && (
                  <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                    {batchQueue.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 bg-foreground/[0.03] rounded-lg px-3 py-2">
                        <Radar size={12} className="text-muted-foreground shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{item.file.name}</p>
                          {item.phase === "processing" && (
                            <div className="w-full h-1 rounded-full bg-secondary mt-1 overflow-hidden">
                              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${item.progress}%` }} />
                            </div>
                          )}
                        </div>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          item.phase === "complete" ? "text-emerald-400 bg-emerald-400/10" :
                          item.phase === "processing" ? "text-amber-400 bg-amber-400/10" :
                          "text-muted-foreground bg-foreground/[0.04]"
                        }`}>
                          {item.phase === "complete" ? "Done" : item.phase === "processing" ? `${Math.round(item.progress)}%` : "Queued"}
                        </span>
                        <button onClick={() => setBatchQueue((prev) => prev.filter((q) => q.id !== item.id))} className="text-muted-foreground hover:text-destructive transition-colors">
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {batchQueue.some((q) => q.phase === "idle") && (
                  <Button variant="glow" className="w-full rounded-xl" onClick={processBatch}>
                    Process {batchQueue.filter((q) => q.phase === "idle").length} Files
                  </Button>
                )}
              </div>
            )}

            {/* Divider */}
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2, ease }} className="flex items-center gap-3 sm:gap-5 my-8 sm:my-10">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-foreground/8 to-transparent" />
              <span className="text-xs sm:text-sm font-medium uppercase tracking-[0.1em] sm:tracking-[0.15em] text-muted-foreground/50 whitespace-nowrap">Or Generate by Location</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-foreground/8 to-transparent" />
            </motion.div>

            {/* Location buttons */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3, ease }} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <button onClick={handleCurrentLocation} className="group relative h-14 sm:h-16 rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] press glass-card hover:border-primary/30">
                <div className="relative z-10 flex items-center justify-center gap-2.5 sm:gap-3 h-full px-4 sm:px-6">
                  <MapPin size={16} className="text-primary" />
                  <span className="text-sm sm:text-[15px] font-medium tracking-[-0.02em] text-foreground">Use Current Location</span>
                </div>
              </button>
              <button onClick={() => setShowCoordInput(!showCoordInput)} className="group relative h-14 sm:h-16 rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] press glass-card hover:border-foreground/15">
                <div className="relative z-10 flex items-center justify-center gap-2.5 sm:gap-3 h-full px-4 sm:px-6">
                  <Globe size={16} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                  <span className="text-sm sm:text-[15px] font-medium tracking-[-0.02em] text-foreground/80 group-hover:text-foreground transition-colors">Enter Coordinates</span>
                </div>
              </button>
            </motion.div>

            {/* Coordinate input */}
            <AnimatePresence>
              {showCoordInput && (
                <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: "auto", marginTop: 12 }} exit={{ opacity: 0, height: 0, marginTop: 0 }} transition={{ duration: 0.35, ease }} className="overflow-hidden">
                  <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 relative">
                    <button onClick={() => setShowCoordInput(false)} className="absolute top-3 right-3 sm:top-4 sm:right-4 text-muted-foreground hover:text-foreground transition-colors"><X size={16} /></button>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-5">
                      <div>
                        <label className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 sm:mb-2 block">Latitude</label>
                        <input type="number" step="any" placeholder="e.g. 28.6139" value={lat} onChange={(e) => setLat(e.target.value)} className="w-full h-10 sm:h-12 rounded-lg sm:rounded-xl bg-secondary/60 border border-border/40 px-3 sm:px-4 text-sm sm:text-base text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200" />
                      </div>
                      <div>
                        <label className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 sm:mb-2 block">Longitude</label>
                        <input type="number" step="any" placeholder="e.g. 77.2090" value={lng} onChange={(e) => setLng(e.target.value)} className="w-full h-10 sm:h-12 rounded-lg sm:rounded-xl bg-secondary/60 border border-border/40 px-3 sm:px-4 text-sm sm:text-base text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200" />
                      </div>
                    </div>
                    <Button variant="glow" size="lg" className="w-full rounded-lg sm:rounded-xl h-11 sm:h-12" onClick={handleCoordSubmit}>Generate Colorized Scene</Button>
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
