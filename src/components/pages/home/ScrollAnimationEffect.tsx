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

const TOTAL_FRAMES = 192;

// NOTE: this assumes frames are zero-padded to 3 digits (001.webp ... 192.webp).
// If your ffmpeg output used a plain %d pattern, your files are actually
// named 1.webp, 2.webp, ... 192.webp — in that case replace this with:
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
    [0, 1, 1, 0]
  );
  const textY = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [30, 0, 0, -20]);
  const textBlur = useTransform(
    scrollYProgress,
    [0, 0.15, 0.3, 1],
    [8, 0, 0, 6]
  );

  const springTextOpacity = useSpring(textOpacity, { stiffness: 100, damping: 30 });
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

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    drawFrame(currentFrameRef.current);
  }, [drawFrame]);

  // Load all frames. Frame 1 loads first so there's something to paint
  // immediately; each frame redraws the canvas on arrival only if it's
  // still the frame currently being requested by scroll position.
  useEffect(() => {
    let isMounted = true;
    const imgs: HTMLImageElement[] = new Array(TOTAL_FRAMES);

    const handleSettled = (index: number) => {
      if (!isMounted) return;
      if (index === 0) setReady(true);
      if (currentFrameRef.current === index + 1) drawFrame(index + 1);
    };

    const loadImage = (index: number) => {
      const img = new Image();
      img.onload = () => handleSettled(index);
      img.onerror = () => handleSettled(index);
      img.src = IMAGE_PATH(index + 1);
      imgs[index] = img;
    };

    for (let i = 0; i < TOTAL_FRAMES; i++) loadImage(i);
    imagesRef.current = imgs;

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
    currentFrameRef.current = frame;
    drawFrame(frame);
  });

  return (
    // h-[400vh] = 4 viewport-heights of scroll distance for the full
    // 192-frame sequence. Increase for a slower scrub, decrease for faster.
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