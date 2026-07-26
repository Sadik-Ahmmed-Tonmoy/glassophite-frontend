import imageCompression from "browser-image-compression";

/**
 * Converts and compresses any image file to a sharp, lightweight WebP format for web performance.
 */
export const convertToWebP = async (file: File): Promise<File> => {
  // If already WebP and very small (< 200KB), return as-is
  if (file.type === "image/webp" && file.size < 200 * 1024) {
    return file;
  }

  try {
    const options = {
      maxSizeMB: 0.5, // Max 500KB for product images
      maxWidthOrHeight: 1200, // Max 1200px dimension ideal for product catalog
      useWebWorker: true,
      fileType: "image/webp",
      initialQuality: 0.8,
    };
    const compressedBlob = await imageCompression(file, options);
    const webpFileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
    return new File([compressedBlob], webpFileName, { type: "image/webp" });
  } catch {
    // Fallback to HTML Canvas WebP conversion with high quality scaling
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement("canvas");
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Resize down to max 1200px maintaining aspect ratio
        const maxDim = 1200;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(file);

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) return resolve(file);
            const webpFileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
            resolve(new File([blob], webpFileName, { type: "image/webp" }));
          },
          "image/webp",
          0.8
        );
      };
      img.onerror = () => resolve(file);
      img.src = url;
    });
  }
};

export const uploadImageToImgBB = async (file: File): Promise<string> => {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!apiKey) {
    throw new Error("ImgBB API key is missing. Please check your .env configuration.");
  }

  // Convert and optimize image to WebP format before uploading
  const webpFile = await convertToWebP(file);

  const formData = new FormData();
  formData.append("image", webpFile);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (response.ok && data?.success && data?.data?.url) {
    return data.data.url;
  } else {
    throw new Error(data?.error?.message || "Failed to upload image to ImgBB");
  }
};
