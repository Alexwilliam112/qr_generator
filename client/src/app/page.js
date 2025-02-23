"use client";

import { useState, useRef, useEffect } from "react";
import { useQRCode } from "next-qrcode";

export default function QRCodeWithLogo() {
  const { Canvas } = useQRCode();
  const canvasRef = useRef(null);
  const qrCanvasRef = useRef(null);
  const [url, setUrl] = useState("https://example.com");
  const [logo, setLogo] = useState(null);
  const [logoBgColor, setLogoBgColor] = useState("#ffffff"); // Default white background
  const [reload, setReload] = useState(false);

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateQRCode = () => {
    setReload((prev) => !prev);
  };

  useEffect(() => {
    const qrCanvas = qrCanvasRef.current?.querySelector("canvas");
    const mainCanvas = canvasRef.current;
    if (!qrCanvas || !mainCanvas || !logo) return;

    const ctx = mainCanvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

    // Draw QR Code
    ctx.drawImage(qrCanvas, 0, 0, mainCanvas.width, mainCanvas.height);

    // Draw Logo Background (Square)
    const size = mainCanvas.width * 0.35; // 25% of QR size
    const x = (mainCanvas.width - size) / 2;
    const y = (mainCanvas.height - size) / 2;

    ctx.fillStyle = logoBgColor;
    ctx.fillRect(x, y, size, size); // Draw square background

    // Draw Logo
    const img = new Image();
    img.src = logo;
    img.onload = () => {
      const logoSize = size * 0.80; // 70% of the background size
      ctx.drawImage(img, x + (size - logoSize) / 2, y + (size - logoSize) / 2, logoSize, logoSize);
    };
  }, [reload, logoBgColor]);

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

      {/* Color Picker for Logo Background */}
      <div className="flex items-center space-x-2">
        <label className="text-black">Logo Background:</label>
        <input
          type="color"
          value={logoBgColor}
          onChange={(e) => setLogoBgColor(e.target.value)}
          className="w-10 h-10 border rounded cursor-pointer"
        />
      </div>

      {/* Generate QR Code Button */}
      <button
        onClick={handleGenerateQRCode}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        Generate QR Code
      </button>

      {/* Hidden QR Code Canvas */}
      <div ref={qrCanvasRef} className="hidden">
        <Canvas
          text={url}
          options={{
            errorCorrectionLevel: "H",
            margin: 2,
            scale: 8,
            width: 300,
            color: {
              dark: "#000000",
              light: logoBgColor, // Transparent background
            },
          }}
        />
      </div>

      {/* Visible QR Code Canvas */}
      <canvas ref={canvasRef} width={300} height={300} className="border shadow-lg" />
    </div>
  );
}
