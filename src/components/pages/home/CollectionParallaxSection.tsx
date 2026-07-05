/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  animate,
} from "framer-motion";
import React, { useRef, useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, Radar } from "lucide-react";
import { useGetCollectionsQuery } from "@/redux/features/product/productApi";

interface Collection {
  category: string;
  label: string;
  description: string;
  image: string;
  slug: string;
  productCount: number;
}

/* ---------- shared HUD chrome ---------- */

function CornerBrackets({ active }: { active: boolean }) {
  const base =
    "absolute w-8 h-8 sm:w-10 sm:h-10 border-[#00FFC2] transition-all duration-700 ease-out";
  const dim = active ? "opacity-70" : "opacity-0";
  return (
    <>
      <div className={`${base} ${dim} top-6 left-6 border-t-2 border-l-2`} />
      <div className={`${base} ${dim} top-6 right-6 border-t-2 border-r-2`} />
      <div className={`${base} ${dim} bottom-6 left-6 border-b-2 border-l-2`} />
      <div className={`${base} ${dim} bottom-6 right-6 border-b-2 border-r-2`} />
    </>
  );
}

function AnimatedCount({ value, active }: { value: number; active: boolean }) {
  const mv = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!active) return;
    const controls = animate(mv, value, { duration: 1.1, ease: [0.16, 1, 0.3, 1] });
    return controls.stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, active]);

  useMotionValueEvent(mv, "change", (latest) => setDisplay(Math.round(latest)));

  return <>{display}</>;
}

/* ---------- one slide ---------- */

function CollectionSlide({
  collection,
  index,
  total,
  scrollYProgress,
  reduceMotion,
}: {
  collection: Collection;
  index: number;
  total: number;
  scrollYProgress: any;
  reduceMotion: boolean;
}) {
  const sectionStart = index / total;
  const sectionEnd = (index + 1) / total;
  const revealEnd = sectionStart + Math.min(0.16 / total, (sectionEnd - sectionStart) * 0.5);

  // all derived motion values declared unconditionally, in the same order every render
  const scale = useTransform(scrollYProgress, [sectionStart, sectionEnd], [1, 0.94]);
  const opacity = useTransform(
    scrollYProgress,
    [sectionStart, sectionStart + 0.3 / total, sectionEnd - 0.1 / total, sectionEnd],
    [1, 1, 0.55, 0]
  );
  const imageScale = useTransform(scrollYProgress, [sectionStart, sectionEnd], [1.12, 1]);
  const textY = useTransform(scrollYProgress, [sectionStart, sectionEnd], [0, -50]);
  const revealPct = useTransform(scrollYProgress, [sectionStart, revealEnd], [100, 0]);
  const clipPath = useTransform(revealPct, (v) => `inset(0 ${Math.max(v, 0)}% 0 0)`);
  const scanLeft = useTransform(revealPct, (v) => `${100 - v}%`);
  const isActive = useTransform(scrollYProgress, (v: number) => v >= sectionStart && v < sectionEnd);

  const [active, setActive] = useState(index === 0);
  useMotionValueEvent(isActive, "change", (v) => setActive(Boolean(v)));

  const springScale = useSpring(scale, { stiffness: 110, damping: 30 });
  const springOpacity = useSpring(opacity, { stiffness: 110, damping: 30 });
  const springImageScale = useSpring(imageScale, { stiffness: 110, damping: 30 });
  const springTextY = useSpring(textY, { stiffness: 110, damping: 30 });
  const springClip = useSpring(clipPath, { stiffness: 90, damping: 24 });

  const isOdd = index % 2 !== 0;

  return (
    <motion.div
      style={{ scale: springScale, opacity: springOpacity }}
      className="relative h-screen w-full flex items-center overflow-hidden bg-[#050608]"
    >
      {/* background image, scan-revealed */}
      <motion.div style={{ scale: springImageScale, clipPath: springClip }} className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center grayscale-[15%] contrast-[1.05]"
          style={{ backgroundImage: `url(${collection.image})` }}
        />
        <div
          className={`absolute inset-0 bg-gradient-to-r ${
            isOdd ? "from-black/90 via-black/55 to-transparent" : "from-transparent via-black/55 to-black/90"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
      </motion.div>

      {/* traveling scanline while revealing — hook is always called above, only the element is conditional */}
      {!reduceMotion && (
        <motion.div
          className="absolute inset-y-0 w-24 pointer-events-none mix-blend-screen"
          style={{
            left: scanLeft,
            background: "linear-gradient(90deg, transparent, rgba(0,255,194,0.35), transparent)",
          }}
        />
      )}

      {/* HUD grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <CornerBrackets active={active} />

      {/* HUD top-left readout */}
      <div className="absolute top-6 left-20 sm:left-24 flex items-center gap-2 font-mono text-[10px] sm:text-xs tracking-[0.25em] text-[#00FFC2]/70 uppercase">
        <Radar className="w-3.5 h-3.5" />
        Collection_{String(index + 1).padStart(2, "0")}
      </div>
      <div className="absolute top-6 right-20 sm:right-24 font-mono text-[10px] sm:text-xs tracking-[0.25em] text-white/40 uppercase">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>

      {/* content */}
      <motion.div
        style={{ y: springTextY }}
        className={`relative z-10 w-full px-6 sm:px-12 lg:px-24 ${isOdd ? "lg:text-left" : "lg:text-right"}`}
      >
        <div className={`max-w-xl ${isOdd ? "lg:mr-auto" : "lg:ml-auto"}`}>
          <div className="flex items-center gap-3 font-mono text-xs tracking-[0.3em] text-[#00FFC2] uppercase">
            <span className="inline-block w-6 h-px bg-[#00FFC2]" />
            {collection.category}
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mt-3 leading-[0.95] tracking-tight"
          >
            {collection.label}
          </motion.h2>

          <p className="font-mono text-xs sm:text-sm mt-4 tracking-wide text-white/40">
            <AnimatedCount value={collection.productCount} active={active} />{" "}
            {collection.productCount === 1 ? "unit indexed" : "units indexed"}
          </p>

          <p className="text-white/65 text-sm sm:text-base md:text-lg mt-6 leading-relaxed max-w-md">
            {collection.description}
          </p>

          <Link
            href={collection.slug}
            className="group relative inline-flex items-center gap-2 mt-9 px-7 py-3 font-mono text-xs tracking-[0.2em] uppercase text-[#050608] bg-[#00FFC2] hover:bg-white transition-colors duration-300"
          >
            Access Collection
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ---------- vertical progress rail ---------- */

function RailDot({
  index,
  total,
  scrollYProgress,
}: {
  index: number;
  total: number;
  scrollYProgress: any;
}) {
  const sectionStart = index / total;
  const sectionEnd = (index + 1) / total;
  const mid = (sectionStart + sectionEnd) / 2;
  const height = useTransform(scrollYProgress, [sectionStart, mid, sectionEnd], [16, 40, 16]);
  const opacity = useTransform(scrollYProgress, [sectionStart, mid, sectionEnd], [0.3, 1, 0.3]);
  const springHeight = useSpring(height, { stiffness: 120, damping: 20 });

  return <motion.div style={{ height: springHeight, opacity }} className="w-[3px] rounded-full bg-[#00FFC2]" />;
}

/* ---------- main export ---------- */

export default function CollectionParallaxSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = Boolean(useReducedMotion());
  const { data: collectionsData, isLoading } = useGetCollectionsQuery(undefined);
  const [percent, setPercent] = useState(0);

  const collections = useMemo(() => {
    const raw = (collectionsData as any)?.data;
    if (!Array.isArray(raw)) return [] as Collection[];
    return raw.slice(0, 4) as Collection[];
  }, [collectionsData]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const barScale = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useMotionValueEvent(scrollYProgress, "change", (v) => setPercent(Math.round(v * 100)));

  if (isLoading || collections.length === 0) {
    return <div ref={containerRef} className="relative" style={{ height: 0, overflow: "hidden" }} />;
  }

  return (
    <div ref={containerRef} className="relative bg-[#050608]">
      {/* top scroll progress — visible on all breakpoints */}
      <motion.div
        style={{ scaleX: barScale }}
        className="fixed top-0 left-0 right-0 h-[2px] origin-left bg-[#00FFC2] z-40"
      />

      <div className="sticky top-0">
        {collections.map((collection, idx) => (
          <CollectionSlide
            key={collection.category}
            collection={collection}
            index={idx}
            total={collections.length}
            scrollYProgress={scrollYProgress}
            reduceMotion={reduceMotion}
          />
        ))}

        {/* vertical rail — desktop only */}
        <div className="hidden lg:flex fixed right-8 top-1/2 -translate-y-1/2 z-30 flex-col items-center gap-3">
          <div className="flex flex-col gap-3">
            {collections.map((c, idx) => (
              <RailDot key={c.category} index={idx} total={collections.length} scrollYProgress={scrollYProgress} />
            ))}
          </div>
          <span className="font-mono text-[10px] tracking-[0.2em] text-[#00FFC2]/70 mt-2">
            {String(percent).padStart(2, "0")}%
          </span>
        </div>
      </div>

      <div style={{ height: `${collections.length * 100}vh` }} />
    </div>
  );
}