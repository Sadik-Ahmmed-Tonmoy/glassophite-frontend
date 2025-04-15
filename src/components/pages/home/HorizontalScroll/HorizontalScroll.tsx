/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { animate, scroll, spring } from "motion";
import { ReactLenis } from "lenis/react";

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
      { ...spring() }
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

  return (
    <ReactLenis root>
      <main>
        <article>
          {/* <header className="text-white relative w-full bg-slate-950 grid place-content-center h-[80vh]">
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

            <h1 className="text-6xl font-bold text-center tracking-tight">
              I know You Love to Scroll <br />
              So Scroll
            </h1>
          </header> */}

          <section ref={sectionRef} className="h-[500vh] relative">
            <div className="sticky top-0 overflow-hidden">
              <div ref={containerRef} className="flex w-[500vw] bg-red-500 overflow-hidden">
                <div className="scroll-section h-screen w-screen  flex flex-col justify-center overflow-hidden items-center bg-gradient-to-r from-[#ff7e5f] to-red-500">
                  <h2 className="text-[20vw] font-semibold relative bottom-5 inline-block text-black">
                    PASSION
                  </h2>
                  <Image
                    src="/placeholder.svg?height=500&width=500"
                    className="2xl:w-[550px] w-[380px] absolute bottom-0"
                    width={500}
                    height={500}
                    alt="Team image"
                  />
                </div>
                <div className="scroll-section h-screen w-screen  flex flex-col justify-center overflow-hidden items-center bg-gradient-to-r  from-red-500 to-[#ff7e5f]">
                  <h2 className="text-[20vw] font-semibold relative bottom-5 inline-block text-black">
                    WORK
                  </h2>
                  <Image
                    src="/placeholder.svg?height=500&width=500"
                    className="2xl:w-[550px] w-[380px] absolute bottom-0"
                    width={500}
                    height={500}
                    alt="Team image"
                  />
                </div>
                <div className="scroll-section h-screen w-screen bg-orange-400 flex flex-col justify-center overflow-hidden items-center">
                  <h2 className="text-[20vw] font-semibold relative bottom-5 inline-block text-black">
                    MOTIVATION
                  </h2>
                  <Image
                    src="/placeholder.svg?height=500&width=500"
                    className="2xl:w-[550px] w-[380px] absolute bottom-0"
                    width={500}
                    height={500}
                    alt="Team image"
                  />
                </div>
                <div className="scroll-section h-screen w-screen bg-yellow-400 flex flex-col justify-center overflow-hidden items-center">
                  <h2 className="text-[20vw] font-semibold relative bottom-5 inline-block text-black">
                    INSPIRATION
                  </h2>
                  <Image
                    src="/placeholder.svg?height=500&width=500"
                    className="2xl:w-[550px] w-[380px] absolute bottom-0"
                    width={500}
                    height={500}
                    alt="Team image"
                  />
                </div>
                <div className="scroll-section h-screen w-screen bg-green-400 flex flex-col justify-center overflow-hidden items-center">
                  <h2 className="text-[20vw] font-semibold relative bottom-5 inline-block text-black">
                    BELIEVE
                  </h2>
                  <Image
                    src="/placeholder.svg?height=500&width=500"
                    className="2xl:w-[550px] w-[380px] absolute bottom-0"
                    width={500}
                    height={500}
                    alt="Team image"
                  />
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
