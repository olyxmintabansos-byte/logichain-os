"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Anchor,
  Box,
  Compass,
  FileCheck2,
  Thermometer,
  ExternalLink,
  Layers3,
} from "lucide-react";
import { useLogiChain } from "@/context/LogiChainContext";

export default function Navbar() {
  const pathname = usePathname();
  const { vessels, coldChainSensors, customs } = useLogiChain();

  const pendingCustoms = customs.filter((c) => c.status !== "CLEARED").length;
  const excursionAlerts = coldChainSensors.filter((s) => s.compressorStatus === "EXCURSION_ALERT").length;

  const navLinks = [
    { href: "/", label: "Fleet AIS Radar", icon: Compass },
    { href: "/terminal/", label: "Terminal Yard & Berth", icon: Box },
    { href: "/customs/", label: "HS Code & B/L Customs", icon: FileCheck2 },
    { href: "/coldchain/", label: "IoT Cold Chain", icon: Thermometer },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-sky-950 bg-slate-950/85 backdrop-blur-md font-mono text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Header */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center shadow-lg shadow-sky-500/20 border border-sky-400/30">
            <Anchor className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-lg tracking-wider text-white">
                LOGICHAIN<span className="text-sky-400">.OS</span>
              </span>
              <span className="text-[10px] uppercase bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded-full border border-sky-500/30 font-semibold">
                TITAN #11
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Maritime Freight, Terminal Yard &amp; INSW OS</p>
          </div>
        </div>

        {/* 4-Route Navigation */}
        <nav className="hidden lg:flex items-center space-x-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              link.href === "/"
                ? pathname === "/" || pathname === ""
                : pathname?.startsWith(link.href.replace(/\/$/, ""));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                  isActive
                    ? "bg-sky-500 text-white shadow-md shadow-sky-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Telemetry Badges */}
        <div className="flex items-center space-x-3">
          {excursionAlerts > 0 && (
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-red-950/40 border border-red-500/40 text-red-400 font-bold animate-pulse">
              <Thermometer className="w-3.5 h-3.5" />
              <span>{excursionAlerts} Temp Breach</span>
            </div>
          )}

          {pendingCustoms > 0 && (
            <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-amber-950/40 border border-amber-500/40 text-amber-300 font-bold">
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>{pendingCustoms} PIB Pending</span>
            </div>
          )}

          <a
            href="https://olyxmintabansos-byte.github.io/olyx-portfolio/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-medium transition-all"
            title="Portfolio Hub"
          >
            <Layers3 className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Hub</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>
        </div>
      </div>
    </header>
  );
}
