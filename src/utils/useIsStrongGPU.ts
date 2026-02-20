import { useEffect, useState } from "react";
import { getGPUTier } from "detect-gpu";

export function useIsStrongGPU() {
  const [isStrong, setIsStrong] = useState<boolean | null>(null);

  useEffect(() => {
    const checkGPU = async () => {
      const gpuTier = await getGPUTier();

      // gpuTier.tier → 0, 1, 2, 3
      // tier 3, 2 → good GPU
      // tier 1, 0 → weak
console.log("gpu tier full:", gpuTier);
      if (gpuTier.tier >= 1 && window.devicePixelRatio > 1.25) {
        setIsStrong(true);   // Show Lightning
        console.log("in");
      } else {
        setIsStrong(false);  // Hide Lightning
      }
    };

    checkGPU();
  }, []);

  return isStrong;
}
