"use client";

import React, { useEffect, useRef } from "react";
import { CargoVessel } from "@/types/logichain";

interface VesselTrackerCanvasProps {
  vessels: CargoVessel[];
  onSelectVessel: (vessel: CargoVessel) => void;
  selectedVesselId?: string;
}

export default function VesselTrackerCanvas({
  vessels,
  onSelectVessel,
  selectedVesselId,
}: VesselTrackerCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let waveOffset = 0;

    // Strait of Malacca / Sunda approximate mapping scale
    // Lat range: -6.0 to 6.0 (12 deg) -> Y axis
    // Lng range: 95.0 to 110.0 (15 deg) -> X axis
    const minLng = 95.0;
    const maxLng = 110.0;
    const minLat = -6.5;
    const maxLat = 5.5;

    const project = (lat: number, lng: number, width: number, height: number) => {
      const x = ((lng - minLng) / (maxLng - minLng)) * width;
      const y = height - ((lat - minLat) / (maxLat - minLat)) * height;
      return { x, y };
    };

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Dark maritime background
      ctx.fillStyle = "#030712";
      ctx.fillRect(0, 0, width, height);

      // Draw radar grid lines
      ctx.strokeStyle = "rgba(14, 165, 233, 0.08)";
      ctx.lineWidth = 1;

      // Lat/Lng lines
      for (let x = 0; x < width; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 60) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Sea Lane / Shipping Corridors (Malacca Strait Route)
      const chokePoints = [
        { lat: 5.4, lng: 99.5 },   // North entrance
        { lat: 3.1, lng: 101.3 },  // Port Klang
        { lat: 1.25, lng: 103.8 }, // Singapore Strait
        { lat: -5.9, lng: 106.0 }, // Sunda Strait / Tanjung Priok
      ];

      ctx.beginPath();
      ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);

      chokePoints.forEach((pt, idx) => {
        const { x, y } = project(pt.lat, pt.lng, width, height);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.setLineDash([]); // Reset dash

      // Animated Water Flow / Current waves
      waveOffset += 0.02;
      ctx.strokeStyle = "rgba(14, 165, 233, 0.05)";
      ctx.lineWidth = 1;
      for (let w = 50; w < height; w += 80) {
        ctx.beginPath();
        for (let lx = 0; lx < width; lx += 20) {
          const ly = w + Math.sin(lx * 0.02 + waveOffset) * 6;
          if (lx === 0) ctx.moveTo(lx, ly);
          else ctx.lineTo(lx, ly);
        }
        ctx.stroke();
      }

      // Draw Major Ports
      const ports = [
        { name: "Port of Tanjung Priok (JKT)", lat: -6.1, lng: 106.88 },
        { name: "Port of Singapore (SGP)", lat: 1.28, lng: 103.85 },
        { name: "Port Klang (MY)", lat: 2.99, lng: 101.39 },
        { name: "Tanjung Perak (SUB)", lat: -7.2, lng: 112.73 },
      ];

      ports.forEach((port) => {
        const { x, y } = project(port.lat, port.lng, width, height);
        ctx.fillStyle = "#38bdf8";
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(56, 189, 248, 0.7)";
        ctx.font = "10px monospace";
        ctx.fillText(port.name, x + 8, y + 3);
      });

      // Draw Vessels
      vessels.forEach((vessel) => {
        const { x, y } = project(
          vessel.currentCoordinates.lat,
          vessel.currentCoordinates.lng,
          width,
          height
        );
        const isSelected = vessel.id === selectedVesselId;

        // Pulse ring if selected
        if (isSelected) {
          ctx.beginPath();
          ctx.arc(x, y, 16, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(56, 189, 248, 0.15)";
          ctx.fill();
          ctx.strokeStyle = "#38bdf8";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Vessel heading vector / speed line
        const headingRad = ((vessel.headingDegrees - 90) * Math.PI) / 180;
        const lineLen = Math.max(12, vessel.speedKnots * 1.2);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(
          x + Math.cos(headingRad) * lineLen,
          y + Math.sin(headingRad) * lineLen
        );
        ctx.strokeStyle = isSelected ? "#38bdf8" : "#0284c7";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Ship hull shape (Triangle pointing in heading)
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((vessel.headingDegrees * Math.PI) / 180);

        ctx.beginPath();
        ctx.moveTo(0, -8);
        ctx.lineTo(5, 6);
        ctx.lineTo(-5, 6);
        ctx.closePath();

        ctx.fillStyle = isSelected
          ? "#38bdf8"
          : vessel.status === "UNDERWAY"
          ? "#10b981"
          : "#f59e0b";
        ctx.fill();
        ctx.strokeStyle = "#082f49";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();

        // Label vessel name & speed
        ctx.fillStyle = isSelected ? "#ffffff" : "#94a3b8";
        ctx.font = isSelected ? "bold 11px monospace" : "10px monospace";
        ctx.fillText(`${vessel.name}`, x + 10, y - 6);
        ctx.fillStyle = "#64748b";
        ctx.font = "9px monospace";
        ctx.fillText(
          `${vessel.speedKnots} kts | ${vessel.currentTeuLoad}/${vessel.teuCapacity} TEU`,
          x + 10,
          y + 6
        );
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [vessels, selectedVesselId]);

  // Click on Canvas to select vessel
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const clickY = ((e.clientY - rect.top) / rect.height) * canvas.height;

    const minLng = 95.0;
    const maxLng = 110.0;
    const minLat = -6.5;
    const maxLat = 5.5;

    // Hit test with 25px radius
    for (const v of vessels) {
      const projX =
        ((v.currentCoordinates.lng - minLng) / (maxLng - minLng)) * canvas.width;
      const projY =
        canvas.height -
        ((v.currentCoordinates.lat - minLat) / (maxLat - minLat)) *
          canvas.height;
      const dist = Math.hypot(clickX - projX, clickY - projY);
      if (dist < 25) {
        onSelectVessel(v);
        return;
      }
    }
  };

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-sky-900/50 shadow-2xl bg-black">
      <div className="absolute top-3 left-4 z-10 flex items-center space-x-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-sky-500/20 text-xs font-mono text-sky-300">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span>AIS LIVE SATELLITE TELEMETRY - SUNDA & MALACCA STRAITS</span>
      </div>

      <canvas
        ref={canvasRef}
        width={1000}
        height={550}
        onClick={handleCanvasClick}
        className="w-full h-full cursor-crosshair block"
      />

      <div className="absolute bottom-3 right-4 z-10 flex items-center space-x-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-sky-500/20 text-[11px] font-mono text-slate-400">
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Underway</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span>Anchored / Berthed</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-sky-400" />
          <span>Selected Target</span>
        </div>
      </div>
    </div>
  );
}
