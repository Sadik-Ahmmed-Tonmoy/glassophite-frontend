/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Webcam from "react-webcam";
import "@mediapipe/face_mesh";
import "@mediapipe/camera_utils";
import {
  Camera as CameraIcon,
  CheckCircle,
  Star,
  Users,
  Sparkles,
  ArrowRight,
  X,
  AlertCircle,
  Upload,
  RotateCw,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

declare global {
  interface Window {
    FaceMesh: new (config?: { locateFile?: (path: string, prefix?: string) => string }) => {
      close(): Promise<void>;
      onResults(listener: (results: FaceMeshResults) => void | Promise<void>): void;
      send(inputs: { image: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement }): Promise<void>;
      setOptions(options: {
        maxNumFaces?: number;
        refineLandmarks?: boolean;
        minDetectionConfidence?: number;
        minTrackingConfidence?: number;
      }): void;
    };
    Camera: new (
      video: HTMLVideoElement,
      options: { onFrame: () => Promise<void> | null; width?: number; height?: number }
    ) => { start(): Promise<void>; stop(): Promise<void> };
  }
}

/** Shape of results from MediaPipe FaceMesh (script attaches to window, no ES export). */
interface FaceMeshResults {
  multiFaceLandmarks?: Array<Array<{ x: number; y: number; z?: number }>>;
}

// Types
interface GlassesAngles {
  front: string;
  left_15: string;
  left_30: string;
  left_45: string;
  right_15: string;
  right_30: string;
  right_45: string;
}

interface Product {
  id: string;
  name: string;
  price: string;
  category: string;
  image: string;
  glassesImages: GlassesAngles;
  popularity: number;
}

interface FaceLandmarks {
  leftEye: { x: number; y: number };
  rightEye: { x: number; y: number };
  nose: { x: number; y: number };
  leftEar: { x: number; y: number };
  rightEar: { x: number; y: number };
}

/**
 * Given a yaw angle in degrees (negative = turned left, positive = turned right),
 * pick the matching glasses PNG from the 7-angle set.
 *
 * Thresholds (symmetric, choosing closest angle):
 *   |yaw| < 10°   → front
 *   10° – 22°     → _15
 *   22° – 37°     → _30
 *   > 37°         → _45
 */
function selectGlassesPng(angles: GlassesAngles, yawDeg: number): string {
  const abs = Math.abs(yawDeg);
  const side = yawDeg <= 0 ? "left" : "right";
  if (abs < 10) return angles.front;
  if (abs < 22) return angles[`${side}_15` as keyof GlassesAngles];
  if (abs < 37) return angles[`${side}_30` as keyof GlassesAngles];
  return angles[`${side}_45` as keyof GlassesAngles];
}

/**
 * Build a GlassesAngles map from a folder + list of available filenames.
 * Any angle whose file is NOT in `available` falls back to the closest
 * available angle, ultimately falling back to `front`.
 *
 * Usage:
 *   makeAngles("/glasses/aviator", ["glasses_front.png", "glasses_left_15.png"])
 *   // right_* and larger left angles will all fall back to front / left_15
 */
function makeAngles(folder: string, available: string[]): GlassesAngles {
  const path = (name: string) => `${folder}/${name}`;

  // Walk the candidate list and return the first one that exists in `available`
  const resolve = (...candidates: string[]): string => {
    for (const name of candidates) {
      if (available.includes(name)) return path(name);
    }
    return path("glasses_front.png"); // ultimate fallback
  };

  return {
    front: resolve("glasses_front.png"),
    left_15: resolve("glasses_left_15.png", "glasses_front.png"),
    left_30: resolve(
      "glasses_left_30.png",
      "glasses_left_15.png",
      "glasses_front.png",
    ),
    left_45: resolve(
      "glasses_left_45.png",
      "glasses_left_30.png",
      "glasses_left_15.png",
      "glasses_front.png",
    ),
    right_15: resolve("glasses_right_15.png", "glasses_front.png"),
    right_30: resolve(
      "glasses_right_30.png",
      "glasses_right_15.png",
      "glasses_front.png",
    ),
    right_45: resolve(
      "glasses_right_45.png",
      "glasses_right_30.png",
      "glasses_right_15.png",
      "glasses_front.png",
    ),
  };
}

// List only the PNG filenames that actually exist in each product's folder.
// makeAngles() will automatically fall back to the closest available angle
// for any angle not listed here.
const products: Product[] = [
  {
    id: "1",
    name: "Aviator Classic",
    price: "$199",
    category: "aviator",
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&auto=format&fit=crop",
    glassesImages: makeAngles("/glasses/aviator", [
      "glasses_front.png",
      "glasses_left_15.png",
      "glasses_left_30.png",
      "glasses_left_45.png",
      "glasses_right_15.png",
      "glasses_right_30.png",
      "glasses_right_45.png",
    ]),
    popularity: 1234,
  },
  {
    id: "2",
    name: "Wayfarer Original",
    price: "$159",
    category: "wayfarer",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&auto=format&fit=crop",
    glassesImages: makeAngles("/glasses/aviator", [
      "glasses_front.png",
      // only front available — all angles fall back to front
    ]),
    popularity: 987,
  },
  {
    id: "3",
    name: "Sport Shield",
    price: "$249",
    category: "sports",
    image:
      "https://images.unsplash.com/photo-1577803645770-f5f7c6b8d7b9?w=400&auto=format&fit=crop",
    glassesImages: makeAngles("/glasses/aviator", [
      "glasses_front.png",
      "glasses_left_15.png",
      "glasses_right_15.png",
      // _30 and _45 not available → fall back to _15
    ]),
    popularity: 756,
  },
  {
    id: "4",
    name: "Diamond Edition",
    price: "$599",
    category: "luxury",
    image:
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=400&auto=format&fit=crop",
    glassesImages: makeAngles("/glasses/aviator", [
      "glasses_front.png",
      "glasses_left_15.png",
      "glasses_left_30.png",
      "glasses_left_45.png",
      "glasses_right_15.png",
      "glasses_right_30.png",
      "glasses_right_45.png",
    ]),
    popularity: 543,
  },
];

const demoModels = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop",
    name: "Sarah",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop",
    name: "Michael",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1494790108777-466fd103a773?w=400&auto=format&fit=crop",
    name: "Emma",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&auto=format&fit=crop",
    name: "James",
  },
];

export default function VirtualTryOn() {
  const webcamRef = useRef<Webcam>(null);
  // FIX 2: Separate canvas only used for live mode
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const faceMeshRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [captureMode, setCaptureMode] = useState<"live" | "demo" | "upload">(
    "demo",
  );
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDemo, setSelectedDemo] = useState<string>(demoModels[0].url);
  const [recentlyTried, setRecentlyTried] = useState<string[]>([]);
  const [isCameraReady, setIsCameraReady] = useState(false);
  // null = not yet checked, true = camera found, false = no camera
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  // FIX 3: processedImage holds the composited canvas result (data URL) for demo/upload modes
  const [processedImage, setProcessedImage] = useState<string | null>(null);

  // ─── Camera availability detection ───────────────────────────────────────────
  useEffect(() => {
    const checkCamera = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((d) => d.kind === "videoinput");
        setHasCamera(videoDevices.length > 0);
      } catch {
        // enumerateDevices failed (e.g. non-secure context) — assume no camera
        setHasCamera(false);
      }
    };
    checkCamera();
  }, []);

  // ─── Face angle helpers ────────────────────────────────────────────────────

  /**
   * Yaw in degrees from MediaPipe landmarks.
   * Negative = face turned LEFT, positive = face turned RIGHT.
   *
   * Method: compare how far the nose tip is from the midpoint between the two
   * ears, normalised by the full ear-to-ear distance.
   * At 0° (straight on) the nose sits exactly at the midpoint → offset = 0.
   * Turning right pushes the nose toward the right ear → offset > 0.
   */
  const computeYawDeg = useCallback((lm: FaceLandmarks): number => {
    const midEarX = (lm.leftEar.x + lm.rightEar.x) / 2;
    const faceWidth = Math.abs(lm.rightEar.x - lm.leftEar.x);
    if (faceWidth === 0) return 0;
    // offset is in [-0.5, +0.5]; multiply by 90 to get approximate degrees
    const offset = (lm.nose.x - midEarX) / faceWidth;
    return offset * 90;
  }, []);

  /**
   * Roll in radians — the tilt of the head (Z-axis rotation).
   * Computed from the angle of the left→right eye vector.
   * Tilt right → positive; tilt left → negative.
   */
  const computeRollRad = useCallback((lm: FaceLandmarks): number => {
    return Math.atan2(
      lm.rightEye.y - lm.leftEye.y,
      lm.rightEye.x - lm.leftEye.x,
    );
  }, []);

  // ─── Core overlay: draw the right-angle PNG precisely on the face ──────────

  /**
   * Composites a glasses PNG onto a source image using canvas.
   *
   * When `landmarks` are provided (live camera or future face-detection on
   * static images), the glasses are sized and positioned exactly:
   *   - width  = eye-distance × 2.5
   *   - center = midpoint between the two eyes
   *   - the correct angle PNG is chosen via selectGlassesPng()
   *
   * Without landmarks (demo mode, no face detection available), a sensible
   * heuristic is used: glasses centred horizontally at 22 % from the top.
   */
  const overlayGlassesOnImage = useCallback(
    async (
      imageSrc: string,
      glassesAngles: GlassesAngles,
      landmarks?: FaceLandmarks,
    ): Promise<string> => {
      // Compute yaw first so we can pick the PNG before loading anything
      const yawDeg = landmarks ? computeYawDeg(landmarks) : 0;
      const glassesSrc = selectGlassesPng(glassesAngles, yawDeg);

      return new Promise((resolve, reject) => {
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.src = imageSrc;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject(new Error("No canvas context"));
          ctx.drawImage(img, 0, 0);

          const glassesImg = new window.Image();
          glassesImg.crossOrigin = "anonymous";
          glassesImg.src = glassesSrc;

          glassesImg.onload = () => {
            let gW: number,
              gH: number,
              cx: number,
              cy: number,
              rollRad = 0;

            if (landmarks) {
              // ── Landmark-based positioning (accurate) ──────────────────────
              // eyeDist already accounts for tilt since we measure actual pixel distance
              const eyeDist = Math.hypot(
                landmarks.rightEye.x - landmarks.leftEye.x,
                landmarks.rightEye.y - landmarks.leftEye.y,
              );
              gW = eyeDist * 2.5;
              gH = glassesImg.height * (gW / glassesImg.width);

              // Center point between the two eyes — glasses rotate around this
              cx = (landmarks.leftEye.x + landmarks.rightEye.x) / 2;
              cy = (landmarks.leftEye.y + landmarks.rightEye.y) / 2;

              // Head roll: angle of the left→right eye vector
              rollRad = computeRollRad(landmarks);
            } else {
              // ── Heuristic positioning (demo/upload, no face detection) ─────
              gW = img.width * 0.5;
              gH = glassesImg.height * (gW / glassesImg.width);
              cx = img.width / 2;
              cy = img.height * 0.22 + gH * 0.4;
            }

            // Draw glasses rotated around the eye-midpoint (cx, cy)
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(rollRad);
            // Draw centred on origin; shift up slightly so lens sits on the eye
            ctx.drawImage(glassesImg, -gW / 2, -gH * 0.4, gW, gH);
            ctx.restore();

            resolve(canvas.toDataURL("image/png"));
          };

          glassesImg.onerror = () =>
            reject(new Error(`Failed to load glasses PNG: ${glassesSrc}`));
        };

        img.onerror = () => reject(new Error("Failed to load source image"));
      });
    },
    [computeYawDeg, computeRollRad],
  );

  // Thin wrapper used by live-camera path (keeps call-sites readable)
  const overlayGlassesWithLandmarks = useCallback(
    async (
      imageSrc: string,
      landmarks: FaceLandmarks,
      glassesAngles: GlassesAngles,
    ): Promise<string> => {
      return overlayGlassesOnImage(imageSrc, glassesAngles, landmarks);
    },
    [overlayGlassesOnImage],
  );

  // Initialize MediaPipe FaceMesh for live camera mode
  useEffect(() => {
    if (captureMode !== "live" || !webcamRef.current?.video || !selectedProduct)
      return;

    const initializeFaceMesh = async () => {
      try {
        if (cameraRef.current) cameraRef.current.stop();
        if (faceMeshRef.current) faceMeshRef.current.close();

        const faceMesh = new window.FaceMesh({
          locateFile: (file: string) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
        });

        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        faceMesh.onResults(async (results: FaceMeshResults) => {
          if (!results.multiFaceLandmarks?.length || !canvasRef.current) return;

          const landmarks = results.multiFaceLandmarks[0];
          const video = webcamRef.current?.video;
          if (!video || !video.videoWidth) return;

          const faceLandmarks: FaceLandmarks = {
            leftEye: {
              x: landmarks[33].x * video.videoWidth,
              y: landmarks[33].y * video.videoHeight,
            },
            rightEye: {
              x: landmarks[263].x * video.videoWidth,
              y: landmarks[263].y * video.videoHeight,
            },
            nose: {
              x: landmarks[1].x * video.videoWidth,
              y: landmarks[1].y * video.videoHeight,
            },
            leftEar: {
              x: landmarks[234].x * video.videoWidth,
              y: landmarks[234].y * video.videoHeight,
            },
            rightEar: {
              x: landmarks[454].x * video.videoWidth,
              y: landmarks[454].y * video.videoHeight,
            },
          };

          const frameCanvas = document.createElement("canvas");
          frameCanvas.width = video.videoWidth;
          frameCanvas.height = video.videoHeight;
          const ctx = frameCanvas.getContext("2d");
          if (!ctx) return;
          ctx.drawImage(video, 0, 0);

          try {
            const frameWithGlasses = await overlayGlassesWithLandmarks(
              frameCanvas.toDataURL("image/png"),
              faceLandmarks,
              selectedProduct.glassesImages,
            );

            // FIX 5: Draw composited result to the output canvas
            const outputCanvas = canvasRef.current;
            if (outputCanvas) {
              const outputCtx = outputCanvas.getContext("2d");
              const outputImg = new window.Image();
              outputImg.src = frameWithGlasses;
              outputImg.onload = () => {
                if (outputCtx) {
                  outputCtx.clearRect(
                    0,
                    0,
                    outputCanvas.width,
                    outputCanvas.height,
                  );
                  outputCtx.drawImage(
                    outputImg,
                    0,
                    0,
                    outputCanvas.width,
                    outputCanvas.height,
                  );
                }
              };
            }
          } catch (err) {
            console.error("Error overlaying glasses:", err);
          }
        });

        faceMeshRef.current = faceMesh;

        if (webcamRef.current?.video) {
          const camera = new window.Camera(webcamRef.current.video, {
            onFrame: async () => {
              if (webcamRef.current?.video) {
                await faceMesh.send({ image: webcamRef.current.video });
              }
            },
            width: 640,
            height: 480,
          });

          cameraRef.current = camera;
          camera.start();
          setIsCameraReady(true);
        }
      } catch (err) {
        console.error("Error initializing FaceMesh:", err);
        setError(
          "Failed to initialize camera. Please try again or use demo mode.",
        );
      }
    };

    initializeFaceMesh();

    return () => {
      if (cameraRef.current) cameraRef.current.stop();
      if (faceMeshRef.current) faceMeshRef.current.close();
    };
  }, [captureMode, selectedProduct, overlayGlassesWithLandmarks]);

  // FIX 6: Actually overlay glasses when demo model or product changes
  const applyGlassesToDemo = useCallback(
    async (imageUrl: string, product: Product | null) => {
      if (!product) {
        setProcessedImage(null);
        return;
      }
      setIsProcessing(true);
      try {
        // Demo mode has no face detection → heuristic positioning, front PNG
        const result = await overlayGlassesOnImage(
          imageUrl,
          product.glassesImages,
        );
        setProcessedImage(result);
      } catch (err) {
        console.error("Error applying glasses to demo:", err);
        setError(
          "Failed to overlay glasses. Check that the glasses PNGs exist in /public/glasses/.",
        );
        setProcessedImage(imageUrl);
      } finally {
        setIsProcessing(false);
      }
    },
    [overlayGlassesOnImage],
  );

  const handleDemoSelect = useCallback(
    async (imageUrl: string) => {
      setSelectedDemo(imageUrl);
      setProcessedImage(null);
      await applyGlassesToDemo(imageUrl, selectedProduct);
    },
    [selectedProduct, applyGlassesToDemo],
  );

  const handleProductSelect = useCallback(
    (product: Product) => {
      setSelectedProduct(product);
      setRecentlyTried((prev) =>
        [product.id, ...prev.filter((id) => id !== product.id)].slice(0, 3),
      );
      setProcessedImage(null);

      if (captureMode === "demo" || captureMode === "upload") {
        applyGlassesToDemo(selectedDemo, product);
      }
    },
    [captureMode, selectedDemo, applyGlassesToDemo],
  );

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const imageUrl = e.target?.result as string;
          setCaptureMode("upload");
          setSelectedDemo(imageUrl);
          setProcessedImage(null);
          await applyGlassesToDemo(imageUrl, selectedProduct);
        };
        reader.readAsDataURL(file);
      }
    },
    [selectedProduct, applyGlassesToDemo],
  );

  const handleReset = useCallback(() => {
    setSelectedProduct(null);
    setProcessedImage(null);
    setError(null);
    setCaptureMode("demo");
    setSelectedDemo(demoModels[0].url);
  }, []);

  const handleCameraMode = useCallback(() => {
    if (captureMode === "live") {
      setCaptureMode("demo");
      if (cameraRef.current) cameraRef.current.stop();
    } else {
      setCaptureMode("live");
      setProcessedImage(null);
    }
  }, [captureMode]);

  // The image to display in demo/upload mode
  const displayImage = processedImage || selectedDemo;

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, #007C74 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-10 lg:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm border border-white/10 mb-4">
            <CameraIcon className="w-3 h-3 sm:w-4 sm:h-4 text-[#007C74]" />
            <span className="text-[10px] sm:text-xs text-neutral-300 tracking-wider uppercase">
              Virtual Try-On
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
            <span className="text-white">Try Before You</span>{" "}
            <span className="bg-gradient-to-r from-[#007C74] via-[#3C55A5] to-[#00A693] bg-clip-text text-transparent">
              Buy
            </span>
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-neutral-300 max-w-2xl mx-auto">
            See how our sunglasses look on real models or yourself with
            AI-powered try-on
          </p>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 p-3 sm:p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 max-w-2xl mx-auto"
            >
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-xs sm:text-sm text-neutral-300">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto p-1 hover:bg-red-500/20 rounded-full"
              >
                <X className="w-3 h-3 text-red-500" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Interface */}
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Preview Section */}
          <div className="lg:col-span-2">
            {/* FIX 7: Separate rendering paths for live vs demo/upload to avoid canvas/image conflicts */}
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border-2 border-[#007C74]/30 aspect-[4/3] lg:aspect-[16/9] bg-gray-900">
              {captureMode === "live" ? (
                <>
                  {/* Live mode: webcam hidden, canvas shows result */}
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    videoConstraints={{ facingMode }}
                    className="hidden"
                  />
                  <canvas
                    ref={canvasRef}
                    className={`w-full h-full object-cover ${
                      facingMode === "user" ? "scale-x-[-1]" : ""
                    }`}
                    width={640}
                    height={480}
                  />
                  {!isCameraReady && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                      <p className="text-sm text-neutral-300">
                        Starting camera...
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Demo/Upload mode: show composited image directly */}
                  {displayImage && (
                    <div className="absolute inset-0">
                      {/* Use regular img tag to avoid Next.js domain restrictions for data URLs / cross-origin */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={displayImage}
                        alt="Try-on preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* No product selected overlay */}
                  {!selectedProduct && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                      <p className="text-sm text-neutral-300">
                        Select a product to try on
                      </p>
                      {/* Demo model thumbnails shown here when no product selected */}
                      <div className="grid grid-cols-4 gap-2">
                        {demoModels.map((model) => (
                          <motion.button
                            key={model.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDemoSelect(model.url)}
                            className={`relative w-14 h-14 rounded-lg overflow-hidden ring-2 transition-all ${
                              selectedDemo === model.url
                                ? "ring-[#007C74]"
                                : "ring-transparent hover:ring-white/40"
                            }`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={model.url}
                              alt={model.name}
                              className="w-full h-full object-cover"
                            />
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Model switcher (shown when product IS selected, at bottom) */}
                  {selectedProduct && captureMode === "demo" && (
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                      <div className="flex gap-2 justify-center">
                        {demoModels.map((model) => (
                          <motion.button
                            key={model.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDemoSelect(model.url)}
                            className={`relative w-10 h-10 rounded-lg overflow-hidden ring-2 transition-all ${
                              selectedDemo === model.url
                                ? "ring-[#007C74]"
                                : "ring-transparent hover:ring-white/40"
                            }`}
                            title={model.name}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={model.url}
                              alt={model.name}
                              className="w-full h-full object-cover"
                            />
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Processing Overlay */}
              <AnimatePresence>
                {isProcessing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center"
                  >
                    <div className="text-center">
                      {/* FIX 8: border-3 is not valid Tailwind — use border-[3px] */}
                      <div className="w-10 h-10 border-[3px] border-[#007C74] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                      <p className="text-sm text-white">AI Processing...</p>
                      <p className="text-xs text-neutral-400">
                        Overlaying glasses on face
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Controls Overlay */}
              <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 flex items-center justify-between pointer-events-none">
                <div className="flex gap-1 sm:gap-2 pointer-events-auto">
                  <div className="relative group">
                    <motion.button
                      whileHover={{ scale: hasCamera ? 1.1 : 1 }}
                      whileTap={{ scale: hasCamera ? 0.9 : 1 }}
                      onClick={hasCamera ? handleCameraMode : undefined}
                      disabled={!hasCamera}
                      className={`p-1.5 sm:p-2 rounded-full backdrop-blur-sm border transition-all ${
                        !hasCamera
                          ? "opacity-40 cursor-not-allowed bg-white/5 text-neutral-600 border-white/10"
                          : captureMode === "live"
                            ? "bg-[#007C74] text-white border-[#007C74]"
                            : "bg-white/5 text-neutral-400 hover:bg-white/10 border-white/10"
                      }`}
                      title={
                        !hasCamera
                          ? "No camera detected"
                          : captureMode === "live"
                            ? "Switch to Demo"
                            : "Use Live Camera"
                      }
                    >
                      <CameraIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                    </motion.button>
                    {/* No-camera tooltip */}
                    {hasCamera === false && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 pointer-events-none">
                        <div className="bg-gray-900 border border-white/10 rounded-lg p-2 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-[10px] text-neutral-300 leading-snug">
                            No webcam detected. Connect a camera to try on
                            glasses in real-time.
                          </p>
                          {/* Arrow */}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                        </div>
                      </div>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setCaptureMode("demo");
                      if (cameraRef.current) cameraRef.current.stop();
                    }}
                    className={`p-1.5 sm:p-2 rounded-full backdrop-blur-sm border transition-all ${
                      captureMode === "demo"
                        ? "bg-[#007C74] text-white border-[#007C74]"
                        : "bg-white/5 text-neutral-400 hover:bg-white/10 border-white/10"
                    }`}
                    title="Demo Models"
                  >
                    <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-1.5 sm:p-2 rounded-full backdrop-blur-sm border transition-all ${
                      captureMode === "upload"
                        ? "bg-[#007C74] text-white border-[#007C74]"
                        : "bg-white/5 text-neutral-400 hover:bg-white/10 border-white/10"
                    }`}
                    title="Upload Photo"
                  >
                    <Upload className="w-3 h-3 sm:w-4 sm:h-4" />
                  </motion.button>
                </div>

                {captureMode === "live" && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() =>
                      setFacingMode(
                        facingMode === "user" ? "environment" : "user",
                      )
                    }
                    className="p-1.5 sm:p-2 rounded-full backdrop-blur-sm bg-white/5 border border-white/10 text-neutral-400 hover:bg-white/10 pointer-events-auto"
                    title="Switch Camera"
                  >
                    <RotateCw className="w-3 h-3 sm:w-4 sm:h-4" />
                  </motion.button>
                )}
              </div>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {/* Product Selection Panel */}
          <div className="lg:col-span-1">
            <div className="h-full rounded-xl sm:rounded-2xl backdrop-blur-sm bg-white/5 border border-white/10 p-3 sm:p-4">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-xs sm:text-sm font-semibold text-white">
                  Select Your Style
                </h3>
                <span className="text-[10px] sm:text-xs text-neutral-400">
                  {products.length} styles
                </span>
              </div>

              <div className="space-y-2 sm:space-y-3 max-h-[350px] lg:max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    whileHover={{ scale: 1.02, x: 5 }}
                    onClick={() => handleProductSelect(product)}
                    className={`p-2 sm:p-3 rounded-lg sm:rounded-xl cursor-pointer transition-all ${
                      selectedProduct?.id === product.id
                        ? "bg-white/10 border border-[#007C74]/30"
                        : "bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[10px] sm:text-xs font-medium text-white truncate">
                          {product.name}
                        </h4>
                        <p className="text-[8px] sm:text-[10px] text-[#007C74] font-medium mt-0.5">
                          {product.price}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <Users className="w-2 h-2 text-neutral-400" />
                          <span className="text-[8px] sm:text-[10px] text-neutral-400">
                            {product.popularity} tries
                          </span>
                        </div>
                      </div>
                      {selectedProduct?.id === product.id && (
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#007C74] flex-shrink-0" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {recentlyTried.length > 0 && (
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/10">
                  <h4 className="text-[10px] sm:text-xs font-medium text-neutral-400 mb-2">
                    Recently Tried
                  </h4>
                  <div className="flex gap-1.5 sm:gap-2">
                    {recentlyTried.map((id) => {
                      const product = products.find((p) => p.id === id);
                      return product ? (
                        <motion.button
                          key={id}
                          whileHover={{ scale: 1.1 }}
                          onClick={() => handleProductSelect(product)}
                          className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-lg overflow-hidden"
                          title={product.name}
                        >
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="36px"
                          />
                        </motion.button>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {selectedProduct && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={handleReset}
                  className="w-full mt-3 sm:mt-4 px-3 py-1.5 sm:py-2 rounded-lg bg-red-500/20 text-red-500 text-[10px] sm:text-xs hover:bg-red-500/30 transition-colors"
                >
                  Clear Selection
                </motion.button>
              )}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-8 sm:mt-10 lg:mt-12">
          {[
            {
              icon: CameraIcon,
              title: "Live Camera",
              desc: "Try on glasses in real-time with face tracking",
            },
            {
              icon: Sparkles,
              title: "AI-Powered",
              desc: "Accurate face detection with 468 facial landmarks",
            },
            {
              icon: Users,
              title: "Demo Models",
              desc: "See how glasses look on professional models",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -3 }}
              className="p-3 sm:p-4 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 text-center"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#007C74]/10 flex items-center justify-center mx-auto mb-2">
                <feature.icon className="w-4 h-4 text-[#007C74]" />
              </div>
              <h4 className="text-xs sm:text-sm font-semibold text-white mb-1">
                {feature.title}
              </h4>
              <p className="text-[10px] sm:text-xs text-neutral-400">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-white/10">
          <div className="flex items-center gap-1.5">
            <Users className="w-3 h-3 text-[#007C74]" />
            <span className="text-[10px] sm:text-xs text-neutral-400">
              10,000+ virtual try-ons this week
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="w-3 h-3 text-[#007C74]" />
            <span className="text-[10px] sm:text-xs text-neutral-400">
              98% customer satisfaction
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-6 sm:mt-8">
          <Link href="/shop">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#007C74] to-[#3C55A5] text-white text-xs sm:text-sm font-medium inline-flex items-center gap-1.5"
            >
              Browse All Styles
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </motion.button>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </section>
  );
}
