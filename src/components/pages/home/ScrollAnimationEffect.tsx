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

// NOTE: this assumes frames are zero-padded to 3 digits (001.webp ... 235.webp).
// If your ffmpeg output used a plain %d pattern, your files are actually
// named 1.webp, 2.webp, ... 235.webp — in that case replace this with:
//   const IMAGE_PATH = (i: number) => `/sunglassGreenEffectImages/${i}.webp`;
const IMAGE_PATH = (i: number) =>
  `/sunglassGreenEffectImages/${String(i).padStart(3, "0")}.webp`;

const ScrollAnimationEffect = () => {
  // sectionRef is the tall scroll-driver — its height IS the scroll distance
  // the user has to travel to go from frame 1 to frame TOTAL_FRAMES.
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(1);

  // Tracks which frame indices (0-based) have finished loading, so the
  // scroll handler can tell "not loaded yet" apart from "loaded but not
  // drawn yet" and jump the priority queue when the user scrolls ahead
  // of what's been fetched so far.
  const loadedRef = useRef<Set<number>>(new Set());
  const loadOneRef = useRef<((index: number) => Promise<void>) | undefined>(
    undefined,
  );

  const [ready, setReady] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Text fades/slides in as the user scrolls into the section, holds
  // through the middle of the sequence, then fades/slides out before the
  // frame sequence finishes — so it never fights with the tail-end frames.
  const textOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.3, 1],
    [0, 1, 1, 0],
  );
  const textY = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [30, 0, 0, -20],
  );
  const textBlur = useTransform(
    scrollYProgress,
    [0, 0.15, 0.3, 1],
    [8, 0, 0, 6],
  );

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

    // Cover-fit: fill the canvas box without distorting the image.
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

    // Cap DPR at 1.5 rather than 2 — retina sharpness matters much less
    // on a fast-cutting frame sequence than the cost of drawing ~2x the
    // pixels on every single scroll-driven redraw, especially now that
    // there are 235 frames' worth of draws happening over the scroll range.
    // const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const isLowEndDevice =
  ((navigator as any).deviceMemory && (navigator as any).deviceMemory <= 4) ||
  (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
    const dpr = Math.min(
      window.devicePixelRatio || 1,
      isLowEndDevice ? 1.5 : 2,
    );

    const width = window.innerWidth;
    const height = window.innerHeight;  

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    drawFrame(currentFrameRef.current);
  }, [drawFrame]);

  // Load frames with bounded concurrency instead of firing all 235
  // requests at once. Frame 1 loads alone first (so first paint is as
  // fast as possible and isn't competing with 234 other requests), then
  // the rest stream in via a small worker pool. loadOneRef exposes a way
  // to jump-load any specific frame on demand (see the scroll handler
  // below) for when the user scrolls ahead of what's been fetched.
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
      await loadOne(0); // first frame loads alone, unblocked by the rest

      const remaining = Array.from(
        { length: TOTAL_FRAMES - 1 },
        (_, i) => i + 1,
      );
      let cursor = 0;

      async function worker() {
        while (cursor < remaining.length && isMounted) {
          const next = remaining[cursor++];
          await loadOne(next);
        }
      }

      await Promise.all(
        Array.from({ length: LOAD_CONCURRENCY }, () => worker()),
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
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [ready, resizeCanvas]);

  const frameValue = useTransform(scrollYProgress, [0, 1], [1, TOTAL_FRAMES]);

  useMotionValueEvent(frameValue, "change", (latest) => {
    const frame = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(latest)));

    // Skip redundant work when the rounded frame hasn't actually changed —
    // otherwise every rAF tick re-clears and redraws the canvas even when
    // nothing visually needs to update.
    if (frame === currentFrameRef.current) return;
    currentFrameRef.current = frame;

    const index = frame - 1;
    if (!loadedRef.current.has(index)) {
      // User scrolled ahead of the loading queue — fetch this exact frame
      // immediately instead of waiting for the sequential queue to reach
      // it. The last successfully drawn frame stays on screen until this
      // resolves, which reads better than a blank frame mid-scrub.
      loadOneRef.current?.(index);
      return;
    }

    drawFrame(frame);
  });

  return (
    // h-[400vh] = 4 viewport-heights of scroll distance for the full
    // frame sequence. Increase for a slower scrub, decrease for faster.
    <div ref={sectionRef} className="relative h-[400vh] bg-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="w-full h-full flex items-center justify-center relative   ">
          {/* add dark overlay */}
          <div className="absolute inset-0 bg-black/30" />
          <img
            src={logo.src}
            alt="logo"
            className="absolute -bottom-2  right-12 w-60 h-auto"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
            <motion.div
              style={{
                opacity: springTextOpacity,
                y: springTextY,
                filter: textFilter,
              }}
            >
              <span className="text-[#007C74] text-sm font-semibold tracking-[0.2em] uppercase mb-4 block">
                Craftsmanship Revealed
              </span>
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-tight mb-4">
                Every Detail
                <br />
                <span className="text-[#007C74]">Matters</span>
              </h2>
              <p className="text-white/60 text-sm sm:text-base max-w-md mx-auto">
                From precision engineering to hand-finished acetates — witness
                the artistry behind every frame.
              </p>
            </motion.div>
          </div>
          <canvas
            ref={canvasRef}
            className="h-full w-full object-cover object-top"
            style={{ display: ready ? "block" : "none" }}
          />
        </div>
      </div>
    </div>
  );
};

export default ScrollAnimationEffect;
