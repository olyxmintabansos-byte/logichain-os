"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Anchor,
  TrendingUp,
  Calendar,
  Clock,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Download,
} from "lucide-react";
import { useLogiChain } from "@/context/LogiChainContext";
import { formatUSD, formatTimeAgo } from "@/lib/utils";

export default function TerminalYardPage() {
  const {
    containerAssets,
    portBerths,
    customsQueue,
    processCustomsClearance,
    triggerConfetti,
  } = useLogiChain();

  const [selectedContainer, setSelectedContainer] = useState<string | null>(null);

  const totalContainers = containerAssets.length;
  const inStorageCount = containerAssets.filter((c) => c.yardLocation.startsWith("Y")).length;
  const customsPendingCount = customsQueue.filter((c) => c.status === "PENDING_INSPECTION").length;
  const averageStorageDays =
    containerAssets.reduce((acc, c) => acc + c.storageDays, 0) / totalContainers;

  const handleCustomsClear = (blNumber: string) => {
    processCustomsClearance(blNumber);
    triggerConfetti();
  };

  return (
    <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-slate-400 mb-1">YARD INVENTORY</p>
              <p className="text-2xl font-black text-sky-400">{totalContainers}</p>
              <p className="text-[10px] text-slate-500 mt-1">containers tracked</p>
            </div>
            <Container className="w-8 h-8 text-sky-500 opacity-30" />
          </div>
        </div>

        <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-slate-400 mb-1">IN STORAGE</p>
              <p className="text-2xl font-black text-emerald-400">{inStorageCount}</p>
              <p className="text-[10px] text-slate-500 mt-1">active slots</p>
            </div>
            <Box className="w-8 h-8 text-emerald-500 opacity-30" />
          </div>
        </div>

        <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-slate-400 mb-1">CUSTOMS PENDING</p>
              <p className="text-2xl font-black text-amber-400">{customsPendingCount}</p>
              <p className="text-[10px] text-slate-500 mt-1">awaiting clearance</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-amber-500 opacity-30" />
          </div>
        </div>

        <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-slate-400 mb-1">AVG DWELL TIME</p>
              <p className="text-2xl font-black text-violet-400">
                {averageStorageDays.toFixed(1)}d
              </p>
              <p className="text-[10px] text-slate-500 mt-1">storage days</p>
            </div>
            <Clock className="w-8 h-8 text-violet-500 opacity-30" />
          </div>
        </div>
      </div>

      {/* Container Yard Matrix */}
      <div className="bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
        <div className="bg-gradient-to-r from-sky-950/80 to-blue-950/60 px-4 py-3 border-b border-slate-700">
          <h2 className="font-bold text-sm text-slate-100">Container Yard Matrix</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-800/50 border-b border-slate-700">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-slate-300">Container ID</th>
                <th className="px-4 py-2 text-left font-semibold text-slate-300">Type</th>
                <th className="px-4 py-2 text-left font-semibold text-slate-300">Yard Loc</th>
                <th className="px-4 py-2 text-left font-semibold text-slate-300">Weight</th>
                <th className="px-4 py-2 text-left font-semibold text-slate-300">Storage</th>
                <th className="px-4 py-2 text-left font-semibold text-slate-300">Shipper</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {containerAssets.map((container) => (
                <tr
                  key={container.containerId}
                  onClick={() => setSelectedContainer(container.containerId)}
                  className={`hover:bg-slate-800/50 cursor-pointer transition-colors ${
                    selectedContainer === container.containerId ? "bg-sky-500/10" : ""
                  }`}
                >
                  <td className="px-4 py-3 font-mono text-sky-300 font-semibold">
                    {container.containerId}
                  </td>
                  <td className="px-4 py-3 text-slate-300 text-[10px]">
                    {container.containerType.replace(/_/g, " ")}
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-slate-800 px-2 py-1 rounded font-mono text-emerald-300">
                      {container.yardLocation}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300 font-mono">
                    {container.weightKg.toLocaleString()} kg
                  </td>
                  <td className="px-4 py-3 text-amber-300 font-semibold">
                    {container.storageDays}d
                  </td>
                  <td className="px-4 py-3 text-slate-400">{container.shipper}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Port Berth Allocator */}
      <div className="bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
        <div className="bg-gradient-to-r from-emerald-950/80 to-teal-950/60 px-4 py-3 border-b border-slate-700">
          <h2 className="font-bold text-sm text-slate-100">Port Berth Allocator</h2>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {portBerths.map((berth) => (
            <div
              key={berth.berthId}
              className={`rounded-lg border p-4 ${
                berth.status === "OCCUPIED"
                  ? "bg-emerald-500/10 border-emerald-500/50"
                  : berth.status === "MAINTENANCE"
                  ? "bg-red-500/10 border-red-500/50"
                  : "bg-slate-800/50 border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Anchor className="w-4 h-4 text-sky-400" />
                  <span className="font-bold text-sm text-white">{berth.berthName}</span>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase ${
                    berth.status === "OCCUPIED"
                      ? "bg-emerald-500/20 text-emerald-300"
                      : berth.status === "MAINTENANCE"
                      ? "bg-red-500/20 text-red-300"
                      : "bg-slate-700 text-slate-300"
                  }`}
                >
                  {berth.status}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Max Draft</span>
                  <span className="text-sky-300 font-semibold">{berth.maxDraftMeters}m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Max DWT</span>
                  <span className="text-emerald-300 font-semibold">
                    {berth.maxDwt.toLocaleString()}t
                  </span>
                </div>
              </div>

              {berth.status === "OCCUPIED" && berth.occupiedByVessel && (
                <div className="mt-3 pt-3 border-t border-slate-700/50">
                  <p className="text-[10px] text-slate-500 mb-1">Occupied by</p>
                  <p className="text-xs font-semibold text-white">{berth.occupiedByVessel}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* INSW Customs Queue */}
      <div className="bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
        <div className="bg-gradient-to-r from-violet-950/80 to-purple-950/60 px-4 py-3 border-b border-slate-700">
          <h2 className="font-bold text-sm text-slate-100">INSW Customs Clearance Queue</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-800/50 border-b border-slate-700">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-slate-300">BL Number</th>
                <th className="px-4 py-2 text-left font-semibold text-slate-300">Importer</th>
                <th className="px-4 py-2 text-left font-semibold text-slate-300">Commodity</th>
                <th className="px-4 py-2 text-left font-semibold text-slate-300">Duty</th>
                <th className="px-4 py-2 text-left font-semibold text-slate-300">Status</th>
                <th className="px-4 py-2 text-left font-semibold text-slate-300">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {customsQueue.map((customs) => (
                <tr key={customs.blNumber} className="hover:bg-slate-800/30">
                  <td className="px-4 py-3 font-mono text-sky-300 font-semibold">
                    {customs.blNumber}
                  </td>
                  <td className="px-4 py-3 text-slate-300">{customs.importer}</td>
                  <td className="px-4 py-3 text-slate-400 text-[10px]">{customs.commodity}</td>
                  <td className="px-4 py-3 text-amber-300 font-semibold">
                    {formatUSD(customs.customsDuty)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-[9px] font-semibold uppercase ${
                        customs.status === "CLEARED"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-amber-500/20 text-amber-300"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {customs.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {customs.status === "PENDING_INSPECTION" ? (
                      <button
                        onClick={() => handleCustomsClear(customs.blNumber)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-semibold transition-all flex items-center space-x-1"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>CLEAR</span>
                      </button>
                    ) : (
                      <button className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-[10px] font-semibold transition-all flex items-center space-x-1">
                        <Printer className="w-3 h-3" />
                        <span>PRINT</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
