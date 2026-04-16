import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const CURSOR_COLOR = "hsl(var(--foreground) / 0.9)";

const CustomCursor = () => {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 500, damping: 34, mass: 0.28 });
  const springY = useSpring(y, { stiffness: 500, damping: 34, mass: 0.28 });

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

  const lineLength = hovering ? 22 : 16;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[9999]"
      style={{ x: springX, y: springY }}
      animate={{
        opacity: visible ? 1 : 0,
        scale: pressing ? 0.9 : hovering ? 1.06 : 1,
      }}
      transition={{ type: "spring", stiffness: 420, damping: 30, mass: 0.32 }}
    >
      {textMode ? (
        <motion.div
          className="absolute rounded-full"
          style={{
            left: -1,
            top: -11,
            width: 2,
            backgroundColor: CURSOR_COLOR,
          }}
          animate={{ height: 22 }}
          transition={{ type: "spring", stiffness: 420, damping: 30 }}
        />
      ) : (
        <>
          <motion.div
            className="absolute rounded-full"
            style={{
              left: 0,
              top: 0,
              width: 2,
              backgroundColor: CURSOR_COLOR,
            }}
            animate={{ height: lineLength }}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
          />
          <motion.div
            className="absolute rounded-full"
            style={{
              left: 0,
              top: 0,
              height: 2,
              backgroundColor: CURSOR_COLOR,
            }}
            animate={{ width: lineLength }}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
          />
        </>
      )}
    </motion.div>
  );
};

export default CustomCursor;
