import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const CustomCursor = () => {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 500, damping: 32, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 500, damping: 32, mass: 0.3 });

  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressing, setPressing] = useState(false);
  const [textMode, setTextMode] = useState(false);

  useEffect(() => {
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const updateMode = (target: EventTarget | null) => {
      const element = target as HTMLElement | null;

      if (element?.closest("input, textarea, [contenteditable='true']")) {
        setTextMode(true);
        setHovering(false);
        return;
      }

      if (element?.closest("a, button, [role='button'], label, summary, select, [data-clickable]")) {
        setHovering(true);
        setTextMode(false);
        return;
      }

      setHovering(false);
      setTextMode(false);
    };

    document.documentElement.classList.add("custom-cursor-active");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      updateMode(e.target);
    };

    const down = () => setPressing(true);
    const up = () => setPressing(false);
    const over = (e: MouseEvent) => updateMode(e.target);
    const leave = () => setVisible(false);
    const enter = () => setVisible(true);

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    window.addEventListener("mouseover", over, { passive: true });
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("mouseover", over);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
    };
  }, [x, y]);

  const width = textMode ? 3 : hovering ? 18 : 12;
  const height = textMode ? 20 : hovering ? 18 : 12;
  const rotation = textMode ? 0 : hovering ? 0 : 45;
  const radius = textMode ? 999 : 4;

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[9999] border border-foreground/20 bg-foreground/80 shadow-[0_10px_30px_hsl(var(--foreground)/0.16)]"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      animate={{
        width,
        height,
        opacity: visible ? 1 : 0,
        scale: pressing ? 0.82 : hovering ? 1.12 : 1,
        rotate: rotation,
        borderRadius: radius,
        backgroundColor: textMode
          ? "hsl(var(--foreground) / 0.9)"
          : hovering
            ? "hsl(var(--foreground) / 0.16)"
            : "hsl(var(--foreground) / 0.8)",
        borderColor: textMode
          ? "hsl(var(--foreground) / 0)"
          : hovering
            ? "hsl(var(--foreground) / 0.28)"
            : "hsl(var(--foreground) / 0.2)",
      }}
      transition={{ type: "spring", stiffness: 420, damping: 30, mass: 0.35 }}
    />
  );
};

export default CustomCursor;
