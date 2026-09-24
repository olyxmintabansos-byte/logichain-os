"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Ship,
  Anchor,
  Box,
  Compass,
  FileText,
  Activity,
  ExternalLink,
  Layers,
} from "lucide-react";
import { useLogiChain } from "@/context/LogiChainContext";

export default function Navbar() {
  const pathname = usePathname();
  const { vessels, containers } = useLogiChain();

  const totalTeuInTransit = vessels.reduce((acc, v) => acc + v.currentTeuLoad, 0);
  const activeVesselsCount = vessels.filter((v) => v.status === "UNDERWAY").length;

  const navLinks = [
    {
      name: "Fleet AIS Command",
      href: "/",
      icon: Ship,
    },
    {
      name: "Terminal Yard & Berth",
      href: "/terminal/",
      icon: Box,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-sky-950 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center shadow-lg shadow-sky-500/20 border border-sky-400/30">
            <Anchor className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-lg tracking-wider text-white">
                LOGICHAIN<span className="text-sky-400">.OS</span>
              </span>
              <span className="text-[10px] font-mono uppercase bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded-full border border-sky-500/30 font-semibold">
                TITAN #11
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400">
              Maritime Freight AIS & Port Container Yard OS
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-sky-500 text-white shadow-md shadow-sky-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Global Live AIS Telemetry Badges */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex flex-col text-right font-mono">
            <div className="text-[10px] text-slate-400 flex items-center justify-end space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>TEU IN TRANSIT</span>
            </div>
            <span className="text-xs font-bold text-sky-400">
              {totalTeuInTransit.toLocaleString()} TEU ({activeVesselsCount} Active)
            </span>
          </div>

          <a
            href="https://olyxmintabansos-byte.github.io/olyx-portfolio/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-medium transition-all"
          >
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Portfolio Hub</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>
    </header>
  );
}
