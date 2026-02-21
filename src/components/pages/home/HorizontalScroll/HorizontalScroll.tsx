/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ReactLenis } from "lenis/react";
import { animate, scroll, spring } from "motion";
import { useContext, useEffect, useRef, useState } from "react";

import { ContextProvider } from "@/lib/MyContextProvider";
import OriginStorySection from "./HorizontalScrollComponents/OriginStorySection";
import CraftsmanshipShowcaseSection from "./HorizontalScrollComponents/CraftsmanshipShowcaseSection";
import InnovationLabsSection from "./HorizontalScrollComponents/InnovationLabsSection";

export default function HorizontalScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!containerRef.current || !sectionRef.current) return;

    const sections = document.querySelectorAll(".scroll-section");
    const totalSections = sections.length;

    // Set up the horizontal scroll animation
    const controls = animate(
      containerRef.current,
      {
        transform: ["none", `translateX(-${totalSections - 1}00vw)`],
      } as any,
      { ...spring() },
    );

    // Connect the animation to the scroll position
    scroll(controls, {
      target: sectionRef.current!,
      offset: ["start", "end"],
    });

    // Animate each section's heading
    // sections.forEach((section, i) => {
    //   const header = section.querySelector("h2");
    //   if (header) {
    //     scroll(animate(header, { x: [800, -800] }), {
    //       target: sectionRef.current!,
    //       offset: [i / totalSections, (i + 1) / totalSections],
    //     });
    //   }
    // });

    // // Add scroll progress indicator
    // const progressBar = document.querySelector(".progress");
    // if (progressBar) {
    //   scroll(animate(progressBar, { scaleX: [0, 1] }), {
    //     target: sectionRef.current,
    //     offset: ["start", "end"],
    //   });
    // }
  }, []);

  const [show, setShow] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShow(entry.isIntersecting),
      { threshold: 0.1 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  const context = useContext(ContextProvider);

  if (!context) return null;
  return (
    <ReactLenis root>
      <main>
        <article>
          <section
            ref={sectionRef}
            className="h-[300vh] relative bg-gradient-to-b from-[#0a0617] via-[#120b26] to-[#0b0614] hidden md:block w-full"
          >
            <div className="sticky top-0 overflow-hidden">
              <div
                ref={containerRef}
                className="flex w-[500vw]  overflow-hidden"
              >
                <div className="scroll-section h-screen w-screen  flex flex-col justify-center overflow-hidden items-center ">
                  <div
                    id="couple"
                    className="relative w-full h-full overflow-hidden "
                  >
                    <div className="absolute inset-0 z-10 flex items-center justify-center ">
                    <OriginStorySection />
                    </div>
                  </div>

                  {/* <div className="relative w-full h-screen overflow-hidden ">
                   
                    <Lightning hue={250} intensity={1.2} size={1.3} />

                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
                      <CoupleProfilesSection />
                    </div>
                  </div> */}
                </div>
                <div className="scroll-section h-screen w-screen  flex flex-col justify-center overflow-hidden relative">
                  <div className="h-full w-full absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[54px_54px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

                  <CraftsmanshipShowcaseSection />
                  <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[54px_54px] mask-[radial-gradient(ellipse_60%_50%_at_50%_95%,#000_70%,transparent_100%)]"></div>
                </div>
                <div className="scroll-section h-screen w-screen  bg-orange-400 flex flex-col justify-center overflow-hidden ">
                  <InnovationLabsSection/>
                </div>
              </div>
            </div>
          </section>
        </article>
        {/* <div className="progress fixed left-0 right-0 h-2 rounded-full bg-red-600 bottom-[50px] origin-left"></div> */}
      </main>
    </ReactLenis>
  );
}
