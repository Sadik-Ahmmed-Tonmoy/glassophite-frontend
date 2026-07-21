/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import logo from "@/assets/logos/glassophite-logo.png";

const TOTAL_FRAMES = 235;
const LOAD_CONCURRENCY = 6;

const IMAGE_PATH = (i: number) =>
  `/sunglassGreenEffectImages/${String(i).padStart(3, "0")}.webp`;

const ScrollAnimationEffect = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(1);

  const loadedRef = useRef<Set<number>>(new Set());
  const loadOneRef = useRef<((index: number) => Promise<void>) | undefined>(
    undefined
  );

  const [ready, setReady] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Text visible from start of section, fading out near end
  const textOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.8, 1], [0, 0, -20]);
  const textBlur = useTransform(scrollYProgress, [0, 0.8, 1], [0, 0, 6]);

  const springTextOpacity = useSpring(textOpacity, {
    stiffness: 100,
    damping: 30,
  });
  const springTextY = useSpring(textY, { stiffness: 100, damping: 30 });
  const textFilter = useTransform(textBlur, (b) => `blur(${b}px)`);

  const drawFrame = useCallback((frame: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[frame - 1];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.naturalWidth / img.naturalHeight;

    let drawWidth = canvas.width;
    let drawHeight = canvas.height;
    let offsetX = 0;
    let offsetY = 0;

    if (imgRatio > canvasRatio) {
      drawHeight = canvas.height;
      drawWidth = drawHeight * imgRatio;
      offsetX = (canvas.width - drawWidth) / 2;
    } else {
      drawWidth = canvas.width;
      drawHeight = drawWidth / imgRatio;
      offsetY = (canvas.height - drawHeight) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isLowEndDevice =
      ((navigator as any).deviceMemory && (navigator as any).deviceMemory <= 4) ||
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
    const dpr = Math.min(
      window.devicePixelRatio || 1,
      isLowEndDevice ? 1.25 : 1.5
    );

    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    drawFrame(currentFrameRef.current);
  }, [drawFrame]);

  useEffect(() => {
    let isMounted = true;
    const imgs: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    imagesRef.current = imgs;
    loadedRef.current = new Set();

    const loadOne = (index: number): Promise<void> => {
      if (loadedRef.current.has(index) || imgs[index]) {
        return Promise.resolve();
      }
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = "async";
        const settle = () => {
          loadedRef.current.add(index);
          if (!isMounted) {
            resolve();
            return;
          }
          if (index === 0) setReady(true);
          if (currentFrameRef.current === index + 1) drawFrame(index + 1);
          resolve();
        };
        img.onload = settle;
        img.onerror = settle;
        img.src = IMAGE_PATH(index + 1);
        imgs[index] = img;
      });
    };
    loadOneRef.current = loadOne;

    async function run() {
      // Preload first 15 frames immediately in parallel for zero lag start
      const firstBatch = Array.from({ length: 15 }, (_, i) => loadOne(i));
      await Promise.all(firstBatch);

      if (!isMounted) return;

      // Stream remaining frames in concurrency pool
      const remaining = Array.from(
        { length: TOTAL_FRAMES - 15 },
        (_, i) => i + 15
      );
      let cursor = 0;

      async function worker() {
        while (cursor < remaining.length && isMounted) {
          const next = remaining[cursor++];
          await loadOne(next);
        }
      }

      await Promise.all(
        Array.from({ length: LOAD_CONCURRENCY }, () => worker())
      );
    }

    run();

    return () => {
      isMounted = false;
      imgs.forEach((img) => {
        if (img) {
          img.onload = null;
          img.onerror = null;
        }
      });
    };
  }, [drawFrame]);

  useEffect(() => {
    if (!ready) return;
    resizeCanvas();
    drawFrame(currentFrameRef.current);
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [ready, resizeCanvas, drawFrame]);

  const frameValue = useTransform(scrollYProgress, [0, 1], [1, TOTAL_FRAMES]);

  useMotionValueEvent(frameValue, "change", (latest) => {
    const frame = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(latest)));

    if (frame === currentFrameRef.current) return;
    currentFrameRef.current = frame;

    const index = frame - 1;
    if (!loadedRef.current.has(index)) {
      loadOneRef.current?.(index);
    }

    drawFrame(frame);
  });

  return (
    <div ref={sectionRef} className="relative h-[250vh] sm:h-[350vh] lg:h-[400vh] bg-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="w-full h-full relative">
          {/* Canvas Layer */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full z-0 block"
            style={{ display: ready ? "block" : "none" }}
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />

          {/* Logo Watermark */}
          <img
            src={logo.src}
            alt="Glassophite Logo"
            className="absolute bottom-4 right-4 sm:bottom-6 sm:right-8 lg:bottom-8 lg:right-12 w-28 sm:w-44 lg:w-60 h-auto pointer-events-none opacity-80 z-20"
          />

          {/* Text Content Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 z-20 pointer-events-none select-none">
            <motion.div
              style={{
                opacity: springTextOpacity,
                y: springTextY,
                filter: textFilter,
              }}
              className="max-w-xl mx-auto space-y-2 sm:space-y-3"
            >
              <span className="text-[#007C74] text-xs sm:text-sm font-bold tracking-[0.2em] uppercase block">
                Craftsmanship Revealed
              </span>
              <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight">
                Every Detail
                <br />
                <span className="text-[#007C74]">Matters</span>
              </h2>
              <p className="text-white/70 text-xs sm:text-sm md:text-base max-w-sm sm:max-w-md mx-auto leading-relaxed">
                From precision engineering to hand-finished acetates — witness
                the artistry behind every frame.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollAnimationEffect;
