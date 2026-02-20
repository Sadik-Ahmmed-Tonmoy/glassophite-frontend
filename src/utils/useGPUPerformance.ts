import { useEffect, useState } from "react";
import { getGPUTier } from "detect-gpu";

export type GPUPerformance = {
  tier: "strong" | "medium" | "weak";
  fps: number | null;
  supportsWebGL2: boolean;
  compileTime: number | null; // time in ms to compile test shader
  devicePixelRatio: number;
};

export function useGPUPerformance() {
  const [gpuPerformance, setGpuPerformance] = useState<GPUPerformance>({
    tier: "medium",
    fps: null,
    supportsWebGL2: false,
    compileTime: null,
    devicePixelRatio: window.devicePixelRatio,
  });

  useEffect(() => {
    let rafId: number;
    let frameCount = 0;
    const startTime = performance.now();

    const testFPS = () => {
      frameCount++;
      const now = performance.now();
      const elapsed = now - startTime;
      if (elapsed < 1000) {
        rafId = requestAnimationFrame(testFPS);
      } else {
        const fps = (frameCount / elapsed) * 1000;
        setGpuPerformance((prev) => ({ ...prev, fps }));
      }
    };

    // Start FPS test
    rafId = requestAnimationFrame(testFPS);

    // Detect GPU tier
    const checkGPU = async () => {
      const gpuTier = await getGPUTier();
      let tier: "strong" | "medium" | "weak" = "medium";

      // Simple logic based on tier + DPR
      if (gpuTier.tier >= 2 && window.devicePixelRatio <= 2.5) tier = "strong";
      else if (gpuTier.tier === 1 || window.devicePixelRatio > 1.5) tier = "medium";
      else tier = "weak";

      // Check WebGL2 support
      const canvas = document.createElement("canvas");
      const gl2 = canvas.getContext("webgl2");
      const supportsWebGL2 = !!gl2;

      // Shader compile test
      let compileTime: number | null = null;
      if (gl2) {
        const vert = gl2.createShader(gl2.VERTEX_SHADER)!;
        const frag = gl2.createShader(gl2.FRAGMENT_SHADER)!;
        gl2.shaderSource(vert, "void main() { gl_Position = vec4(0.0); }");
        gl2.shaderSource(frag, "precision mediump float; void main() { gl_FragColor = vec4(1.0); }");
        const t0 = performance.now();
        gl2.compileShader(vert);
        gl2.compileShader(frag);
        compileTime = performance.now() - t0;
      }

      setGpuPerformance({
        tier,
        fps: null, // FPS will update separately
        supportsWebGL2,
        compileTime,
        devicePixelRatio: window.devicePixelRatio,
      });
    };

    checkGPU();

    return () => cancelAnimationFrame(rafId);
  }, []);

  return gpuPerformance;
}
