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
import { ContainerYardAsset, PortBerth, CustomsEntry } from "@/types/logichain";

export default function TerminalYardPage() {
  const {
    containers,
    berths,
    customs,
    approveCustomsPIB,
    triggerConfetti,
  } = useLogiChain();

  const [selectedContainer, setSelectedContainer] = useState<string | null>(null);

  const totalContainers = containers.length;
  const inYardCount = containers.filter((c: ContainerYardAsset) => c.status === "IN_YARD").length;
  const customsInspectionCount = customs.filter((c: CustomsEntry) => c.status === "INSPECTION" || c.status === "PENDING_TAX").length;

  const handleCustomsClear = (pibNumber: string) => {
    approveCustomsPIB(pibNumber);
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
              <p className="text-xs font-mono text-slate-400 mb-1">IN YARD</p>
              <p className="text-2xl font-black text-emerald-400">{inYardCount}</p>
              <p className="text-[10px] text-slate-500 mt-1">active slots</p>
            </div>
            <Box className="w-8 h-8 text-emerald-500 opacity-30" />
          </div>
        </div>

        <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-slate-400 mb-1">CUSTOMS PENDING</p>
              <p className="text-2xl font-black text-amber-400">{customsInspectionCount}</p>
              <p className="text-[10px] text-slate-500 mt-1">awaiting clearance</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-amber-500 opacity-30" />
          </div>
        </div>

        <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-slate-400 mb-1">TOTAL BERTHS</p>
              <p className="text-2xl font-black text-violet-400">{berths.length}</p>
              <p className="text-[10px] text-slate-500 mt-1">berth locations</p>
            </div>
            <Anchor className="w-8 h-8 text-violet-500 opacity-30" />
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
                <th className="px-4 py-2 text-left font-semibold text-slate-300">Container Number</th>
                <th className="px-4 py-2 text-left font-semibold text-slate-300">Type</th>
                <th className="px-4 py-2 text-left font-semibold text-slate-300">Location (Bay/Row/Tier)</th>
                <th className="px-4 py-2 text-left font-semibold text-slate-300">Gross Weight</th>
                <th className="px-4 py-2 text-left font-semibold text-slate-300">Status</th>
                <th className="px-4 py-2 text-left font-semibold text-slate-300">Owner Line</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {containers.map((container: ContainerYardAsset) => (
                <tr
                  key={container.id}
                  onClick={() => setSelectedContainer(container.id)}
                  className={`hover:bg-slate-800/50 cursor-pointer transition-colors ${
                    selectedContainer === container.id ? "bg-sky-500/10" : ""
                  }`}
                >
                  <td className="px-4 py-3 font-mono text-sky-300 font-semibold">
                    {container.containerNumber}
                  </td>
                  <td className="px-4 py-3 text-slate-300 text-[10px]">
                    {container.type.replace(/_/g, " ")}
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-slate-800 px-2 py-1 rounded font-mono text-emerald-300">
                      {container.bay} - R{container.row}T{container.tier}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300 font-mono">
                    {container.grossWeightKg.toLocaleString()} kg
                  </td>
                  <td className="px-4 py-3 font-semibold text-amber-300">
                    {container.status}
                  </td>
                  <td className="px-4 py-3 text-slate-400">{container.ownerLine}</td>
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
          {berths.map((berth: PortBerth) => (
            <div
              key={berth.id}
              className={`rounded-lg border p-4 ${
                berth.status === "OCCUPIED"
                  ? "bg-emerald-500/10 border-emerald-500/50"
                  : berth.status === "RESERVED"
                  ? "bg-amber-500/10 border-amber-500/50"
                  : "bg-slate-800/50 border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Anchor className="w-4 h-4 text-sky-400" />
                  <span className="font-bold text-sm text-white">{berth.name}</span>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase ${
                    berth.status === "OCCUPIED"
                      ? "bg-emerald-500/20 text-emerald-300"
                      : berth.status === "RESERVED"
                      ? "bg-amber-500/20 text-amber-300"
                      : "bg-slate-700 text-slate-300"
                  }`}
                >
                  {berth.status}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Terminal</span>
                  <span className="text-sky-300 font-semibold">{berth.terminal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Max Draft / LOA</span>
                  <span className="text-emerald-300 font-semibold">
                    {berth.maxDraftMeters}m / {berth.maxLoaMeters}m
                  </span>
                </div>
              </div>

              {berth.status === "OCCUPIED" && berth.assignedVesselName && (
                <div className="mt-3 pt-3 border-t border-slate-700/50">
                  <p className="text-[10px] text-slate-500 mb-1">Occupied by</p>
                  <p className="text-xs font-semibold text-white">{berth.assignedVesselName}</p>
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
                <th className="px-4 py-2 text-left font-semibold text-slate-300">PIB Number</th>
                <th className="px-4 py-2 text-left font-semibold text-slate-300">Importer</th>
                <th className="px-4 py-2 text-left font-semibold text-slate-300">HS Code</th>
                <th className="px-4 py-2 text-left font-semibold text-slate-300">CIF Value (USD)</th>
                <th className="px-4 py-2 text-left font-semibold text-slate-300">Channel</th>
                <th className="px-4 py-2 text-left font-semibold text-slate-300">Status</th>
                <th className="px-4 py-2 text-left font-semibold text-slate-300">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {customs.map((customsItem: CustomsEntry) => (
                <tr key={customsItem.id} className="hover:bg-slate-800/30">
                  <td className="px-4 py-3 font-mono text-sky-300 font-semibold">
                    {customsItem.pibNumber}
                  </td>
                  <td className="px-4 py-3 text-slate-300">{customsItem.importerName}</td>
                  <td className="px-4 py-3 text-slate-400 font-mono text-[10px]">{customsItem.hsCode}</td>
                  <td className="px-4 py-3 text-amber-300 font-semibold">
                    {formatUSD(customsItem.cifValueUsd)}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] ${
                        customsItem.clearanceChannel === "GREEN_LINE"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : customsItem.clearanceChannel === "YELLOW_LINE"
                          ? "bg-amber-500/20 text-amber-300"
                          : "bg-red-500/20 text-red-300"
                      }`}
                    >
                      {customsItem.clearanceChannel.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-[9px] font-semibold uppercase ${
                        customsItem.status === "CLEARED"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-amber-500/20 text-amber-300"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {customsItem.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {customsItem.status !== "CLEARED" ? (
                      <button
                        onClick={() => handleCustomsClear(customsItem.pibNumber)}
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
