"use client";

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import { useRef, useEffect, useState, useMemo } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { ReactLenis } from "lenis/react";
import {
  Compass,
  Clock,
  MapPin,
  Users,
  Award,
  Shield,
  Gem,
  Eye,
  Sun,
  Droplets,
  Zap,
  Infinity,
  Star,
  Heart,
  Wind,
  ArrowRight,
  LucideIcon,
} from "lucide-react";

import { useIsStrongGPU } from "@/utils/useIsStrongGPU";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

interface Stat {
  label: string;
  value: string;
  icon: LucideIcon;
}

interface StorySection {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  color: string;
  image: string;
  stats: Stat[];
}

/* -------------------------------------------------------------------------- */
/*                               DATA (STATIC)                                */
/* -------------------------------------------------------------------------- */

const storySections: StorySection[] = [
  {
    id: "origin",
    title: "The Origin",
    subtitle: "Born in Bangladesh",
    description:
      "Glassophite began with a vision to merge Swiss precision with Bengali artistry.",
    icon: Compass,
    color: "#007C74",
    image: "/images/story/origin.jpg",
    stats: [
      { label: "Founded", value: "2024", icon: Clock },
      { label: "Origin", value: "Dhaka", icon: MapPin },
      { label: "Artisans", value: "50+", icon: Users },
    ],
  },
  {
    id: "craftsmanship",
    title: "Swiss Precision",
    subtitle: "Meticulous Engineering",
    description: "Every frame undergoes 48 hours of precision engineering.",
    icon: Award,
    color: "#3C55A5",
    image: "/images/story/craftsmanship.jpg",
    stats: [
      { label: "Process Hours", value: "48", icon: Clock },
      { label: "Quality Checks", value: "25", icon: Shield },
      { label: "Materials", value: "Premium", icon: Gem },
    ],
  },
  {
    id: "innovation",
    title: "Lens Technology",
    subtitle: "Crystal Clarity",
    description:
      "Polarized lenses block 99.9% of UV rays while maintaining clarity.",
    icon: Eye,
    color: "#00A693",
    image: "/images/story/innovation.jpg",
    stats: [
      { label: "UV Protection", value: "100%", icon: Sun },
      { label: "Polarized", value: "Yes", icon: Droplets },
      { label: "Scratch Resistant", value: "10H", icon: Zap },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*                              STORY SLIDE COMPONENT                         */
/* -------------------------------------------------------------------------- */

interface SlideProps {
  section: StorySection;
  index: number;
  scrollYProgress: MotionValue<number>;
  total: number;
  sectionRef: React.RefObject<HTMLElement>;
}

function StorySlide({
  section,
  index,
  scrollYProgress,
  total,
  sectionRef,
}: SlideProps) {
  const start = index / total;
  const end = (index + 1) / total;

  const scale = useTransform(scrollYProgress, [start, end], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [start, end], [0.4, 1]);
  const textX = useTransform(scrollYProgress, [start, end], [-40, 0]);
  const textOpacity = useTransform(scrollYProgress, [start, end], [0, 1]);

  const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 });

  const Icon = section.icon;

  const scrollToSection = (targetIndex: number) => {
    if (!sectionRef.current) return;

    const topOffset = sectionRef.current.offsetTop;
    const target = topOffset + window.innerHeight * targetIndex;

    window.scrollTo({
      top: target,
      behavior: "smooth",
    });
  };

  return (
    <motion.div
      style={{ scale: smoothScale, opacity }}
      className="relative h-screen w-screen flex-shrink-0"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src={section.image}
          alt={section.title}
          fill
          className="object-cover"
          priority={index === 0}
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-8">
        <div className="max-w-5xl grid md:grid-cols-2 gap-12 items-center">
          <motion.div style={{ x: textX, opacity: textOpacity }}>
            <div className="mb-6 flex items-center gap-2 text-white/70">
              <Icon className="w-4 h-4" style={{ color: section.color }} />
              <span className="text-xs uppercase tracking-wider">
                {section.subtitle}
              </span>
            </div>

            <h2 className="text-5xl font-bold text-white mb-6">
              {section.title}
            </h2>

            <p className="text-white/80 mb-8">{section.description}</p>

            <div className="grid grid-cols-3 gap-4">
              {section.stats.map((stat, i) => {
                const StatIcon = stat.icon;
                return (
                  <div
                    key={i}
                    className="p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10"
                  >
                    <StatIcon
                      className="w-5 h-5 mb-2"
                      style={{ color: section.color }}
                    />
                    <div className="text-xl font-bold text-white">
                      {stat.value}
                    </div>
                    <div className="text-xs text-white/60">{stat.label}</div>
                  </div>
                );
              })}
            </div>

            {index === total - 1 && (
              <Link
                href="/collections"
                className="mt-10 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#007C74] to-[#3C55A5] text-white"
              >
                Explore Collection <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </motion.div>
        </div>
      </div>

      {/* Navigation */}
      {index > 0 && (
        <button
          onClick={() => scrollToSection(index - 1)}
          className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md p-3 rounded-full"
        >
          <ArrowRight className="rotate-180 w-5 h-5 text-white" />
        </button>
      )}

      {index < total - 1 && (
        <button
          onClick={() => scrollToSection(index + 1)}
          className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md p-3 rounded-full"
        >
          <ArrowRight className="w-5 h-5 text-white" />
        </button>
      )}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*                         MAIN HORIZONTAL STORY SECTION                      */
/* -------------------------------------------------------------------------- */

export default function HorizontalStorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isStrongGPU = useIsStrongGPU();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["0vw", `-${(storySections.length - 1) * 100}vw`],
  );

  const smoothX = useSpring(x, { stiffness: 100, damping: 30 });

  /* --------------------------- Stable Particles ---------------------------- */

  const particles = useMemo(() => {
    const count = isStrongGPU ? 20 : 8;
    return Array.from({ length: count }).map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
    }));
  }, [isStrongGPU]);

  return (
    <ReactLenis root>
      <section
        ref={sectionRef}
        style={{ height: `${storySections.length * 100}vh` }}
        className="relative overflow-hidden hidden md:block"
      >
        {/* Background Particles (GPU-aware) */}
        {isStrongGPU && (
          <div className="absolute inset-0 z-0 pointer-events-none">
            {particles.map((p, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/20 rounded-full"
                style={{ top: `${p.top}%`, left: `${p.left}%` }}
                animate={{ y: [0, -40, 0], opacity: [0, 0.5, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        )}

        <div className="sticky top-0 h-screen overflow-hidden">
          <motion.div
            ref={containerRef}
            className="flex h-full"
            style={{ x: smoothX }}
          >
            {storySections.map((section, index) => (
              <StorySlide
                key={section.id}
                section={section}
                index={index}
                total={storySections.length}
                scrollYProgress={scrollYProgress}
                sectionRef={sectionRef}
              />
            ))}
          </motion.div>
        </div>
      </section>
    </ReactLenis>
  );
}
