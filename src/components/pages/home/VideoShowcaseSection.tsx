"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import React, { useRef, useCallback, useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

// Playback speed multiplier for the video (1 = normal speed).
const VIDEO_PLAYBACK_RATE = 3.5

// A scroll progress value is considered "outside" the section's active
// range when it's at the clamped edge (0 or 1).
const isBoundary = (v: number) => v <= 0 || v >= 1;

export default function VideoShowcaseSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Tracks the previous progress value so we can detect boundary -> in-range
  // transitions (i.e. the moment the section "appears" and becomes active).
  const prevProgressRef = useRef(scrollYProgress.get());
  // Set to true the instant the section is freshly entered; consumed (and
  // reset) the next time we actually start playback.
  const shouldRestartRef = useRef(false);

  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.95]);

  const springOpacity = useSpring(opacity, { stiffness: 100, damping: 30 });
  const springScale = useSpring(scale, { stiffness: 100, damping: 30 });

  // Detect active scrolling: any change in scroll progress marks "scrolling",
  // then a short debounce marks it as "stopped" once changes cease.
  // Note: with offset ["start end", "end start"], scrollYProgress is clamped
  // at 0 or 1 (i.e. produces no "change" events) whenever the section has no
  // part in the viewport — so this alone already tells us the section is in
  // view, without needing a separate (and height-dependent) useInView check.
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setIsScrolling(true);

      // Section just appeared (was clamped at an edge, now moving) —
      // flag a restart for the next time playback actually begins.
      if (isBoundary(prevProgressRef.current) && !isBoundary(latest)) {
        shouldRestartRef.current = true;
      }
      prevProgressRef.current = latest;

      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    });

    return () => {
      unsubscribe();
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [scrollYProgress]);

  // Play only while actively scrolling; pause the instant scrolling stops.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoLoaded) return;

    if (isScrolling) {
      if (shouldRestartRef.current) {
        video.currentTime = 0;
        shouldRestartRef.current = false;
      }
      video.playbackRate = VIDEO_PLAYBACK_RATE;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isScrolling, videoLoaded]);

  // Make sure playback stops if the component unmounts mid-scroll.
  useEffect(() => {
    return () => {
      videoRef.current?.pause();
    };
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[300vh] bg-black"
    >
      {/* Sticky video container */}
      <motion.div
        style={{ opacity: springOpacity, scale: springScale }}
        className="sticky top-[92px] h-scree w-full overflow-hidden h-[90vh] "
      >
        {/* Video element */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src="/sunglass_teardown.mp4"
          muted={isMuted}
          playsInline
          loop
          preload="auto"
          onLoadedData={(e) => {
            e.currentTarget.playbackRate = VIDEO_PLAYBACK_RATE;
            setVideoLoaded(true);
          }}
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />

        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
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
              From precision engineering to hand-finished acetates —
              witness the artistry behind every frame.
            </p>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <span className="text-white/40 text-xs tracking-widest uppercase">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-8 rounded-full border border-white/30 flex items-start justify-center p-1.5"
          >
            <motion.div className="w-1 h-2 rounded-full bg-white/60" />
          </motion.div>
        </motion.div>

        {/* Controls — mute only */}
        <div className="absolute bottom-8 right-8 flex items-center gap-3">
          <button
            onClick={toggleMute}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-white" />
            ) : (
              <Volume2 className="w-4 h-4 text-white" />
            )}
          </button>
        </div>

        {/* Video progress bar (scroll progress through the section) */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
          <motion.div
            className="h-full bg-[#007C74]"
            style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
          />
        </div>
      </motion.div>
    </section>
  );
}