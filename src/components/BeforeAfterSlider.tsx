import { useState, useRef, useCallback, useEffect } from "react";

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
  aspect?: string;
  beforeImageClassName?: string;
  zoom?: number;
}

const BeforeAfterSlider = ({
  beforeSrc,
  afterSrc,
  beforeLabel = "Original",
  afterLabel = "AI Colorized",
  className = "",
  aspect = "aspect-square",
  beforeImageClassName = "",
  zoom = 1,
}: BeforeAfterSliderProps) => {
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent | TouchEvent) => {
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
    <div
      ref={containerRef}
      onMouseDown={(e) => { setIsDragging(true); updatePosition(e.clientX); }}
      onTouchStart={(e) => { setIsDragging(true); updatePosition(e.touches[0].clientX); }}
      className={`relative ${aspect} rounded-lg sm:rounded-xl overflow-hidden cursor-col-resize select-none border border-border/40 ${className}`}
    >
      <img src={afterSrc} alt={afterLabel} className="absolute inset-0 w-full h-full object-cover transition-transform duration-300" style={{ transform: `scale(${zoom})`, transformOrigin: "center" }} draggable={false} />
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <img src={beforeSrc} alt={beforeLabel} className={`absolute inset-0 w-full h-full object-cover transition-transform duration-300 ${beforeImageClassName}`} style={{ transform: `scale(${zoom})`, transformOrigin: "center" }} draggable={false} />
      </div>

      <div className="absolute top-0 bottom-0 w-px bg-foreground/40 pointer-events-none" style={{ left: `${position}%` }}>
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full glass-elevated flex items-center justify-center transition-transform ${isDragging ? "scale-110" : ""}`}>
          <div className="w-2 h-2 rounded-full bg-primary/90" />
        </div>
      </div>

      <span className="absolute top-1.5 left-1.5 text-[9px] font-semibold bg-black/60 text-white px-1.5 py-0.5 rounded-full pointer-events-none">{beforeLabel}</span>
      <span className="absolute top-1.5 right-1.5 text-[9px] font-semibold bg-primary/80 text-white px-1.5 py-0.5 rounded-full pointer-events-none">{afterLabel}</span>
    </div>
  );
};

export default BeforeAfterSlider;
