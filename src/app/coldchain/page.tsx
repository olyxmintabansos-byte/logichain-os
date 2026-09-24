"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Snowflake,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useLogiChain } from "@/context/LogiChainContext";
import { ColdChainSensorData } from "@/types/logichain";

export default function ColdChainTelemetryPage() {
  const { coldChainSensors, recalibrateReefer, simulateTempExcursion } = useLogiChain();
  const [selectedSensor, setSelectedSensor] = useState<ColdChainSensorData>(coldChainSensors[0]);

  const activeSensor = coldChainSensors.find((s) => s.containerId === selectedSensor.containerId) || coldChainSensors[0];

  const hasExcursion = activeSensor.compressorStatus === "EXCURSION_ALERT";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 font-mono">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Snowflake className="w-5 h-5 text-cyan-400 animate-spin" />
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wider">
              IOT REEFER COLD CHAIN TELEMETRY
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Real-Time Temperature Drift Monitoring, Compressor Diagnostics &amp; Excursion Mitigation
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => simulateTempExcursion(activeSensor.containerId)}
            className="px-3.5 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-500/40 text-red-300 text-xs font-bold flex items-center gap-2 transition-colors"
            title="Simulasikan gangguan genset"
          >
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span>Simulate Excursion Fault</span>
          </button>

          <button
            onClick={() => recalibrateReefer(activeSensor.containerId)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs flex items-center gap-2 transition-all shadow-md shadow-cyan-500/20 active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Recalibrate &amp; Defrost</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Telemetry Cards & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Monitored Reefer List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-xs font-bold text-slate-400 uppercase pb-2 border-b border-slate-800">
            ACTIVE MONITORED REEFER ASSETS
          </div>

          {coldChainSensors.map((sensor) => {
            const isSelected = activeSensor.containerId === sensor.containerId;
            const isAlert = sensor.compressorStatus === "EXCURSION_ALERT";

            return (
              <div
                key={sensor.containerId}
                onClick={() => setSelectedSensor(sensor)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#081534] border-cyan-400/80 shadow-lg shadow-cyan-500/10"
                    : "bg-[#061026] border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-black text-cyan-300 text-sm">
                        {sensor.containerNumber}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          isAlert
                            ? "bg-red-500/10 text-red-400 border-red-500/30 animate-pulse"
                            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        }`}
                      >
                        {sensor.compressorStatus}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-white font-sans">{sensor.productType}</h3>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-xl font-black ${
                        isAlert ? "text-red-400" : "text-cyan-300"
                      }`}
                    >
                      {sensor.currentTempCelsius}°C
                    </div>
                    <div className="text-[10px] text-slate-400">Target: {sensor.targetTempCelsius}°C</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-3 border-t border-slate-800/80">
                  <span className="text-slate-400">
                    Power: <strong className="text-white">{sensor.powerStatus}</strong>
                  </span>
                  <span className="text-slate-400">
                    Humidity: <strong className="text-white">{sensor.humidityPercent}%</strong>
                  </span>
                  <span className="text-cyan-400 font-bold">Select Sensor ➔</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Temperature Drift Chart & Diagnostics */}
        <div className="lg:col-span-7 space-y-6">
          {/* Real-time Diagnostics HUD */}
          <div className="p-6 rounded-3xl border border-slate-800 bg-[#061026] shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  CONTAINER SENSOR DRIFT GRAPH
                </span>
                <h3 className="text-base font-black text-white">{activeSensor.containerNumber}</h3>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    hasExcursion ? "bg-red-400 animate-ping" : "bg-emerald-400"
                  }`}
                />
                <span className="text-xs font-bold text-slate-300">
                  {hasExcursion ? "TEMP EXCURSION DETECTED" : "COMPRESSOR IN SAFE ZONE"}
                </span>
              </div>
            </div>

            {/* Recharts Chart */}
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activeSensor.history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    domain={[activeSensor.minThresholdCelsius - 5, activeSensor.maxThresholdCelsius + 5]}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#020617", borderColor: "#334155", borderRadius: "12px" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="temp"
                    stroke={hasExcursion ? "#ef4444" : "#38bdf8"}
                    strokeWidth={3}
                    dot={{ r: 4, fill: hasExcursion ? "#ef4444" : "#38bdf8" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Threshold Reference */}
            <div className="flex items-center justify-between text-xs pt-4 border-t border-slate-800 text-slate-400">
              <span>Min Limit: <strong className="text-white">{activeSensor.minThresholdCelsius}°C</strong></span>
              <span>Target: <strong className="text-cyan-400">{activeSensor.targetTempCelsius}°C</strong></span>
              <span>Max Limit: <strong className="text-white">{activeSensor.maxThresholdCelsius}°C</strong></span>
            </div>
          </div>

          {/* Safety Status Banner */}
          <div
            className={`p-5 rounded-2xl border ${
              hasExcursion
                ? "bg-red-950/30 border-red-500/40 text-red-200"
                : "bg-emerald-950/30 border-emerald-500/40 text-emerald-200"
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm mb-1">
              {hasExcursion ? <AlertTriangle className="w-5 h-5 text-red-400" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              <span>{hasExcursion ? "CRITICAL COLD CHAIN BREACH" : "COLD CHAIN INTEGRITY VERIFIED"}</span>
            </div>
            <p className="text-xs font-sans opacity-90 leading-relaxed">
              {hasExcursion
                ? "Suhu kontainer terdeteksi melampaui batas ambang maksimum. Segera lakukan recalibrate compressor atau pindahkan sumber daya ke Shore Power genset cadangan untuk mencegah kerusakan kargo vaksin/biologis."
                : "Kompresor pendingin bekerja secara optimal dalam kurva target. Kargo memenuhi standar HACCP dan sertifikasi Farmakope Indonesia."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
