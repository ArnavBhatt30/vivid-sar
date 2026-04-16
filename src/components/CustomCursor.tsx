import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const CustomCursor = () => {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useMotionValue(-100);
  const ringY = useMotionValue(-100);

  const dotX = useSpring(x, { stiffness: 1500, damping: 60, mass: 0.2 });
  const dotY = useSpring(y, { stiffness: 1500, damping: 60, mass: 0.2 });
  const followX = useSpring(ringX, { stiffness: 200, damping: 22, mass: 0.6 });
  const followY = useSpring(ringY, { stiffness: 200, damping: 22, mass: 0.6 });

  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressing, setPressing] = useState(false);
  const [textMode, setTextMode] = useState(false);

  useEffect(() => {
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    document.documentElement.classList.add("custom-cursor-active");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      ringX.set(e.clientX);
      ringY.set(e.clientY);
      if (!visible) setVisible(true);
    };
    const down = () => setPressing(true);
    const up = () => setPressing(false);
    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button'], label, [data-clickable], summary, select")) {
        setHovering(true);
        setTextMode(false);
      } else if (target.closest("input, textarea, [contenteditable='true']")) {
        setTextMode(true);
        setHovering(false);
      } else {
        setHovering(false);
        setTextMode(false);
      }
    };
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
  }, [x, y, ringX, ringY, visible]);

  const ringSize = textMode ? 4 : hovering ? 44 : 32;
  const ringHeight = textMode ? 22 : ringSize;
  const ringOpacity = visible ? (hovering ? 1 : 0.5) : 0;
  const dotOpacity = visible && !hovering && !textMode ? 1 : 0;
  const ringScale = pressing ? 0.85 : 1;

  return (
    <>
      {/* Outer ring / follower */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full border border-primary/70 backdrop-blur-[2px]"
        style={{
          x: followX,
          y: followY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: ringSize,
          height: ringHeight,
          opacity: ringOpacity,
          scale: ringScale,
          borderRadius: textMode ? 2 : 999,
          backgroundColor: hovering ? "hsl(var(--primary) / 0.12)" : "hsl(var(--primary) / 0)",
        }}
        transition={{ type: "spring", stiffness: 350, damping: 28, mass: 0.5 }}
      />
      {/* Inner dot */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] w-[5px] h-[5px] rounded-full bg-primary"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{ opacity: dotOpacity, scale: pressing ? 0.6 : 1 }}
        transition={{ duration: 0.15 }}
      />
    </>
  );
};

export default CustomCursor;
