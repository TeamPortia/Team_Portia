// src/components/common/ImageCropModal.jsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { ZoomIn, ZoomOut, RotateCcw, RotateCw, Check, RefreshCw } from "lucide-react";

export const ImageCropModal = ({ isOpen, onClose, imageSrc, onCropComplete }) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0); // in degrees
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Load image when imageSrc changes
  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);
      setZoom(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
    };
  }, [imageSrc]);

  // Draw image onto interactive preview canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img || !imageLoaded) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.save();

    // Center point
    ctx.translate(width / 2 + position.x, height / 2 + position.y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Draw image centered
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();
  }, [imageLoaded, zoom, rotation, position]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Mouse / Touch Dragging handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX - position.x, y: clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setPosition({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const handleRotateLeft = () => {
    setRotation((prev) => (prev - 90 + 360) % 360);
  };

  const handleRotateRight = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Crop final result to 400x400 square / circular output
  const handleCropAndSave = () => {
    const img = imageRef.current;
    if (!img) return;

    const outputSize = 400;
    const outputCanvas = document.createElement("canvas");
    outputCanvas.width = outputSize;
    outputCanvas.height = outputSize;
    const ctx = outputCanvas.getContext("2d");

    ctx.clearRect(0, 0, outputSize, outputSize);
    ctx.save();

    // Map the 320x320 preview canvas coordinates to 400x400 output canvas
    const scaleFactor = outputSize / 320;
    ctx.translate(
      outputSize / 2 + position.x * scaleFactor,
      outputSize / 2 + position.y * scaleFactor
    );
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom * scaleFactor, zoom * scaleFactor);

    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();

    const croppedBase64 = outputCanvas.toDataURL("image/jpeg", 0.85);
    onCropComplete(croppedBase64);
    onClose();
  };

  const handleUseOriginal = () => {
    if (imageSrc) {
      onCropComplete(imageSrc);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crop & Adjust Profile Picture" size="md">
      <div className="space-y-6">
        <p className="text-xs text-gray-500 text-center">
          Drag photo to position, use slider to zoom, or click <strong>Use Full Original Photo</strong> to keep the original uncropped photo.
        </p>

        {/* Interactive Crop Viewport Canvas */}
        <div className="flex justify-center items-center">
          <div
            className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] rounded-full overflow-hidden border-4 border-indigo-500 shadow-2xl bg-gray-900 cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
          >
            <canvas
              ref={canvasRef}
              width={320}
              height={320}
              className="w-full h-full pointer-events-none"
            />
            {/* Overlay Circle Guide */}
            <div className="absolute inset-0 rounded-full border-2 border-white/40 pointer-events-none" />
          </div>
        </div>

        {/* Adjustment Controls */}
        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 space-y-4">
          {/* Zoom Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-700 dark:text-gray-300">
              <span className="flex items-center gap-1">
                <ZoomOut className="w-3.5 h-3.5" />
                Zoom Level
              </span>
              <span>{Math.round(zoom * 100)}%</span>
            </div>
            <div className="flex items-center gap-3">
              <ZoomOut className="w-4 h-4 text-gray-400" />
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <ZoomIn className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Rotate & Reset Buttons */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRotateLeft}
                title="Rotate Left 90°"
                icon={RotateCcw}
              >
                -90°
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRotateRight}
                title="Rotate Right 90°"
                icon={RotateCw}
              >
                +90°
              </Button>
            </div>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleReset}
              icon={RefreshCw}
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
          <Button
            type="button"
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={handleUseOriginal}
          >
            Use Full Original Photo (No Crop)
          </Button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" variant="gradient" onClick={handleCropAndSave} icon={Check}>
              Apply & Save Crop
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
