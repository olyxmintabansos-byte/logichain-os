"use client";

import React, { useState } from "react";
import {
  FileCheck2,
  Printer,
  ShieldCheck,
  Scale,
  CheckCircle2,
} from "lucide-react";
import { useLogiChain } from "@/context/LogiChainContext";
import { CustomsEntry } from "@/types/logichain";
import { formatUSD, formatRupiah, formatNumber } from "@/lib/utils";

const MASTER_HS_CODES = [
  { code: "8542.31.00", desc: "Integrated Circuits / Microprocessors", dutyPercent: 0, pphPercent: 2.5 },
  { code: "2902.20.00", desc: "Benzene Industrial Chemical Liquid Bulk", dutyPercent: 5, pphPercent: 2.5 },
  { code: "0202.30.00", desc: "Boneless Frozen Bovine Meat (Halal)", dutyPercent: 5, pphPercent: 2.5 },
  { code: "8471.30.20", desc: "Portable Automatic Data Processing Machines (Laptops)", dutyPercent: 0, pphPercent: 2.5 },
  { code: "8703.80.19", desc: "Electric Vehicles Completely Built Up (EV CBU)", dutyPercent: 10, pphPercent: 10 },
];

export default function CustomsClearancePage() {
  const { customs, approveCustomsPIB } = useLogiChain();
  const [selectedEntry, setSelectedEntry] = useState<CustomsEntry>(customs[0]);
  const [activeTab, setActiveTab] = useState<"ENTRIES" | "BILL_OF_LADING">("ENTRIES");

  // Calculator inputs
  const [calcCifUsd, setCalcCifUsd] = useState<number>(50000);
  const [selectedHs, setSelectedHs] = useState(MASTER_HS_CODES[0]);

  const kursBi = 16250;
  const cifIdr = calcCifUsd * kursBi;
  const beaMasukIdr = cifIdr * (selectedHs.dutyPercent / 100);
  const nilaiImporIdr = cifIdr + beaMasukIdr;
  const ppnIdr = nilaiImporIdr * 0.11;
  const pphIdr = nilaiImporIdr * (selectedHs.pphPercent / 100);
  const totalPungutanIdr = beaMasukIdr + ppnIdr + pphIdr;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 font-mono">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileCheck2 className="w-5 h-5 text-sky-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wider">
              INSW CUSTOMS &amp; BILL OF LADING ENGINE
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Harmonized System (HS) Tariff Calculator, Risk Profiling Channels &amp; Official B/L Manifest
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-[#061026] p-1 rounded-2xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab("ENTRIES")}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                activeTab === "ENTRIES"
                  ? "bg-sky-500 text-white shadow-md shadow-sky-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              PIB Manifests
            </button>
            <button
              onClick={() => setActiveTab("BILL_OF_LADING")}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                activeTab === "BILL_OF_LADING"
                  ? "bg-sky-500 text-white shadow-md shadow-sky-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Bill of Lading A4
            </button>
          </div>

          {activeTab === "BILL_OF_LADING" && (
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4 text-sky-400" />
              <span>Print A4</span>
            </button>
          )}
        </div>
      </div>

      {activeTab === "ENTRIES" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Live PIB Inbound Declarations */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase">
                PEMBERITAHUAN IMPOR BARANG (PIB) QUEUE
              </span>
              <span className="text-xs text-sky-400 font-mono">{customs.length} Declarations</span>
            </div>

            {customs.map((entry) => {
              const isSelected = selectedEntry.id === entry.id;
              return (
                <div
                  key={entry.id}
                  onClick={() => setSelectedEntry(entry)}
                  className={`p-5 rounded-3xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#081534] border-sky-400/80 shadow-lg shadow-sky-500/10"
                      : "bg-[#061026] border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-black text-sky-300 text-sm">
                          {entry.pibNumber}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            entry.clearanceChannel === "GREEN_LINE"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              : entry.clearanceChannel === "YELLOW_LINE"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                              : "bg-red-500/10 text-red-400 border-red-500/30"
                          }`}
                        >
                          {entry.clearanceChannel.replace("_", " ")}
                        </span>
                      </div>
                      <h3 className="text-xs font-bold text-white font-sans">{entry.importerName}</h3>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-black text-white">{formatUSD(entry.cifValueUsd)}</div>
                      <div className="text-[10px] text-slate-400 uppercase">CIF VALUE</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 font-sans mb-3 line-clamp-1">
                    {entry.goodsDescription}
                  </p>

                  <div className="flex flex-wrap items-center justify-between text-[11px] pt-3 border-t border-slate-800/80">
                    <span className="text-slate-400">
                      HS Code: <strong className="text-sky-300">{entry.hsCode}</strong>
                    </span>
                    <span className="text-slate-400">
                      Total Pungutan: <strong className="text-emerald-400">{formatRupiah(entry.totalLevyIdr)}</strong>
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        entry.status === "CLEARED"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-amber-500/20 text-amber-400"
                      }`}
                    >
                      {entry.status}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Interactive HS Code Calculator Widget */}
            <div className="p-6 rounded-3xl border border-slate-800 bg-[#061026] mt-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <Scale className="w-5 h-5 text-sky-400" />
                <h3 className="text-sm font-bold text-white tracking-wider">
                  SIMULATOR TARIF BEA MASUK &amp; PAJAK IMPOR (INSW)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                    Pilih Pos Tarif HS Code:
                  </label>
                  <select
                    value={selectedHs.code}
                    onChange={(e) => {
                      const found = MASTER_HS_CODES.find((h) => h.code === e.target.value);
                      if (found) setSelectedHs(found);
                    }}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    {MASTER_HS_CODES.map((h) => (
                      <option key={h.code} value={h.code}>
                        {h.code} — {h.desc}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                    Nilai Pabean (CIF USD):
                  </label>
                  <input
                    type="number"
                    value={calcCifUsd}
                    onChange={(e) => setCalcCifUsd(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-sky-300 font-mono focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Calculator Output Breakdown */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Nilai Pabean CIF IDR (Kurs Rp 16.250):</span>
                  <span className="font-bold text-white">{formatRupiah(cifIdr)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Bea Masuk ({selectedHs.dutyPercent}%):</span>
                  <span className="font-bold text-white">{formatRupiah(beaMasukIdr)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>PPN Impor (11%):</span>
                  <span className="font-bold text-white">{formatRupiah(ppnIdr)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>PPh Pasal 22 Impor ({selectedHs.pphPercent}%):</span>
                  <span className="font-bold text-white">{formatRupiah(pphIdr)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-800 font-black text-sm">
                  <span className="text-sky-400">Total Tagihan Billing Pabean:</span>
                  <span className="text-emerald-400">{formatRupiah(totalPungutanIdr)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Selected PIB Inspector & 1-Click Clearance */}
          <div className="lg:col-span-5">
            {selectedEntry && (
              <div className="p-6 rounded-3xl border border-slate-800 bg-[#061026] sticky top-24 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    CUSTOMS ENTRY INSPECTOR
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-[10px] font-bold">
                    INSW DIRECT
                  </span>
                </div>

                <h2 className="text-lg font-black text-white mb-1">{selectedEntry.pibNumber}</h2>
                <p className="text-xs text-sky-300 font-sans mb-6">{selectedEntry.importerName}</p>

                <div className="space-y-3 mb-6 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                    <span className="text-slate-400">Nomor B/L:</span>
                    <strong className="text-white font-mono">{selectedEntry.billOfLadingNumber}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                    <span className="text-slate-400">Komoditas &amp; HS:</span>
                    <strong className="text-sky-300 font-mono">{selectedEntry.hsCode}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                    <span className="text-slate-400">Berat Bruto:</span>
                    <strong className="text-white">{formatNumber(selectedEntry.grossWeightKg)} kg</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                    <span className="text-slate-400">Total Pungutan:</span>
                    <strong className="text-emerald-400">{formatRupiah(selectedEntry.totalLevyIdr)}</strong>
                  </div>
                </div>

                {selectedEntry.status === "CLEARED" ? (
                  <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>SPPB Telah Terbit (Jalur Hijau Selesai)</span>
                  </div>
                ) : (
                  <button
                    onClick={() => approveCustomsPIB(selectedEntry.id)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-sky-500/25 active:scale-95"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Setujui &amp; Terbitkan SPPB (1-Click Clear)</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Bill of Lading (B/L) Official A4 Document */
        <div className="bg-[#050c1e] border border-slate-800 rounded-3xl p-8 max-w-4xl mx-auto shadow-2xl print:border-none print:bg-white print:text-black font-sans">
          {/* Official Letterhead */}
          <div className="border-b-2 border-slate-700 print:border-black pb-6 mb-6 flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-sky-600 flex items-center justify-center text-white print:bg-black">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white print:text-black tracking-wider">
                  PT PELABUHAN INDONESIA (PERSERO)
                </h2>
                <p className="text-[10px] text-slate-400 print:text-slate-700 font-mono">
                  TANJUNG PRIOK INTERNATIONAL CONTAINER TERMINAL (JICT/KOJA)
                </p>
                <p className="text-[9px] text-slate-500 print:text-slate-600">
                  Jl. Pasoso No. 1, Tanjung Priok, Jakarta Utara 14310 • Kepabeanan Bea &amp; Cukai Tipe A
                </p>
              </div>
            </div>

            <div className="text-right font-mono text-xs">
              <div className="text-[10px] text-slate-400 print:text-black uppercase">DOCUMENT NUMBER</div>
              <div className="font-black text-sky-400 print:text-black text-sm">{selectedEntry.billOfLadingNumber}</div>
              <div className="text-[10px] text-emerald-400 print:text-black font-bold mt-1">STATUS: {selectedEntry.status}</div>
            </div>
          </div>

          <div className="text-center font-serif uppercase tracking-widest text-sm font-bold border-b border-slate-800 print:border-slate-300 pb-2 mb-6 text-sky-300 print:text-black">
            OCEAN BILL OF LADING &amp; PEMBERITAHUAN IMPOR BARANG (PIB)
          </div>

          {/* Shipper & Consignee Grid */}
          <div className="grid grid-cols-2 gap-6 mb-6 text-xs">
            <div className="p-4 rounded-xl bg-slate-950/60 print:bg-slate-50 border border-slate-800 print:border-slate-300">
              <span className="text-[10px] font-bold text-slate-400 print:text-slate-600 block mb-1 uppercase">
                Consignee / Importer:
              </span>
              <strong className="text-white print:text-black text-sm block mb-1">{selectedEntry.importerName}</strong>
              <p className="text-slate-400 print:text-slate-700 text-[11px]">
                Kawasan Industri MM2100, Cikarang Barat, Jawa Barat, Indonesia
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 print:bg-slate-50 border border-slate-800 print:border-slate-300">
              <span className="text-[10px] font-bold text-slate-400 print:text-slate-600 block mb-1 uppercase">
                Carrier &amp; Vessel Call:
              </span>
              <strong className="text-white print:text-black text-sm block mb-1">CMA CGM Pacific Pioneer (V.2608)</strong>
              <p className="text-slate-400 print:text-slate-700 text-[11px]">
                Port of Loading: Rotterdam ➔ Port of Discharge: Tanjung Priok (IDTPP)
              </p>
            </div>
          </div>

          {/* Cargo Breakdown Table */}
          <div className="rounded-xl border border-slate-800 print:border-slate-300 overflow-hidden mb-6 text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-950 print:bg-slate-100 text-slate-300 print:text-black border-b border-slate-800 print:border-slate-300 font-mono text-[10px]">
                <tr>
                  <th className="p-3">Container No / Seal</th>
                  <th className="p-3">HS Code</th>
                  <th className="p-3">Description of Goods</th>
                  <th className="p-3 text-right">Gross Weight</th>
                  <th className="p-3 text-right">CIF Value (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-slate-300 text-slate-300 print:text-black">
                <tr>
                  <td className="p-3 font-mono">MSKU-741920-4<br /><span className="text-[10px] text-slate-500">SEAL-MK-88912</span></td>
                  <td className="p-3 font-mono text-sky-400 print:text-black">{selectedEntry.hsCode}</td>
                  <td className="p-3">{selectedEntry.goodsDescription}</td>
                  <td className="p-3 text-right font-mono">{formatNumber(selectedEntry.grossWeightKg)} kg</td>
                  <td className="p-3 text-right font-mono font-bold text-white print:text-black">{formatUSD(selectedEntry.cifValueUsd)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Customs Levy Assessment */}
          <div className="p-4 rounded-xl bg-slate-950/80 print:bg-slate-50 border border-slate-800 print:border-slate-300 text-xs mb-8">
            <div className="font-bold text-sky-400 print:text-black mb-2 uppercase text-[10px] font-mono">
              Rincian Pungutan Pabean (INSW Billing Gateway):
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <span className="text-[10px] text-slate-500 block">Bea Masuk</span>
                <strong className="text-white print:text-black">{selectedEntry.importDutyRatePercent}%</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">PPN Impor</span>
                <strong className="text-white print:text-black">11%</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">PPh Pasal 22</span>
                <strong className="text-white print:text-black">2.5%</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Total Pungutan Lunas</span>
                <strong className="text-emerald-400 print:text-black font-mono">{formatRupiah(selectedEntry.totalLevyIdr)}</strong>
              </div>
            </div>
          </div>

          {/* Signatures & Stamp */}
          <div className="pt-6 border-t border-slate-800 print:border-black grid grid-cols-2 gap-8 text-center text-xs">
            <div>
              <div className="h-14 border-b border-dashed border-slate-700 print:border-black mb-2" />
              <div className="font-bold text-white print:text-black">Terminal Operations Harbor Master</div>
              <div className="text-[10px] text-slate-400 print:text-slate-600">Pelindo Marine Terminal Command</div>
            </div>
            <div>
              <div className="h-14 border-b border-dashed border-slate-700 print:border-black mb-2 flex items-center justify-center">
                <span className="transform -rotate-12 border-2 border-emerald-500 print:border-black text-emerald-400 print:text-black font-black px-3 py-0.5 rounded text-[11px]">
                  CUSTOMS CLEARED / SPPB
                </span>
              </div>
              <div className="font-bold text-white print:text-black">Pejabat Pemeriksa Bea &amp; Cukai</div>
              <div className="text-[10px] text-slate-400 print:text-slate-600">KPPBC Tipe A Tanjung Priok</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
