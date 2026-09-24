"use client";

import React, { useState } from "react";
import {
  Ship,
  Anchor,
  Activity,
  TrendingUp,
  AlertTriangle,
  MoreVertical,
  MapPin,
  Gauge,
  Container,
  Calendar,
} from "lucide-react";
import { useLogiChain } from "@/context/LogiChainContext";
import VesselTrackerCanvas from "@/components/VesselTrackerCanvas";

export default function FleetDashboard() {
  const {
    vessels,
    selectedVessel,
    selectVessel,
    triggerConfetti,
  } = useLogiChain();

  const totalTeu = vessels.reduce((acc, v) => acc + v.currentTeuLoad, 0);
  const totalCapacity = vessels.reduce((acc, v) => acc + v.teuCapacity, 0);
  const utilizationRate = (totalTeu / totalCapacity) * 100;
  const underwayCount = vessels.filter((v) => v.status === "UNDERWAY").length;

  return (
    <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* KPI Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-slate-400 mb-1">TOTAL TEU AFLOAT</p>
              <p className="text-2xl font-black text-sky-400">{totalTeu.toLocaleString()}</p>
              <p className="text-[10px] text-slate-500 mt-1">
                of {totalCapacity.toLocaleString()} capacity
              </p>
            </div>
            <Container className="w-8 h-8 text-sky-500 opacity-30" />
          </div>
        </div>

        <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-slate-400 mb-1">UTILIZATION RATE</p>
              <p className="text-2xl font-black text-emerald-400">
                {utilizationRate.toFixed(1)}%
              </p>
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-400 to-sky-500 h-full transition-all"
                  style={{ width: `${utilizationRate}%` }}
                />
              </div>
            </div>
            <TrendingUp className="w-8 h-8 text-emerald-500 opacity-30" />
          </div>
        </div>

        <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-slate-400 mb-1">ACTIVE VESSELS</p>
              <p className="text-2xl font-black text-amber-400">{underwayCount}</p>
              <p className="text-[10px] text-slate-500 mt-1">
                underway / {vessels.length} total
              </p>
            </div>
            <Ship className="w-8 h-8 text-amber-500 opacity-30" />
          </div>
        </div>

        <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-slate-400 mb-1">SYSTEM STATUS</p>
              <div className="flex items-center space-x-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-sm font-semibold text-emerald-400">OPERATIONAL</p>
              </div>
              <p className="text-[10px] text-slate-500 mt-2">All systems nominal</p>
            </div>
            <Activity className="w-8 h-8 text-emerald-500 opacity-30" />
          </div>
        </div>
      </div>

      {/* AIS Canvas + Vessel Details */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Map Canvas */}
        <div className="xl:col-span-2 bg-slate-900/40 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
          <VesselTrackerCanvas
            vessels={vessels}
            onSelectVessel={selectVessel}
            selectedVesselId={selectedVessel?.id}
          />
        </div>

        {/* Vessel Details Panel */}
        <div className="bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
          <div className="bg-gradient-to-r from-sky-950/80 to-blue-950/60 px-4 py-3 border-b border-slate-700 flex items-center justify-between">
            <h2 className="font-bold text-sm text-slate-100 flex items-center space-x-2">
              <Anchor className="w-4 h-4 text-sky-400" />
              <span>VESSEL PROFILE</span>
            </h2>
            <button
              onClick={() => triggerConfetti()}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-all"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          {selectedVessel ? (
            <div className="p-4 space-y-4">
              <div>
                <p className="text-xs font-mono text-slate-500 uppercase">Vessel Name</p>
                <p className="text-lg font-bold text-white mt-1">{selectedVessel.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-800/50 rounded-lg p-2">
                  <p className="text-slate-400 font-mono">IMO Number</p>
                  <p className="text-sky-300 font-semibold mt-0.5">{selectedVessel.imoNumber}</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-2">
                  <p className="text-slate-400 font-mono">Flag</p>
                  <p className="text-amber-300 font-semibold mt-0.5">{selectedVessel.flag}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">TEU Load</span>
                  <span className="text-sky-300 font-semibold">
                    {selectedVessel.currentTeuLoad} / {selectedVessel.teuCapacity}
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-sky-500 to-blue-600 h-full"
                    style={{
                      width: `${
                        (selectedVessel.currentTeuLoad / selectedVessel.teuCapacity) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-800/50 rounded-lg p-2">
                  <p className="text-slate-400 font-mono">Speed</p>
                  <p className="text-emerald-300 font-semibold mt-0.5">
                    {selectedVessel.speedKnots} kts
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-2">
                  <p className="text-slate-400 font-mono">Heading</p>
                  <p className="text-emerald-300 font-semibold mt-0.5">
                    {selectedVessel.headingDegrees}°
                  </p>
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-700 pt-3">
                <div className="flex items-start space-x-2 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-slate-500 font-mono">Origin Port</p>
                    <p className="text-slate-200 font-medium">{selectedVessel.originPort}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-sky-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-slate-500 font-mono">Destination Port</p>
                    <p className="text-slate-200 font-medium">
                      {selectedVessel.destinationPort}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/60 rounded-lg p-2.5 border border-slate-700/50">
                <div className="flex items-center space-x-2 text-xs">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <div>
                    <p className="text-slate-500 font-mono">ETA</p>
                    <p className="text-sky-300 font-semibold">
                      {new Date(selectedVessel.eta).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`rounded-lg p-2 text-center text-xs font-bold uppercase tracking-wider ${
                  selectedVessel.status === "UNDERWAY"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50"
                    : selectedVessel.status === "ANCHORED"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/50"
                    : "bg-sky-500/20 text-sky-300 border border-sky-500/50"
                }`}
              >
                {selectedVessel.status}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400">
              <Ship className="w-12 h-12 opacity-20 mx-auto mb-2" />
              <p className="text-xs font-mono">Click vessel on map to inspect</p>
            </div>
          )}
        </div>
      </div>

      {/* Vessel List */}
      <div className="bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
        <div className="bg-gradient-to-r from-sky-950/80 to-blue-950/60 px-4 py-3 border-b border-slate-700">
          <h2 className="font-bold text-sm text-slate-100">Active Fleet Registry</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-800/50 border-b border-slate-700">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-slate-300">Vessel Name</th>
                <th className="px-4 py-2 text-left font-semibold text-slate-300">Status</th>
                <th className="px-4 py-2 text-left font-semibold text-slate-300">Speed</th>
                <th className="px-4 py-2 text-left font-semibold text-slate-300">TEU Load</th>
                <th className="px-4 py-2 text-left font-semibold text-slate-300">ETA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {vessels.map((vessel) => (
                <tr
                  key={vessel.id}
                  onClick={() => selectVessel(vessel)}
                  className={`hover:bg-slate-800/50 cursor-pointer transition-colors ${
                    selectedVessel?.id === vessel.id ? "bg-sky-500/10" : ""
                  }`}
                >
                  <td className="px-4 py-3 font-semibold text-sky-300">{vessel.name}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-[10px] font-semibold uppercase ${
                        vessel.status === "UNDERWAY"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : vessel.status === "ANCHORED"
                          ? "bg-amber-500/20 text-amber-300"
                          : "bg-sky-500/20 text-sky-300"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {vessel.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-emerald-300 font-mono">
                    {vessel.speedKnots} kts
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {vessel.currentTeuLoad} / {vessel.teuCapacity}
                  </td>
                  <td className="px-4 py-3 text-slate-400 font-mono">
                    {new Date(vessel.eta).toLocaleDateString("id-ID")}
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
