import { useState, useRef, useCallback, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import sarGrayscale from "@/assets/sar-grayscale.jpg";
import sarColorized from "@/assets/sar-colorized.jpg";

const ComparisonSlider = () => {
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      updatePosition(clientX);
    };
    const onUp = () => setIsDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, [isDragging, updatePosition]);

  return (
    <section id="colorizer" className="py-32 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/70 mb-5">
            Interactive Demo
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.04em]">
            See the Difference
          </h2>
        </motion.div>

        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative max-w-5xl mx-auto aspect-[16/10] rounded-3xl overflow-hidden cursor-col-resize select-none glass-card glow-md"
          onMouseDown={(e) => { setIsDragging(true); updatePosition(e.clientX); }}
          onTouchStart={(e) => { setIsDragging(true); updatePosition(e.touches[0].clientX); }}
        >
          <img src={sarColorized} alt="AI colorized SAR output" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
          <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
            <img src={sarGrayscale} alt="Raw SAR grayscale input" className="absolute inset-0 w-full h-full object-cover" style={{ width: `${containerRef.current?.offsetWidth || 100}px`, maxWidth: 'none' }} draggable={false} />
          </div>

          <div className="absolute top-0 bottom-0 w-px bg-foreground/25" style={{ left: `${position}%` }}>
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full glass-elevated flex items-center justify-center transition-transform duration-200 ${isDragging ? 'scale-110' : 'hover:scale-110'}`}>
              <div className="w-5 h-5 rounded-full bg-primary/90 glow-sm" />
            </div>
          </div>

          <div className="absolute bottom-5 left-5 px-4 py-2 rounded-full glass-elevated">
            <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">Raw SAR</span>
          </div>
          <div className="absolute bottom-5 right-5 px-4 py-2 rounded-full glass-elevated">
            <span className="text-xs font-semibold text-primary tracking-wider uppercase">AI Colorized</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ComparisonSlider;
