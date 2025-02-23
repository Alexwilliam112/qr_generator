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
    const size = mainCanvas.width * 0.30; // 25% of QR size
    const x = (mainCanvas.width - size) / 2;
    const y = (mainCanvas.height - size) / 2;

    ctx.fillStyle = logoBgColor;
    ctx.fillRect(x, y, size, size); // Draw square background

    // Draw Logo
    const img = new Image();
    img.src = logo;
    img.onload = () => {
      const logoSize = size * 0.7; // 80% of the background size
      ctx.drawImage(img, x + (size - logoSize) / 2, y + (size - logoSize) / 2, logoSize, logoSize);
    };
  }, [reload, logoBgColor]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6">
      <div className="bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-white text-center">Made for Paon Ikan</h1>

        {/* URL Input */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">Enter URL</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800"
          />
        </div>

        {/* Logo Upload Input */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">Upload Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="w-full border border-gray-300 rounded px-2 py-1 cursor-pointer text-white bg-gray-50"
          />
        </div>

        {/* Color Picker for Logo Background */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-white">Logo Background Color</label>
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
          className="w-full bg-blue-500 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Generate QR Code
        </button>

        {/* QR Code Display */}
        <div className="flex justify-center">
          <canvas ref={canvasRef} width={300} height={300} className="border shadow-md rounded-lg bg-white" />
        </div>

        {/* Hidden QR Code Canvas */}
        <div ref={qrCanvasRef} className="hidden">
          <Canvas
            text={url}
            options={{
              errorCorrectionLevel: "H",
              margin: 2,
              scale: 8,
              width: 400,
              color: {
                dark: "#000000",
                light: logoBgColor,
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
