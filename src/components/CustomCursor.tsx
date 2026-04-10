import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const CustomCursor = () => {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const opacity = useMotionValue(0);
  const scale = useMotionValue(1);
  const springScale = useSpring(scale, { stiffness: 500, damping: 28 });

  useEffect(() => {
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    document.documentElement.classList.add("custom-cursor-active");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      opacity.set(1);
    };

    const down = () => scale.set(0.6);
    const up = () => scale.set(1);

    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button'], input, textarea, select, label, [data-clickable]")) {
        scale.set(2.5);
      }
    };
    const out = () => scale.set(1);
    const leave = () => opacity.set(0);
    const enter = () => opacity.set(1);

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    window.addEventListener("mouseover", over, { passive: true });
    window.addEventListener("mouseout", out, { passive: true });
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mouseout", out);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
    };
  }, [x, y, opacity, scale]);

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[9999] w-2 h-2 rounded-full bg-primary mix-blend-difference"
      style={{
        x,
        y,
        opacity,
        scale: springScale,
        translateX: "-50%",
        translateY: "-50%",
      }}
    />
  );
};

export default CustomCursor;
