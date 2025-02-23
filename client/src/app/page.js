"use client";

import { useState, useRef, useEffect } from "react";
import { useQRCode } from "next-qrcode";

export default function QRCodeWithLogo() {
  const { Canvas } = useQRCode();
  const canvasRef = useRef(null);
  const qrCanvasRef = useRef(null);
  const [url, setUrl] = useState("https://example.com"); // Default URL
  const [logo, setLogo] = useState(null); // Store logo as an image source
  const [reload, setReload] = useState(false); // Trigger for reloading canvas

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setLogo(reader.result); // Convert to base64 URL
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateQRCode = () => {
    setReload((prev) => !prev); // Toggle reload state to trigger useEffect
  };

  useEffect(() => {
    const qrCanvas = qrCanvasRef.current?.querySelector("canvas");
    const mainCanvas = canvasRef.current;
    if (!qrCanvas || !mainCanvas || !logo) return;

    const ctx = mainCanvas.getContext("2d");
    if (!ctx) return;

    // Ensure the canvas is transparent
    ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

    // Draw the QR code first
    ctx.drawImage(qrCanvas, 0, 0, mainCanvas.width, mainCanvas.height);

    // Draw the logo
    const img = new Image();
    img.src = logo;
    img.onload = () => {
      const size = mainCanvas.width * 0.2; // Logo size 20% of QR
      const x = (mainCanvas.width - size) / 2;
      const y = (mainCanvas.height - size) / 2;
      ctx.drawImage(img, x, y, size, size);
    };
  }, [reload]);

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      {/* URL Input */}
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL..."
        className="border p-2 rounded w-80 text-center text-black"
      />

      {/* Logo Upload Input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleLogoUpload}
        className="border p-2 rounded w-80 text-white"
      />

      {/* Generate QR Code Button */}
      <button
        onClick={handleGenerateQRCode}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        Generate QR Code
      </button>

      {/* Hidden QR Code Canvas (for extracting QR) */}
      <div ref={qrCanvasRef} className="hidden">
        <Canvas
          text={url}
          options={{
            errorCorrectionLevel: "H", // High error correction
            margin: 2,
            scale: 8,
            width: 300,
            color: {
              dark: "#000000", // Black QR code
              light: "#FFFFFF00", // Transparent background
            },
          }}
        />
      </div>

      {/* Visible Canvas (with QR + Logo) */}
      <canvas ref={canvasRef} width={300} height={300} className="border shadow-lg" />
    </div>
  );
}
