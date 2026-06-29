/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";


import { ContextProvider } from "@/lib/MyContextProvider";
import { ReactLenis } from "lenis/react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";

import OriginStorySection from "./HorizontalScrollComponents/OriginStorySection";
import CraftsmanshipShowcaseSection from "./HorizontalScrollComponents/CraftsmanshipShowcaseSection";
import InnovationLabsSection from "./HorizontalScrollComponents/InnovationLabsSection";

// ─── Config ──────────────────────────────────────────────────────────────
const SECTIONS = 3;
const SNAP_THRESHOLD = 0.35;      // magnetic zone: 35% from edge
const SNAP_DURATION_MS = 680;      // snap animation length
const IDLE_DELAY_MS = 80;          // wait after scroll stops before checking snap

// ─── Types ──────────────────────────────────────────────────────────────
interface SectionData {
  id: string;
  content: React.ReactNode;
}

// ─── Easing ──────────────────────────────────────────────────────────────
const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

// ─── Section Content Config ─────────────────────────────────────────────
const SECTIONS_CONFIG: SectionData[] = [
  {
    id: "hero",
    content: (
      <>


        <OriginStorySection />

      </>
    ),
  },
  {
    id: "skills",
    content: (
   <CraftsmanshipShowcaseSection/>
    ),
  },
  {
    id: "more",
    content: (
     <InnovationLabsSection/>



    ),
  },
];

// ─── Custom Hook: Magnetic Snap ────────────────────────────────────────
function useMagneticSnap(sectionRef: React.RefObject<HTMLElement | null>) {
  const currentX = useRef(0);
  const targetX = useRef(0);
  const rafId = useRef<number | null>(null);
  const isSnapping = useRef(false);
  const lastScrollY = useRef(0);

  const [activeIndex, setActiveIndex] = useState(0);

  const getContainer = useCallback(
    () => sectionRef.current?.querySelector<HTMLElement>("[data-scroll-container]"),
    [sectionRef]
  );

  const snapToSection = useCallback(
    (index: number) => {
      const container = getContainer();
      if (!container) return;

      const vw = window.innerWidth;
      targetX.current = -index * vw;
      isSnapping.current = true;

      const startX = currentX.current;
      const delta = targetX.current - startX;
      const startTime = performance.now();

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / SNAP_DURATION_MS, 1);
        const eased = easeOutExpo(progress);

        currentX.current = startX + delta * eased;
        container.style.transform = `translateX(${currentX.current}px)`;

        if (progress < 1) {
          rafId.current = requestAnimationFrame(animate);
        } else {
          currentX.current = targetX.current;
          isSnapping.current = false;
          setActiveIndex(index);
        }
      };

      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(animate);
    },
    [getContainer]
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const driveFromScroll = () => {
      if (isSnapping.current) return;
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / sectionHeight));
      const vw = window.innerWidth;
      const raw = -progress * (SECTIONS - 1) * vw;
      currentX.current = raw;

      const container = getContainer();
      if (container) container.style.transform = `translateX(${raw}px)`;
    };

    let scrollTimer: ReturnType<typeof setTimeout> | null = null;

    const onScroll = () => {
      driveFromScroll();
      lastScrollY.current = window.scrollY;

      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        if (isSnapping.current) return;

        const rect = section.getBoundingClientRect();
        const sectionHeight = section.offsetHeight - window.innerHeight;
        const scrolled = -rect.top;
        if (scrolled < 0 || scrolled > sectionHeight) return;

        const progress = scrolled / sectionHeight;
        const rawIndex = progress * (SECTIONS - 1);
        const nearestIndex = Math.round(rawIndex);
        const fraction = rawIndex - Math.floor(rawIndex);

        const inMagneticZone =
          fraction < SNAP_THRESHOLD || fraction > 1 - SNAP_THRESHOLD;

        if (inMagneticZone) {
          snapToSection(nearestIndex);
          const snapScrollY =
            section.offsetTop + (nearestIndex / (SECTIONS - 1)) * sectionHeight;
          window.scrollTo({ top: snapScrollY, behavior: "instant" });
        }
      }, IDLE_DELAY_MS);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    driveFromScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollTimer) clearTimeout(scrollTimer);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [sectionRef, getContainer, snapToSection]);

  return { activeIndex };
}



// ─── Main Component ─────────────────────────────────────────────────────
export default function HorizontalScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  useMagneticSnap(sectionRef);

  const context = useContext(ContextProvider);
  if (!context) return null;

  return (
    <ReactLenis root>
      <main>
        <article>
          {/* Desktop/Tablet Horizontal Scroll View */}
          <section
            ref={sectionRef}
            style={{ height: `${SECTIONS * 100}vh` }}
            className="relative hidden w-full bg-neutral-50 dark:bg-neutral-950 md:block transition-colors duration-300"
          >
            {/* Global Animated Particle Background */}
            <div className="absolute inset-0 z-0 opacity-40 dark:opacity-60 pointer-events-none">
            </div>

            <div className="sticky top-0 h-screen overflow-hidden">
              <div
                data-scroll-container
                className="flex h-full"
                style={{
                  width: `${SECTIONS * 100}vw`,
                  willChange: "transform",
                }}
              >
                {SECTIONS_CONFIG.map((section) => (
                  <div
                    key={section.id}
                    className="scroll-section relative h-screen w-screen shrink-0 overflow-hidden"
                  >
                    {section.content}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Mobile Vertical Stack View */}
          <section className="block md:hidden w-full bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
            <div className="flex flex-col">
              {SECTIONS_CONFIG.map((section) => (
                <div key={section.id} className="w-full">
                  {section.content}
                </div>
              ))}
            </div>
          </section>
        </article>
        {/* <SectionDots active={activeIndex} total={SECTIONS} /> */}
      </main>
    </ReactLenis>
  );
}