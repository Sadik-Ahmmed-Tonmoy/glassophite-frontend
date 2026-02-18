"use client";

import { motion, useInView, useScroll, useSpring, useTransform } from "framer-motion";
import {
    ArrowRight,
    Award,
    Diamond,
    Eye,
    Gem,
    Hexagon,
    Infinity as InfinityIcon,
    Repeat,
    Shield,
    Sparkles,
    Zap
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function BrandStatementSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const isInView = useInView(textRef, { once: true, amount: 0.3 });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      setMousePosition({
        x: (clientX - innerWidth / 2) / 50,
        y: (clientY - innerHeight / 2) / 50,
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Smooth spring animations for mouse follow
  const springX = useSpring(mousePosition.x, { stiffness: 100, damping: 30 });
  const springY = useSpring(mousePosition.y, { stiffness: 100, damping: 30 });

  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  // Text reveal animation variants
  const textReveal = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.8,
        ease: [0.2, 0.65, 0.3, 0.9],
        Repeat : true
      },
    }),
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-gradient-to-b from-black via-gray-900 to-black text-white py-32 sm:py-40 px-6 overflow-hidden"
      aria-label="Glassophite Brand Story and Philosophy"
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <motion.div 
        //   style={{ y: y1 }}
          className="absolute inset-0" 
          style={{
            y: y1,
            backgroundImage: `linear-gradient(to right, rgba(0,124,116,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(60,85,165,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Dynamic Floating Orbs with Mouse Follow */}
      <motion.div 
        style={{ 
          x: useTransform(springX, (v) => v * 0.5),
          y: useTransform(springY, (v) => v * 0.5),
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 left-10 w-96 h-96 bg-[#007C74]/5 rounded-full blur-[120px]"
      />
      
      <motion.div 
        style={{ 
          x: useTransform(springX, (v) => -v * 0.3),
          y: useTransform(springY, (v) => -v * 0.3),
        }}
        animate={{
          scale: [1.2, 1, 1.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-[#3C55A5]/5 rounded-full blur-[150px]"
      />

      {/* Animated Geometric Shapes */}
      <motion.div
        style={{
          x: useTransform(springX, (v) => v * 2),
          y: useTransform(springY, (v) => v * 2),
          rotate: rotate,
        }}
        className="absolute top-40 right-20"
      >
        <Hexagon className="w-16 h-16 text-[#007C74]/20" />
      </motion.div>

      <motion.div
        style={{
          x: useTransform(springX, (v) => -v),
          y: useTransform(springY, (v) => -v),
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-40 left-20"
      >
        <Diamond className="w-20 h-20 text-[#3C55A5]/20" />
      </motion.div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#007C74]/30 rounded-full"
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
            }}
            animate={{
              y: ["0%", "100%"],
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10,
            }}
          />
        ))}
      </div>

      {/* Rotating Rings */}
      <motion.div
        style={{
          rotate: rotate,
          scale: scale,
        }}
        className="absolute top-1/4 left-1/4 w-32 h-32"
      >
        <motion.div
          className="absolute inset-0 border-2 border-[#007C74]/20 rounded-full"
          animate={{
            borderWidth: [2, 4, 2],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute inset-2 border border-[#3C55A5]/20 rounded-full"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.div>

      <motion.div
        style={{
          rotate: useTransform(scrollYProgress, [0, 1], [360, 0]),
          y: y2,
        }}
        className="absolute bottom-1/3 right-1/4 w-48 h-48"
      >
        <motion.div
          className="absolute inset-0 border border-[#3C55A5]/20 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#007C74] rounded-full"
            style={{
              top: `${Math.sin(i * 45 * Math.PI / 180) * 50 + 50}%`,
              left: `${Math.cos(i * 45 * Math.PI / 180) * 50 + 50}%`,
            }}
            animate={{
              scale: [1, 2, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3,
              delay: i * 0.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      {/* Animated Lines */}
      <motion.div
        style={{ y: y3 }}
        className="absolute top-20 right-20 space-y-2"
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="h-px bg-gradient-to-r from-transparent via-[#007C74] to-transparent"
            style={{
              width: 100 + i * 50,
            }}
            animate={{
              opacity: [0.1, 0.5, 0.1],
              width: [100 + i * 50, 150 + i * 50, 100 + i * 50],
            }}
            transition={{
              duration: 3,
              delay: i * 0.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      <motion.div
        style={{ y: y1 }}
        className="absolute bottom-20 left-20 space-y-2"
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="h-px bg-gradient-to-l from-transparent via-[#3C55A5] to-transparent"
            style={{
              width: 100 + i * 50,
            }}
            animate={{
              opacity: [0.1, 0.5, 0.1],
              x: [0, 30, 0],
            }}
            transition={{
              duration: 4,
              delay: i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      {/* Floating Icons with Mouse Follow */}
      <motion.div
        style={{
          x: useTransform(springX, (v) => v * 1.5),
          y: useTransform(springY, (v) => v * 1.5),
        }}
        className="absolute top-1/3 left-10"
      >
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Zap className="w-8 h-8 text-[#007C74]/30" />
        </motion.div>
      </motion.div>

      <motion.div
        style={{
          x: useTransform(springX, (v) => -v),
          y: useTransform(springY, (v) => -v),
        }}
        className="absolute bottom-1/3 right-10"
      >
        <motion.div
          animate={{
            rotate: [360, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <InfinityIcon className="w-10 h-10 text-[#3C55A5]/30" />
        </motion.div>
      </motion.div>

      {/* Animated Lens Flare */}
      <motion.div
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute top-1/2 left-0 w-1/3 h-40 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-y-12 blur-3xl"
      />

      {/* Gradient Orbs with Pulse */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#007C74]/5 to-[#3C55A5]/5 blur-[100px]"
      />

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-4 mb-12"
        >
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 40 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="h-[1px] bg-gradient-to-r from-transparent via-[#007C74] to-transparent"
          />
          
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
            <Sparkles className="w-4 h-4 text-[#007C74]" />
            <span className="text-sm text-neutral-300 tracking-wider">THE GLASSOPHITE PHILOSOPHY</span>
          </div>
          
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 40 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="h-[1px] bg-gradient-to-l from-transparent via-[#007C74] to-transparent"
          />
        </motion.div>

        {/* Main Content - Centered Layout */}
        <motion.div
          ref={textRef}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center"
        >
          {/* Main Heading */}
          <motion.h2 
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight tracking-tight"
          >
            <span className="block overflow-hidden">
              {Array.from("Where Vision Meets").map((char, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={textReveal}
                  className="inline-block text-white"
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </span>
            
           <span className="block overflow-hidden mt-2 bg-gradient-to-r from-[#007C74] via-[#3C55A5] to-[#00A693] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              {Array.from("Timeless Elegance").map((char, i) => (
                <motion.span
                  key={i}
                  custom={i + 10}
                  variants={textReveal}
                  className="inline-block "
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </span>
          </motion.h2>

          {/* Brand Story */}
          <motion.div 
            variants={itemVariants}
            className="relative mt-12 max-w-3xl mx-auto"
          >
            <div className="relative backdrop-blur-sm bg-black/20 p-8 rounded-2xl border border-white/5">
              <p className="text-lg text-neutral-300 leading-relaxed">
                At Glassophite, we believe that sunglasses are more than just eye protection — 
                they&apos;re an extension of your personality. Founded in Bangladesh with a vision to 
                democratize luxury eyewear, we&apos;ve combined Swiss precision with Bengali artistry.
              </p>
            </div>
          </motion.div>

          {/* Core Values Grid */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
          >
            {[
              { icon: Eye, title: "Clarity First", desc: "Crystal clear vision" },
              { icon: Shield, title: "Precision Crafted", desc: "Meticulously engineered" },
              { icon: Gem, title: "Timeless Design", desc: "Classic aesthetics" },
              { icon: Award, title: "Uncompromising", desc: "Finest materials" },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="group p-6 rounded-xl bg-gradient-to-b from-white/5 to-transparent border border-white/10"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-[#007C74]/10 flex items-center justify-center mb-3">
                  <item.icon className="w-5 h-5 text-[#007C74]" />
                </div>
                <h3 className="text-sm font-semibold mb-1">{item.title}</h3>
                <p className="text-xs text-neutral-500">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>



      

          {/* CTA */}
          <motion.div
            variants={itemVariants}
            className="mt-16"
          >
            <Link href="/craftsmanship">
              <button className="group relative px-10 py-4 rounded-full overflow-hidden bg-gradient-to-r from-[#007C74] via-[#3C55A5] to-[#00A693] text-white font-medium flex items-center gap-2 mx-auto">
                Discover Our Craft
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-6 mt-6 text-xs text-neutral-600">
              {['Swiss Precision', 'Bengali Artistry', 'Global Standards'].map((badge, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-[#007C74] rounded-full" />
                  {badge}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
          background-size: 200% auto;
        }
      `}</style>
    </section>
  );
}