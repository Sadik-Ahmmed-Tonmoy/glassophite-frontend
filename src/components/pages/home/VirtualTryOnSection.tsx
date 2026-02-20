"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  Camera,
  Scan,
  Sparkles,
  ArrowRight,
  RefreshCw,
  CheckCircle,
  Move,
  Star,
  Heart,
  Share2,
  Download,
  Maximize2,
  Minimize2,
  Settings,
  X,
  AlertCircle,
  Users,
  Clock,
  Zap,
  Upload,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Eye,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import Image from "next/image";
import { useRef, useState, useEffect, useCallback } from "react";
import Webcam from "react-webcam";

// Mock data interface
interface TryOnProduct {
  id: string;
  title: string;
  image: string;
  category: string;
  color: string;
  popularity: number;
  price?: string;
}

// Mock products data
const mockTryOnProducts: TryOnProduct[] = [
  {
    id: "1",
    title: "Aviator Classic",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&auto=format&fit=crop",
    category: "aviator",
    color: "#C0C0C0",
    popularity: 1234,
    price: "$199",
  },
  {
    id: "2",
    title: "Wayfarer Original",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&auto=format&fit=crop",
    category: "wayfarer",
    color: "#000000",
    popularity: 987,
    price: "$159",
  },
  {
    id: "3",
    title: "Sport Shield",
    image: "https://images.unsplash.com/photo-1577803645770-f5f7c6b8d7b9?w=400&auto=format&fit=crop",
    category: "sports",
    color: "#FF0000",
    popularity: 756,
    price: "$249",
  },
  {
    id: "4",
    title: "Diamond Edition",
    image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=400&auto=format&fit=crop",
    category: "luxury",
    color: "#FFD700",
    popularity: 543,
    price: "$599",
  },
  {
    id: "5",
    title: "Retro Aviator",
    image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=400&auto=format&fit=crop",
    category: "aviator",
    color: "#8B4513",
    popularity: 432,
    price: "$179",
  },
  {
    id: "6",
    title: "Urban Wayfarer",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&auto=format&fit=crop",
    category: "wayfarer",
    color: "#0000FF",
    popularity: 321,
    price: "$189",
  },
];

// Demo face images
const demoFaces = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop",
    alt: "Woman with sunglasses",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&auto=format&fit=crop",
    alt: "Man portrait",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop",
    alt: "Man smiling",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1494790108777-466fd103a773?w=400&auto=format&fit=crop",
    alt: "Woman portrait",
  },
];

// Style categories
const styleCategories = [
  { id: "all", name: "All Styles", icon: Eye, translationKey: "all" },
  { id: "aviator", name: "Aviator", icon: Scan, translationKey: "aviator" },
  { id: "wayfarer", name: "Wayfarer", icon: Move, translationKey: "wayfarer" },
  { id: "sports", name: "Sports", icon: Zap, translationKey: "sports" },
  { id: "luxury", name: "Luxury", icon: Star, translationKey: "luxury" },
];

// Theme styles
const getThemeStyles = (isDark: boolean) => ({
  bg: isDark 
    ? "from-black via-gray-900 to-black" 
    : "from-neutral-50 via-white to-neutral-50",
  card: isDark 
    ? "bg-white/5 border-white/10 backdrop-blur-sm" 
    : "bg-white/70 border-neutral-200 backdrop-blur-sm",
  cardHover: isDark 
    ? "hover:bg-white/10" 
    : "hover:bg-white",
  text: isDark 
    ? "text-white" 
    : "text-neutral-900",
  textMuted: isDark 
    ? "text-neutral-300" 
    : "text-neutral-600",
  textMutedLighter: isDark 
    ? "text-neutral-400" 
    : "text-neutral-500",
  accent: "bg-[#007C74]",
  accentGlow: isDark 
    ? "shadow-[0_0_30px_rgba(0,124,116,0.3)]" 
    : "shadow-[0_0_30px_rgba(0,124,116,0.15)]",
  gradient: "from-[#007C74] to-[#3C55A5]",
  overlay: isDark 
    ? "from-black/90 via-black/70 to-transparent" 
    : "from-white/90 via-white/70 to-transparent",
  highlight: "bg-gradient-to-r from-[#007C74] to-[#3C55A5]",
  border: isDark 
    ? "border-white/10" 
    : "border-neutral-200",
  borderGlow: isDark 
    ? "border-[#007C74]/30" 
    : "border-[#007C74]/50",
  buttonActive: "bg-[#007C74] text-white border-[#007C74]",
  buttonInactive: isDark 
    ? "bg-white/5 text-neutral-400 hover:bg-white/10 border-white/10" 
    : "bg-white text-neutral-600 hover:bg-neutral-100 border-neutral-200",
  cameraOverlay: isDark 
    ? "from-black/50 via-transparent to-black/50" 
    : "from-white/50 via-transparent to-white/50",
  scrollbarThumb: isDark 
    ? "rgba(255,255,255,0.1)" 
    : "rgba(0,0,0,0.1)",
  scrollbarThumbHover: isDark 
    ? "rgba(255,255,255,0.2)" 
    : "rgba(0,0,0,0.2)",
});

export default function VirtualTryOnSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { theme, systemTheme } = useTheme();
  const isDark = theme === "dark" || (theme === "system" && systemTheme === "dark");
  
  // State management
  const [cameraActive, setCameraActive] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [captureMode, setCaptureMode] = useState<"live" | "upload" | "demo">("demo");
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [zoom, setZoom] = useState(1);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [showControls, setShowControls] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedFace, setDetectedFace] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState("all");
  const [recentlyTried, setRecentlyTried] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [hasCamera, setHasCamera] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);

  const styles = getThemeStyles(isDark);
  
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);

  // Filter products by category
  const filteredProducts = selectedStyle === "all" 
    ? mockTryOnProducts 
    : mockTryOnProducts.filter(p => p.category === selectedStyle);

  // Check for camera availability
  useEffect(() => {
    const checkCamera = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setHasCamera(videoDevices.length > 0);
      } catch (err) {
        console.error("Error checking cameras:", err);
        setHasCamera(false);
      }
    };
    checkCamera();
  }, []);

  // Initialize camera
  const initCamera = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      // Stop any existing tracks
      if (webcamRef.current && webcamRef.current.stream) {
        webcamRef.current.stream.getTracks().forEach(track => track.stop());
      }
      
      setCameraActive(true);
      setCaptureMode("live");
      setPermissionGranted(true);
      
      // Simulate face detection after 2 seconds
      setTimeout(() => setDetectedFace(true), 2000);
      
    } catch (err) {
      console.error("Camera access denied:", err);
      setPermissionGranted(false);
      setError("Camera access denied. Please enable camera permissions or use demo mode.");
      setCaptureMode("demo");
    }
  }, [facingMode]);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (webcamRef.current && webcamRef.current.stream) {
      webcamRef.current.stream.getTracks().forEach(track => {
        track.stop();
      });
      setCameraActive(false);
      setDetectedFace(false);
      
      if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        setIsRecording(false);
      }
    }
  }, [mediaRecorder, isRecording]);

  // Capture photo
  const capturePhoto = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
        setIsProcessing(true);
        
        // Simulate AI processing
        setTimeout(() => {
          setIsProcessing(false);
          setDetectedFace(true);
        }, 2000);
      }
    }
  }, []);

  // Handle file upload
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string);
        setCaptureMode("upload");
        setIsProcessing(true);
        
        // Simulate AI processing
        setTimeout(() => {
          setIsProcessing(false);
          setDetectedFace(true);
        }, 2000);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  // Reset try-on
  const resetTryOn = useCallback(() => {
    setSelectedProduct(null);
    setCapturedImage(null);
    setDetectedFace(false);
    setError(null);
    if (captureMode === "live") {
      stopCamera();
    }
    setCaptureMode("demo");
  }, [captureMode, stopCamera]);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  }, []);

  // Download captured image
  const downloadImage = useCallback(() => {
    if (capturedImage) {
      const link = document.createElement('a');
      link.download = `virtual-tryon-${Date.now()}.png`;
      link.href = capturedImage;
      link.click();
    }
  }, [capturedImage]);

  // Share functionality
  const shareImage = useCallback(async () => {
    if (capturedImage && navigator.share) {
      try {
        const blob = await (await fetch(capturedImage)).blob();
        const file = new File([blob], 'virtual-tryon.png', { type: 'image/png' });
        await navigator.share({
          title: 'My Virtual Try-On',
          text: 'Check out how these sunglasses look on me!',
          files: [file]
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  }, [capturedImage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cameraActive) {
        stopCamera();
      }
    };
  }, [cameraActive, stopCamera]);

  // Video constraints
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: facingMode,
  };

  return (
    <motion.section
      ref={containerRef}
      className={`relative w-full overflow-hidden bg-gradient-to-b ${styles.bg} transition-colors duration-500 py-12 sm:py-16 lg:py-20 px-4 sm:px-6`}
      aria-label="Glassophite Virtual Try-On Experience"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, ${isDark ? "#007C74" : "#007C74"} 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Floating Orbs */}
      <motion.div
        style={{ y: y1 }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-20 left-20 w-48 sm:w-64 lg:w-72 h-48 sm:h-64 lg:h-72 bg-[#007C74]/10 rounded-full blur-[80px] sm:blur-[100px]"
      />

      <motion.div
        style={{ y: y2 }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-20 right-20 w-64 sm:w-80 lg:w-96 h-64 sm:h-80 lg:h-96 bg-[#3C55A5]/10 rounded-full blur-[100px] sm:blur-[120px]"
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-10 lg:mb-12"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm border border-white/10 mb-4 sm:mb-6 mx-auto w-fit"
          >
            <Camera className="w-3 h-3 sm:w-4 sm:h-4 text-[#007C74]" />
            <span
              className={`text-[10px] sm:text-xs ${styles.textMuted} tracking-wider uppercase`}
              data-translate="virtual.badge"
            >
              Virtual Try-On
            </span>
          </motion.div>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 px-4">
            <span className={styles.text}>Try Before You</span>{" "}
            <span className="bg-gradient-to-r from-[#007C74] via-[#3C55A5] to-[#00A693] bg-clip-text text-transparent">
              Buy
            </span>
          </h2>

          {/* Description */}
          <p
            className={`text-xs sm:text-sm md:text-base lg:text-lg ${styles.textMuted} max-w-2xl mx-auto px-4`}
            data-translate="virtual.description"
          >
            See how our sunglasses look on you with our AI-powered virtual try-on experience
          </p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 sm:p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 max-w-2xl mx-auto"
          >
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" />
            <p className={`text-xs sm:text-sm ${styles.textMuted}`}>{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto p-1 hover:bg-red-500/20 rounded-full transition-colors"
            >
              <X className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
            </button>
          </motion.div>
        )}

        {/* Main Try-On Interface */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12"
        >
          {/* Camera/Preview Section */}
          <div className="lg:col-span-2">
            <div className={`relative rounded-xl sm:rounded-2xl overflow-hidden backdrop-blur-sm border-2 ${styles.borderGlow} aspect-[4/3] lg:aspect-[16/9]`}>
              {/* Camera View */}
              {captureMode === "live" && cameraActive ? (
                <Webcam
                  ref={webcamRef}
                  audio={audioEnabled}
                  muted={isMuted}
                  videoConstraints={videoConstraints}
                  screenshotFormat="image/png"
                  className="w-full h-full object-cover"
                  style={{
                    transform: facingMode === 'user' ? 'scaleX(-1)' : 'none',
                    filter: `brightness(${brightness}%) contrast(${contrast}%)`,
                  }}
                />
              ) : captureMode === "upload" && capturedImage ? (
                <div className="relative w-full h-full">
                  <Image
                    src={capturedImage}
                    alt="Uploaded"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                  />
                </div>
              ) : (
                <div className="relative w-full h-full bg-gradient-to-br from-[#007C74]/20 to-[#3C55A5]/20">
                  {/* Demo face grid */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 p-2 sm:p-3 w-full max-w-md">
                      {demoFaces.map((face) => (
                        <motion.button
                          key={face.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                          onClick={() => {
                            setCaptureMode("demo");
                            setCapturedImage(face.url);
                            setDetectedFace(true);
                          }}
                        >
                          <Image
                            src={face.url}
                            alt={face.alt}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Demo overlay text */}
                  <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 text-center w-full px-4">
                    <p className={`text-[10px] sm:text-xs ${styles.textMuted} bg-black/50 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full inline-block`}>
                      Select a demo face or use your camera
                    </p>
                  </div>
                </div>
              )}

              {/* AI Face Detection Overlay */}
              {detectedFace && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 pointer-events-none"
                >
                  {/* Face outline */}
                  <svg className="w-full h-full">
                    <rect
                      x="20%"
                      y="20%"
                      width="60%"
                      height="60%"
                      fill="none"
                      stroke="#007C74"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      className="animate-pulse"
                    />
                  </svg>
                  
                  {/* Face points */}
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#007C74] rounded-full"
                      style={{
                        left: `${20 + (i % 4) * 20}%`,
                        top: `${20 + Math.floor(i / 4) * 60}%`,
                      }}
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.1,
                        repeat: Infinity,
                      }}
                    />
                  ))}
                </motion.div>
              )}

              {/* Selected Product Overlay */}
              {selectedProduct && detectedFace && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <div className="relative w-3/4 h-auto">
                    {/* Sunglasses overlay - positioned on face */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-56 md:w-64 h-16 sm:h-20 md:h-24">
                      {/* Left lens */}
                      <motion.div 
                        animate={{ rotate: [-6, -4, -6] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-20 sm:w-24 md:w-28 h-12 sm:h-14 md:h-16 bg-black/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border-2 border-[#007C74]/30 transform -rotate-6"
                      >
                        <div className="absolute inset-1 bg-gradient-to-br from-[#007C74]/20 to-transparent rounded-lg sm:rounded-xl" />
                        
                        {/* Lens reflection */}
                        <motion.div
                          animate={{
                            x: ["-100%", "200%"],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        />
                      </motion.div>
                      
                      {/* Right lens */}
                      <motion.div 
                        animate={{ rotate: [6, 4, 6] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-20 sm:w-24 md:w-28 h-12 sm:h-14 md:h-16 bg-black/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border-2 border-[#007C74]/30 transform rotate-6"
                      >
                        <div className="absolute inset-1 bg-gradient-to-bl from-[#007C74]/20 to-transparent rounded-lg sm:rounded-xl" />
                        
                        {/* Lens reflection */}
                        <motion.div
                          animate={{
                            x: ["200%", "-100%"],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="absolute inset-0 bg-gradient-to-l from-transparent via-white/20 to-transparent"
                        />
                      </motion.div>
                      
                      {/* Bridge */}
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 sm:w-8 h-3 sm:h-4 bg-black/60 backdrop-blur-sm rounded-full border border-[#007C74]/30" />
                      
                      {/* Temple pieces */}
                      <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-4 h-1 bg-black/60 backdrop-blur-sm rounded-full transform -rotate-12" />
                      <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-4 h-1 bg-black/60 backdrop-blur-sm rounded-full transform rotate-12" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Camera Controls Overlay */}
              <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 flex items-center justify-between flex-wrap gap-2">
                {/* Mode Selector */}
                <div className="flex gap-1 sm:gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      resetTryOn();
                      if (hasCamera) {
                        setCaptureMode("live");
                        initCamera();
                      } else {
                        setError("No camera found on your device");
                      }
                    }}
                    className={`p-1.5 sm:p-2 rounded-full backdrop-blur-sm border transition-all ${
                      captureMode === "live"
                        ? `${styles.buttonActive} ${styles.borderGlow}`
                        : styles.buttonInactive
                    }`}
                    title="Use Camera"
                    disabled={!hasCamera}
                  >
                    <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      resetTryOn();
                      fileInputRef.current?.click();
                    }}
                    className={`p-1.5 sm:p-2 rounded-full backdrop-blur-sm border transition-all ${
                      captureMode === "upload"
                        ? `${styles.buttonActive} ${styles.borderGlow}`
                        : styles.buttonInactive
                    }`}
                    title="Upload Photo"
                  >
                    <Upload className="w-3 h-3 sm:w-4 sm:h-4" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      resetTryOn();
                      setCaptureMode("demo");
                      setCapturedImage(null);
                    }}
                    className={`p-1.5 sm:p-2 rounded-full backdrop-blur-sm border transition-all ${
                      captureMode === "demo"
                        ? `${styles.buttonActive} ${styles.borderGlow}`
                        : styles.buttonInactive
                    }`}
                    title="Use Demo"
                  >
                    <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                  </motion.button>
                </div>

                {/* Camera Actions */}
                {captureMode === "live" && (
                  <div className="flex gap-1 sm:gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={capturePhoto}
                      className="p-1.5 sm:p-2 rounded-full bg-[#007C74] text-white hover:bg-[#007C74]/80 transition-colors"
                      title="Capture Photo"
                    >
                      <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setFacingMode(facingMode === "user" ? "environment" : "user")}
                      className={`p-1.5 sm:p-2 rounded-full backdrop-blur-sm border ${styles.buttonInactive}`}
                      title="Switch Camera"
                    >
                      <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
                    </motion.button>
                  </div>
                )}

                {/* Right Controls */}
                <div className="flex gap-1 sm:gap-2">
                  {capturedImage && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={downloadImage}
                        className={`p-1.5 sm:p-2 rounded-full backdrop-blur-sm border ${styles.buttonInactive}`}
                        title="Download"
                      >
                        <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={shareImage}
                        className={`p-1.5 sm:p-2 rounded-full backdrop-blur-sm border ${styles.buttonInactive}`}
                        title="Share"
                      >
                        <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </motion.button>
                    </>
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleFullscreen}
                    className={`p-1.5 sm:p-2 rounded-full backdrop-blur-sm border ${styles.buttonInactive}`}
                    title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                  >
                    {isFullscreen ? <Minimize2 className="w-3 h-3 sm:w-4 sm:h-4" /> : <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />}
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowControls(!showControls)}
                    className={`p-1.5 sm:p-2 rounded-full backdrop-blur-sm border ${styles.buttonInactive}`}
                    title="Settings"
                  >
                    <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Advanced Controls */}
              {showControls && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-2 sm:top-3 right-2 sm:right-3 p-3 sm:p-4 rounded-xl backdrop-blur-md bg-black/80 border border-white/10 min-w-[160px] sm:min-w-[200px]"
                >
                  <div className="space-y-3 sm:space-y-4">
                    {/* Zoom Control */}
                    <div>
                      <label className={`text-[10px] sm:text-xs ${styles.textMuted} block mb-1`}>
                        Zoom: {zoom}x
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.1"
                        value={zoom}
                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                        className="w-full accent-[#007C74]"
                      />
                    </div>
                    
                    {/* Brightness Control */}
                    <div>
                      <label className={`text-[10px] sm:text-xs ${styles.textMuted} block mb-1`}>
                        Brightness: {brightness}%
                      </label>
                      <input
                        type="range"
                        min="50"
                        max="150"
                        value={brightness}
                        onChange={(e) => setBrightness(parseInt(e.target.value))}
                        className="w-full accent-[#007C74]"
                      />
                    </div>

                    {/* Contrast Control */}
                    <div>
                      <label className={`text-[10px] sm:text-xs ${styles.textMuted} block mb-1`}>
                        Contrast: {contrast}%
                      </label>
                      <input
                        type="range"
                        min="50"
                        max="150"
                        value={contrast}
                        onChange={(e) => setContrast(parseInt(e.target.value))}
                        className="w-full accent-[#007C74]"
                      />
                    </div>
                    
                    {/* Reset Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={resetTryOn}
                      className="w-full px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-red-500/20 text-red-500 text-[10px] sm:text-xs hover:bg-red-500/30 transition-colors"
                    >
                      Reset Everything
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Processing Indicator */}
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center"
                >
                  <div className="text-center px-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 border-3 border-[#007C74] border-t-transparent rounded-full animate-spin mx-auto mb-2 sm:mb-3" />
                    <p className={`text-xs sm:text-sm ${styles.text}`}>AI Processing...</p>
                    <p className={`text-[10px] sm:text-xs ${styles.textMutedLighter}`}>Detecting face and features</p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Product Selection Panel */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className={`h-full rounded-xl sm:rounded-2xl backdrop-blur-sm border ${styles.card} p-3 sm:p-4`}
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className={`text-xs sm:text-sm font-semibold ${styles.text}`} data-translate="virtual.selectStyle">
                  Select Your Style
                </h3>
                <span className={`text-[10px] sm:text-xs ${styles.textMutedLighter}`}>
                  {filteredProducts.length} styles
                </span>
              </div>

              {/* Style Categories */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                {styleCategories.map((category) => (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedStyle(category.id)}
                    className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium flex items-center gap-1 transition-all ${
                      selectedStyle === category.id
                        ? styles.buttonActive
                        : styles.buttonInactive
                    }`}
                  >
                    <category.icon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    <span data-translate={`virtual.categories.${category.translationKey}`}>
                      {category.name}
                    </span>
                  </motion.button>
                ))}
              </div>

              {/* Product Grid */}
              <div className="space-y-2 sm:space-y-3 max-h-[300px] sm:max-h-[350px] lg:max-h-[400px] overflow-y-auto custom-scrollbar pr-1 sm:pr-2">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    onClick={() => {
                      setSelectedProduct(product.id);
                      if (!detectedFace) {
                        setCaptureMode("demo");
                        setDetectedFace(true);
                        setCapturedImage(demoFaces[0].url);
                      }
                      // Add to recently tried
                      setRecentlyTried(prev => 
                        [product.id, ...prev.filter(id => id !== product.id)].slice(0, 3)
                      );
                    }}
                    className={`p-2 sm:p-3 rounded-lg sm:rounded-xl cursor-pointer transition-all ${
                      selectedProduct === product.id
                        ? `${styles.card} ${styles.borderGlow}`
                        : styles.card
                    }`}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 48px, (max-width: 1200px) 56px, 64px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-[10px] sm:text-xs font-medium ${styles.text} mb-0.5 sm:mb-1 truncate`}>
                          {product.title}
                        </h4>
                        <div className="flex items-center gap-1 sm:gap-2">
                          <div
                            className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border border-white/20"
                            style={{ backgroundColor: product.color }}
                          />
                          {product.price && (
                            <span className={`text-[8px] sm:text-[10px] ${styles.textMutedLighter} font-medium`}>
                              {product.price}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Users className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-[#007C74]" />
                          <span className={`text-[8px] sm:text-[10px] ${styles.textMutedLighter}`}>
                            {product.popularity} tries
                          </span>
                        </div>
                      </div>
                      {selectedProduct === product.id && (
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#007C74] flex-shrink-0" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Recently Tried */}
              {recentlyTried.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/10"
                >
                  <h4 className={`text-[10px] sm:text-xs font-medium ${styles.textMuted} mb-2`} data-translate="virtual.recentlyTried">
                    Recently Tried
                  </h4>
                  <div className="flex gap-1.5 sm:gap-2">
                    {recentlyTried.map((id) => {
                      const product = mockTryOnProducts.find(p => p.id === id);
                      return product ? (
                        <motion.button
                          key={id}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setSelectedProduct(id)}
                          className="relative w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg overflow-hidden group"
                          title={product.title}
                        >
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                            sizes="(max-width: 768px) 32px, 40px"
                          />
                        </motion.button>
                      ) : null;
                    })}
                  </div>
                </motion.div>
              )}

              {/* Permission Warning */}
              {permissionGranted === false && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 sm:mt-4 p-2 sm:p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20"
                >
                  <p className={`text-[8px] sm:text-[10px] ${styles.textMuted}`}>
                    Camera access denied. Please enable camera permissions or use demo mode.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Try-On Instructions & Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10 lg:mb-12"
        >
          {[
            {
              icon: Camera,
              title: "Use Your Camera",
              description: "See how sunglasses look on you in real-time",
              key: "camera",
            },
            {
              icon: Sparkles,
              title: "AI-Powered",
              description: "Advanced face detection for perfect fit",
              key: "ai",
            },
            {
              icon: Heart,
              title: "Save & Share",
              description: "Save your favorites and share with friends",
              key: "share",
            },
            {
              icon: Clock,
              title: "Instant Results",
              description: "Get instant feedback on your style choices",
              key: "instant",
            },
          ].map((item) => (
            <motion.div
              key={item.key}
              whileHover={{ y: -3 }}
              className={`p-3 sm:p-4 rounded-xl backdrop-blur-sm border ${styles.card} text-center`}
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full bg-[#007C74]/10 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <item.icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-5 lg:h-5 text-[#007C74]" />
              </div>
              <h4 className={`text-xs sm:text-sm font-semibold ${styles.text} mb-1`} data-translate={`virtual.benefits.${item.key}.title`}>
                {item.title}
              </h4>
              <p className={`text-[10px] sm:text-xs ${styles.textMutedLighter}`} data-translate={`virtual.benefits.${item.key}.desc`}>
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Try-On Stats & Social Proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-4 sm:pt-6 border-t border-white/10"
        >
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Users className="w-3 h-3 sm:w-4 sm:h-4 text-[#007C74]" />
            <span className={`text-[10px] sm:text-xs ${styles.textMuted}`} data-translate="virtual.stats.users">
              10,000+ virtual try-ons this week
            </span>
          </div>
          
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-[#007C74]" />
            <span className={`text-[10px] sm:text-xs ${styles.textMuted}`} data-translate="virtual.stats.satisfaction">
              98% satisfaction rate
            </span>
          </div>
          
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-[#007C74]" />
            <span className={`text-[10px] sm:text-xs ${styles.textMuted}`} data-translate="virtual.stats.time">
              Average try-on time: 2.5 mins
            </span>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-center mt-6 sm:mt-8"
        >
          <Link href="/virtual-try-on">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#007C74] to-[#3C55A5] text-white text-xs sm:text-sm font-medium inline-flex items-center gap-1.5 sm:gap-2 shadow-lg hover:shadow-xl transition-shadow"
            >
              <span data-translate="virtual.launch">Launch Full Experience</span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${styles.scrollbarThumb};
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${styles.scrollbarThumbHover};
        }
      `}</style>
    </motion.section>
  );
}