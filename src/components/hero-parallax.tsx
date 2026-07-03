"use client";
import React from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "motion/react";

export const HeroParallax = ({
  products,
}: {
  products: {
    title: string;
    link: string;
    thumbnail: string;
  }[];
}) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 100]),
    springConfig
  );

  return (
    <div
      ref={ref}
      className="h-[240vh] py-20  overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className=""
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-6 sm:space-x-10 md:space-x-20 mb-6 sm:mb-10 md:mb-20">
          {firstRow.map((product, idx) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={`${product.title}-first-${idx}`}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row space-x-6 sm:space-x-10 md:space-x-20 mb-6 sm:mb-10 md:mb-20">
          {secondRow.map((product, idx) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={`${product.title}-second-${idx}`}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-6 sm:space-x-10 md:space-x-20">
          {thirdRow.map((product, idx) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={`${product.title}-third-${idx}`}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  return (
    <div className="max-w-7xl relative mx-auto py-10 md:py-20 lg:py-40 px-4 w-full left-0 top-0">
      <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary dark:text-primary leading-tight">
        The Art of <br /> Luxury Vision
      </h1>
      <p className="max-w-2xl text-sm sm:text-base md:text-xl mt-4 md:mt-8 text-neutral-700 dark:text-neutral-300">
        Explore our curated collection of handcrafted premium sunglasses. Designed
        with precision and a commitment to timeless elegance, every frame elevates
        your gaze and defines your style.
      </p>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
  };
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={product.title}
      className="group/product h-52 w-40 sm:h-72 sm:w-56 md:h-80 md:w-80 lg:h-96 lg:w-[30rem] relative shrink-0"
    >
      <a href={product.link} className="block group-hover/product:shadow-2xl">
        <Image
          src={product.thumbnail}
          fill
          sizes="(max-width: 640px) 160px, (max-width: 768px) 224px, (max-width: 1024px) 320px, 480px"
          className="object-cover object-left-top absolute h-full w-full inset-0"
          alt={product.title}
        />
      </a>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none"></div>
      <h2 className="absolute bottom-2 left-2 md:bottom-4 md:left-4 opacity-0 group-hover/product:opacity-100 text-white text-xs md:text-base">
        {product.title}
      </h2>
    </motion.div>
  );
};
