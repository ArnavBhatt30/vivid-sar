import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const trailX = useMotionValue(-100);
  const trailY = useMotionValue(-100);

  const springX = useSpring(trailX, { stiffness: 120, damping: 20 });
  const springY = useSpring(trailY, { stiffness: 120, damping: 20 });

  const scaleMain = useMotionValue(1);
  const springScale = useSpring(scaleMain, { stiffness: 400, damping: 25 });

  const isVisible = useRef(false);
  const opacityVal = useMotionValue(0);

  useEffect(() => {
    // Only show on non-touch devices
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    document.documentElement.classList.add("custom-cursor-active");

    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      trailX.set(e.clientX);
      trailY.set(e.clientY);
      if (!isVisible.current) {
        isVisible.current = true;
        opacityVal.set(1);
      }
    };

    const down = () => scaleMain.set(0.75);
    const up = () => scaleMain.set(1);

    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("a, button, [role='button'], input, textarea, select, label, [data-clickable]")
      ) {
        scaleMain.set(1.8);
      }
    };
    const out = () => scaleMain.set(1);

    const leave = () => opacityVal.set(0);
    const enter = () => opacityVal.set(1);

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
  }, [cursorX, cursorY, trailX, trailY, scaleMain, opacityVal]);

  return (
    <>
      {/* Main cursor — sharp diamond */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          opacity: opacityVal,
          scale: springScale,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <div className="w-3 h-3 rotate-45 bg-white" />
      </motion.div>

      {/* Trail — soft glow that follows */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9998] mix-blend-difference"
        style={{
          x: springX,
          y: springY,
          opacity: opacityVal,
          scale: springScale,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <div className="w-8 h-8 rounded-full border border-white/40" />
      </motion.div>
    </>
  );
};

export default CustomCursor;
