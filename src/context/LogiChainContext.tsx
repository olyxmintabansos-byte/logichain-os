"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  CargoVessel,
  ContainerYardAsset,
  PortBerth,
  CustomsEntry,
} from "@/types/logichain";

interface LogiChainContextType {
  vessels: CargoVessel[];
  containers: ContainerYardAsset[];
  berths: PortBerth[];
  customs: CustomsEntry[];
  selectedVessel: CargoVessel | null;
  selectVessel: (vessel: CargoVessel | null) => void;
  updateContainerStatus: (id: string, newStatus: ContainerYardAsset["status"]) => void;
  allocateBerth: (berthId: string, vesselName: string) => void;
  releaseBerth: (berthId: string) => void;
  approveCustomsPIB: (id: string) => void;
  triggerConfetti: () => void;
}

const INITIAL_VESSELS: CargoVessel[] = [
  {
    id: "VSL-001",
    name: "CMA CGM ANTOINE",
    imoNumber: "IMO 9722687",
    flag: "France 🇫🇷",
    teuCapacity: 20600,
    currentTeuLoad: 18450,
    dwtTonnage: 217673,
    speedKnots: 19.4,
    headingDegrees: 135,
    originPort: "Port of Singapore (SGP)",
    destinationPort: "Tanjung Priok (JKT)",
    eta: "2026-09-24T18:30:00Z",
    status: "UNDERWAY",
    currentCoordinates: { lat: 0.8, lng: 104.5 },
  },
  {
    id: "VSL-002",
    name: "EVER GIVEN ULTRA",
    imoNumber: "IMO 9811000",
    flag: "Panama 🇵🇦",
    teuCapacity: 20124,
    currentTeuLoad: 19900,
    dwtTonnage: 199629,
    speedKnots: 0.1,
    headingDegrees: 45,
    originPort: "Port Klang (MY)",
    destinationPort: "Tanjung Priok (JKT)",
    eta: "2026-09-24T06:00:00Z",
    status: "BERTHED",
    currentCoordinates: { lat: -6.1, lng: 106.88 },
  },
  {
    id: "VSL-003",
    name: "MAERSK MC-KINNEY MOLLER",
    imoNumber: "IMO 9619907",
    flag: "Denmark 🇩🇰",
    teuCapacity: 18270,
    currentTeuLoad: 15400,
    dwtTonnage: 194849,
    speedKnots: 16.8,
    headingDegrees: 310,
    originPort: "Tanjung Perak (SUB)",
    destinationPort: "Port of Singapore (SGP)",
    eta: "2026-09-25T14:00:00Z",
    status: "UNDERWAY",
    currentCoordinates: { lat: -3.2, lng: 107.8 },
  },
  {
    id: "VSL-004",
    name: "ONE APUS PACIFIC",
    imoNumber: "IMO 9826079",
    flag: "Japan 🇯🇵",
    teuCapacity: 14052,
    currentTeuLoad: 11200,
    dwtTonnage: 139500,
    speedKnots: 0.0,
    headingDegrees: 180,
    originPort: "Kaohsiung (TW)",
    destinationPort: "Tanjung Priok Outer Anchorage",
    eta: "2026-09-24T12:00:00Z",
    status: "ANCHORED",
    currentCoordinates: { lat: -5.92, lng: 106.75 },
  },
  {
    id: "VSL-005",
    name: "HAPAG-LLOYD BERLIN EXPRESS",
    imoNumber: "IMO 9931276",
    flag: "Germany 🇩🇪",
    teuCapacity: 23664,
    currentTeuLoad: 21500,
    dwtTonnage: 229376,
    speedKnots: 21.0,
    headingDegrees: 120,
    originPort: "Rotterdam (NL)",
    destinationPort: "Tanjung Priok (JKT)",
    eta: "2026-09-26T08:00:00Z",
    status: "UNDERWAY",
    currentCoordinates: { lat: 4.8, lng: 98.2 },
  },
];

const INITIAL_CONTAINERS: ContainerYardAsset[] = [
  {
    id: "CNT-001",
    containerNumber: "MSKU-781923-4",
    isoCode: "45G1",
    type: "DRY_VAN_40FT",
    ownerLine: "Maersk Line",
    grossWeightKg: 28400,
    tareWeightKg: 3800,
    bay: "Bay 01",
    row: 2,
    tier: 3,
    status: "IN_YARD",
    sealNumber: "SL-99812-DK",
    billOfLading: "BL-JKT-882193",
  },
  {
    id: "CNT-002",
    containerNumber: "CMAU-612903-8",
    isoCode: "45R1",
    type: "REEFER_COLD_40FT",
    ownerLine: "CMA CGM",
    grossWeightKg: 26200,
    tareWeightKg: 4400,
    bay: "Bay 03",
    row: 1,
    tier: 1,
    status: "IN_YARD",
    temperatureTargetCelsius: -18.0,
    actualTemperatureCelsius: -18.2,
    sealNumber: "SL-FR-55410",
    billOfLading: "BL-SIN-409182",
  },
  {
    id: "CNT-003",
    containerNumber: "EGLV-901248-1",
    isoCode: "22G1",
    type: "DRY_VAN_20FT",
    ownerLine: "Evergreen Marine",
    grossWeightKg: 19800,
    tareWeightKg: 2300,
    bay: "Bay 02",
    row: 4,
    tier: 2,
    status: "CUSTOMS_HOLD",
    sealNumber: "SL-TW-00192",
    billOfLading: "BL-KHH-104928",
  },
  {
    id: "CNT-004",
    containerNumber: "ONEY-338291-0",
    isoCode: "20T6",
    type: "HAZMAT_TANK",
    ownerLine: "Ocean Network Express (ONE)",
    grossWeightKg: 24000,
    tareWeightKg: 3900,
    bay: "Bay 04",
    row: 1,
    tier: 1,
    status: "GATE_IN",
    hazmatClass: "Class 3 - Flammable Liquid",
    sealNumber: "SL-JP-77821",
    billOfLading: "BL-TYO-991204",
  },
  {
    id: "CNT-005",
    containerNumber: "MSKU-102948-2",
    isoCode: "45U1",
    type: "OPEN_TOP",
    ownerLine: "Maersk Line",
    grossWeightKg: 31200,
    tareWeightKg: 4100,
    bay: "Bay 01",
    row: 3,
    tier: 4,
    status: "LOADED_ON_VESSEL",
    sealNumber: "SL-DK-33019",
    billOfLading: "BL-JKT-771920",
  },
];

const INITIAL_BERTHS: PortBerth[] = [
  {
    id: "BRT-01",
    name: "Berth 101 - Deepwater Container Pier",
    terminal: "Jakarta International Container Terminal (JICT 1)",
    maxDraftMeters: 16.5,
    maxLoaMeters: 400,
    status: "OCCUPIED",
    assignedVesselName: "EVER GIVEN ULTRA",
  },
  {
    id: "BRT-02",
    name: "Berth 102 - Super Post-Panamax Quay",
    terminal: "JICT 1",
    maxDraftMeters: 16.0,
    maxLoaMeters: 380,
    status: "RESERVED",
    assignedVesselName: "CMA CGM ANTOINE (Inbound)",
  },
  {
    id: "BRT-03",
    name: "Berth 201 - Terminal Multipurpose Koja",
    terminal: "Koja Terminal",
    maxDraftMeters: 14.5,
    maxLoaMeters: 350,
    status: "AVAILABLE",
  },
  {
    id: "BRT-04",
    name: "Berth 301 - New Priok Container Terminal 1 (NPCT1)",
    terminal: "NPCT1 Kalibaru",
    maxDraftMeters: 17.0,
    maxLoaMeters: 430,
    status: "AVAILABLE",
  },
];

const INITIAL_CUSTOMS: CustomsEntry[] = [
  {
    id: "CST-01",
    pibNumber: "PIB-0089201-2026",
    importerName: "PT Astra Megah Electronics",
    hsCode: "8542.31.00 (Processors & Microcontrollers)",
    cifValueUsd: 1450000,
    importDutyRatePercent: 0,
    vatRatePercent: 11,
    clearanceChannel: "GREEN_LINE",
    status: "CLEARED",
    submissionDate: "2026-09-24T04:15:00Z",
  },
  {
    id: "CST-02",
    pibNumber: "PIB-0089202-2026",
    importerName: "PT Sumber Kimia Mandiri",
    hsCode: "2905.11.00 (Methanol High Purity)",
    cifValueUsd: 480000,
    importDutyRatePercent: 5,
    vatRatePercent: 11,
    clearanceChannel: "RED_LINE",
    status: "INSPECTION",
    submissionDate: "2026-09-24T05:40:00Z",
  },
  {
    id: "CST-03",
    pibNumber: "PIB-0089203-2026",
    importerName: "PT Bogasari Flour Mills Tbk",
    hsCode: "1001.99.12 (Wheat Grain Milling Grade)",
    cifValueUsd: 2150000,
    importDutyRatePercent: 0,
    vatRatePercent: 11,
    clearanceChannel: "YELLOW_LINE",
    status: "PENDING_TAX",
    submissionDate: "2026-09-24T07:10:00Z",
  },
];

const LogiChainContext = createContext<LogiChainContextType | undefined>(undefined);

export function LogiChainProvider({ children }: { children: React.ReactNode }) {
  const [vessels, setVessels] = useState<CargoVessel[]>(INITIAL_VESSELS);
  const [containers, setContainers] = useState<ContainerYardAsset[]>(INITIAL_CONTAINERS);
  const [berths, setBerths] = useState<PortBerth[]>(INITIAL_BERTHS);
  const [customs, setCustoms] = useState<CustomsEntry[]>(INITIAL_CUSTOMS);
  const [selectedVessel, setSelectedVessel] = useState<CargoVessel | null>(INITIAL_VESSELS[0]);

  // Live telemetry pulse: slightly nudge vessel coordinates & speed every 4s
  useEffect(() => {
    const interval = setInterval(() => {
      setVessels((prev) =>
        prev.map((v) => {
          if (v.status !== "UNDERWAY") return v;
          const rad = ((v.headingDegrees - 90) * Math.PI) / 180;
          const deltaLat = Math.sin(rad) * 0.005;
          const deltaLng = Math.cos(rad) * 0.005;
          return {
            ...v,
            currentCoordinates: {
              lat: Number((v.currentCoordinates.lat + deltaLat).toFixed(4)),
              lng: Number((v.currentCoordinates.lng + deltaLng).toFixed(4)),
            },
            speedKnots: Number(
              Math.max(12, Math.min(24, v.speedKnots + (Math.random() - 0.5) * 0.4)).toFixed(1)
            ),
          };
        })
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#38bdf8", "#0284c7", "#10b981", "#3b82f6"],
    });
  };

  const selectVessel = (vessel: CargoVessel | null) => {
    setSelectedVessel(vessel);
  };

  const updateContainerStatus = (id: string, newStatus: ContainerYardAsset["status"]) => {
    setContainers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
    triggerConfetti();
  };

  const allocateBerth = (berthId: string, vesselName: string) => {
    setBerths((prev) =>
      prev.map((b) =>
        b.id === berthId
          ? { ...b, status: "OCCUPIED", assignedVesselName: vesselName }
          : b
      )
    );
    triggerConfetti();
  };

  const releaseBerth = (berthId: string) => {
    setBerths((prev) =>
      prev.map((b) =>
        b.id === berthId
          ? { ...b, status: "AVAILABLE", assignedVesselName: undefined }
          : b
      )
    );
  };

  const approveCustomsPIB = (id: string) => {
    setCustoms((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: "CLEARED", clearanceChannel: "GREEN_LINE" } : c
      )
    );
    triggerConfetti();
  };

  return (
    <LogiChainContext.Provider
      value={{
        vessels,
        containers,
        berths,
        customs,
        selectedVessel,
        selectVessel,
        updateContainerStatus,
        allocateBerth,
        releaseBerth,
        approveCustomsPIB,
        triggerConfetti,
      }}
    >
      {children}
    </LogiChainContext.Provider>
  );
}

export function useLogiChain() {
  const context = useContext(LogiChainContext);
  if (!context) {
    throw new Error("useLogiChain must be used within a LogiChainProvider");
  }
  return context;
}
