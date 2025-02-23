"use client";

import { useState, useRef, useEffect } from "react";
import { useQRCode } from "next-qrcode";

export default function QRCodeWithLogo() {
  const { Canvas } = useQRCode();
  const canvasRef = useRef(null);
  const [url, setUrl] = useState("https://example.com"); // Default URL
  const logoUrl = "/logo.png"; // Ensure this is in `public/`

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const logo = new Image();
    logo.src = logoUrl;
    logo.onload = () => {
      const size = canvas.width * 0.2; // Logo size 20% of QR
      const x = (canvas.width - size) / 2;
      const y = (canvas.height - size) / 2;
      ctx.drawImage(logo, x, y, size, size);
    };
  }, [url]); // Re-run when URL changes

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      {/* Input for URL */}
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL..."
        className="border p-2 rounded w-80 text-center text-black"
      />

      {/* QR Code */}
      <Canvas
        ref={canvasRef}
        text={url}
        options={{
          errorCorrectionLevel: "H", // High error correction
          margin: 2,
          scale: 8,
          width: 300,
        }}
      />
    </div>
  );
}
