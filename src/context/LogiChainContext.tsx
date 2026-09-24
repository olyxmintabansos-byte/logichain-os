"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  CargoVessel,
  ContainerYardAsset,
  PortBerth,
  CustomsEntry,
  ColdChainSensorData,
} from "@/types/logichain";

interface LogiChainContextType {
  vessels: CargoVessel[];
  containers: ContainerYardAsset[];
  berths: PortBerth[];
  customs: CustomsEntry[];
  coldChainSensors: ColdChainSensorData[];
  selectedVessel: CargoVessel | null;
  selectVessel: (vessel: CargoVessel | null) => void;
  updateContainerStatus: (id: string, newStatus: ContainerYardAsset["status"]) => void;
  allocateBerth: (berthId: string, vesselName: string) => void;
  releaseBerth: (berthId: string) => void;
  approveCustomsPIB: (id: string) => void;
  recalibrateReefer: (containerId: string) => void;
  simulateTempExcursion: (containerId: string) => void;
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
    eta: "2026-09-25T18:30:00Z",
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
    name: "MAERSK NUSANTARA",
    imoNumber: "IMO 9778841",
    flag: "Denmark 🇩🇰",
    teuCapacity: 18500,
    currentTeuLoad: 17200,
    dwtTonnage: 195000,
    speedKnots: 16.2,
    headingDegrees: 280,
    originPort: "Shanghai Port (CNSHA)",
    destinationPort: "Port of Singapore (SGSIN)",
    eta: "2026-09-26T12:00:00Z",
    status: "UNDERWAY",
    currentCoordinates: { lat: 1.15, lng: 104.02 },
  },
];

const INITIAL_CONTAINERS: ContainerYardAsset[] = [
  {
    id: "cntr-01",
    containerNumber: "MSKU-741920-4",
    isoCode: "45R1",
    type: "REEFER_COLD_40FT",
    ownerLine: "Maersk Line",
    grossWeightKg: 28400,
    tareWeightKg: 4200,
    bay: "Bay 01",
    row: 2,
    tier: 1,
    status: "IN_YARD",
    temperatureTargetCelsius: -18.0,
    actualTemperatureCelsius: -18.2,
    sealNumber: "SEAL-MK-88912",
    billOfLading: "BL-MAEU-2026-9011",
  },
  {
    id: "cntr-02",
    containerNumber: "EGLV-102948-1",
    isoCode: "22G1",
    type: "DRY_VAN_20FT",
    ownerLine: "Evergreen Marine",
    grossWeightKg: 19500,
    tareWeightKg: 2200,
    bay: "Bay 01",
    row: 2,
    tier: 2,
    status: "IN_YARD",
    sealNumber: "SEAL-EVG-44510",
    billOfLading: "BL-EGLV-2026-3312",
  },
  {
    id: "cntr-03",
    containerNumber: "CMAC-990124-8",
    isoCode: "42T1",
    type: "HAZMAT_TANK",
    ownerLine: "CMA CGM",
    grossWeightKg: 31200,
    tareWeightKg: 4600,
    bay: "Bay 02",
    row: 1,
    tier: 1,
    status: "CUSTOMS_HOLD",
    hazmatClass: "Class 3 (Flammable Liquid - UN 1993)",
    sealNumber: "SEAL-CMA-77124",
    billOfLading: "BL-CMAC-2026-1188",
  },
  {
    id: "cntr-04",
    containerNumber: "ONEY-881290-0",
    isoCode: "45G1",
    type: "DRY_VAN_40FT",
    ownerLine: "ONE Line",
    grossWeightKg: 24600,
    tareWeightKg: 3800,
    bay: "Bay 02",
    row: 3,
    tier: 1,
    status: "RELEASED",
    sealNumber: "SEAL-ONE-66219",
    billOfLading: "BL-ONEY-2026-4401",
  },
  {
    id: "cntr-05",
    containerNumber: "MSKU-331904-2",
    isoCode: "45R1",
    type: "REEFER_COLD_40FT",
    ownerLine: "Maersk Line",
    grossWeightKg: 26800,
    tareWeightKg: 4200,
    bay: "Bay 03",
    row: 2,
    tier: 1,
    status: "IN_YARD",
    temperatureTargetCelsius: 4.0,
    actualTemperatureCelsius: 3.9,
    sealNumber: "SEAL-MK-99120",
    billOfLading: "BL-MAEU-2026-9044",
  },
];

const INITIAL_BERTHS: PortBerth[] = [
  { id: "b-01", name: "Berth JICT-01", terminal: "Jakarta Int'l Container Terminal", maxDraftMeters: 16.5, maxLoaMeters: 400, status: "OCCUPIED", assignedVesselName: "EVER GIVEN ULTRA" },
  { id: "b-02", name: "Berth JICT-02", terminal: "Jakarta Int'l Container Terminal", maxDraftMeters: 16.5, maxLoaMeters: 400, status: "RESERVED", assignedVesselName: "CMA CGM ANTOINE" },
  { id: "b-03", name: "Berth KOJA-01", terminal: "Terminal Petikemas Koja", maxDraftMeters: 14.0, maxLoaMeters: 320, status: "AVAILABLE" },
  { id: "b-04", name: "Berth NPCT-01", terminal: "New Priok Container Terminal 1", maxDraftMeters: 17.0, maxLoaMeters: 420, status: "AVAILABLE" },
];

const INITIAL_CUSTOMS: CustomsEntry[] = [
  {
    id: "cust-01",
    pibNumber: "PIB-008129/WBC.07/2026",
    importerName: "PT Nusantara Semiconductor Corp",
    hsCode: "8542.31.00",
    goodsDescription: "Integrated Circuits / Processors for Enterprise Computing",
    cifValueUsd: 485000,
    importDutyRatePercent: 0,
    vatRatePercent: 11,
    incomeTaxRatePercent: 2.5,
    totalLevyIdr: 1064575000,
    packagesCount: 120,
    grossWeightKg: 4850,
    billOfLadingNumber: "BL-MAEU-2026-9011",
    clearanceChannel: "GREEN_LINE",
    status: "CLEARED",
    submissionDate: "2026-09-24",
  },
  {
    id: "cust-02",
    pibNumber: "PIB-008130/WBC.07/2026",
    importerName: "PT Petrochem Prime Nusantara",
    hsCode: "2902.20.00",
    goodsDescription: "Benzene Industrial Organic Chemical Liquid Bulk",
    cifValueUsd: 124000,
    importDutyRatePercent: 5,
    vatRatePercent: 11,
    incomeTaxRatePercent: 2.5,
    totalLevyIdr: 372620000,
    packagesCount: 1,
    grossWeightKg: 31200,
    billOfLadingNumber: "BL-CMAC-2026-1188",
    clearanceChannel: "RED_LINE",
    status: "INSPECTION",
    submissionDate: "2026-09-24",
  },
  {
    id: "cust-03",
    pibNumber: "PIB-008135/WBC.07/2026",
    importerName: "PT Agro Cold Food Logistics",
    hsCode: "0202.30.00",
    goodsDescription: "Boneless Frozen Bovine Meat (Halal Certified Cut)",
    cifValueUsd: 88000,
    importDutyRatePercent: 5,
    vatRatePercent: 11,
    incomeTaxRatePercent: 2.5,
    totalLevyIdr: 264440000,
    packagesCount: 850,
    grossWeightKg: 28400,
    billOfLadingNumber: "BL-MAEU-2026-9044",
    clearanceChannel: "YELLOW_LINE",
    status: "PENDING_TAX",
    submissionDate: "2026-09-24",
  },
];

const INITIAL_SENSORS: ColdChainSensorData[] = [
  {
    containerId: "cntr-01",
    containerNumber: "MSKU-741920-4",
    productType: "mRNA Biologics & Vaccines",
    targetTempCelsius: -18.0,
    currentTempCelsius: -18.2,
    minThresholdCelsius: -20.0,
    maxThresholdCelsius: -16.0,
    humidityPercent: 42,
    powerStatus: "SHORE_POWER",
    compressorStatus: "NORMAL",
    history: [
      { time: "08:00", temp: -18.0, humidity: 42 },
      { time: "10:00", temp: -18.1, humidity: 41 },
      { time: "12:00", temp: -17.9, humidity: 43 },
      { time: "14:00", temp: -18.2, humidity: 42 },
      { time: "16:00", temp: -18.2, humidity: 42 },
    ],
  },
  {
    containerId: "cntr-05",
    containerNumber: "MSKU-331904-2",
    productType: "Fresh Atlantic Salmon Fillet",
    targetTempCelsius: 4.0,
    currentTempCelsius: 3.9,
    minThresholdCelsius: 2.0,
    maxThresholdCelsius: 6.0,
    humidityPercent: 88,
    powerStatus: "GENSET_ACTIVE",
    compressorStatus: "NORMAL",
    history: [
      { time: "08:00", temp: 3.8, humidity: 86 },
      { time: "10:00", temp: 3.9, humidity: 87 },
      { time: "12:00", temp: 4.1, humidity: 88 },
      { time: "14:00", temp: 4.0, humidity: 88 },
      { time: "16:00", temp: 3.9, humidity: 88 },
    ],
  },
];

const LogiChainContext = createContext<LogiChainContextType | undefined>(undefined);

export function LogiChainProvider({ children }: { children: React.ReactNode }) {
  const [vessels, setVessels] = useState<CargoVessel[]>(INITIAL_VESSELS);
  const [containers, setContainers] = useState<ContainerYardAsset[]>(INITIAL_CONTAINERS);
  const [berths, setBerths] = useState<PortBerth[]>(INITIAL_BERTHS);
  const [customs, setCustoms] = useState<CustomsEntry[]>(INITIAL_CUSTOMS);
  const [coldChainSensors, setColdChainSensors] = useState<ColdChainSensorData[]>(INITIAL_SENSORS);
  const [selectedVessel, setSelectedVessel] = useState<CargoVessel | null>(INITIAL_VESSELS[0]);

  useEffect(() => {
    try {
      const savedVessels = localStorage.getItem("logichain_vessels");
      const savedContainers = localStorage.getItem("logichain_containers");
      const savedCustoms = localStorage.getItem("logichain_customs");
      const savedSensors = localStorage.getItem("logichain_sensors");

      if (savedVessels) setVessels(JSON.parse(savedVessels));
      if (savedContainers) setContainers(JSON.parse(savedContainers));
      if (savedCustoms) setCustoms(JSON.parse(savedCustoms));
      if (savedSensors) setColdChainSensors(JSON.parse(savedSensors));
    } catch {}
  }, []);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#38bdf8", "#0284c7", "#10b981", "#3b82f6"],
      });
    } catch {}
  };

  const selectVessel = (vessel: CargoVessel | null) => {
    setSelectedVessel(vessel);
  };

  const updateContainerStatus = (id: string, newStatus: ContainerYardAsset["status"]) => {
    setContainers((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c));
      try {
        localStorage.setItem("logichain_containers", JSON.stringify(updated));
      } catch {}
      return updated;
    });
    triggerConfetti();
  };

  const allocateBerth = (berthId: string, vesselName: string) => {
    setBerths((prev) =>
      prev.map((b) =>
        b.id === berthId
          ? { ...b, status: "OCCUPIED" as const, assignedVesselName: vesselName }
          : b
      )
    );
    triggerConfetti();
  };

  const releaseBerth = (berthId: string) => {
    setBerths((prev) =>
      prev.map((b) =>
        b.id === berthId
          ? { ...b, status: "AVAILABLE" as const, assignedVesselName: undefined }
          : b
      )
    );
  };

  const approveCustomsPIB = (id: string) => {
    setCustoms((prev) => {
      const updated = prev.map((c) =>
        c.id === id
          ? { ...c, status: "CLEARED" as const, clearanceChannel: "GREEN_LINE" as const }
          : c
      );
      try {
        localStorage.setItem("logichain_customs", JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Also release container in yard if matched B/L
    const targetEntry = customs.find((c) => c.id === id);
    if (targetEntry) {
      setContainers((prev) =>
        prev.map((cntr) =>
          cntr.billOfLading === targetEntry.billOfLadingNumber
            ? { ...cntr, status: "RELEASED" as const }
            : cntr
        )
      );
    }

    triggerConfetti();
  };

  const recalibrateReefer = (containerId: string) => {
    setColdChainSensors((prev) => {
      const updated = prev.map((s) => {
        if (s.containerId === containerId) {
          const normalHistory = [
            ...s.history,
            { time: "18:00", temp: s.targetTempCelsius, humidity: s.humidityPercent },
          ];
          return {
            ...s,
            currentTempCelsius: s.targetTempCelsius,
            compressorStatus: "NORMAL" as const,
            history: normalHistory,
          };
        }
        return s;
      });
      try {
        localStorage.setItem("logichain_sensors", JSON.stringify(updated));
      } catch {}
      return updated;
    });

    triggerConfetti();
  };

  const simulateTempExcursion = (containerId: string) => {
    setColdChainSensors((prev) => {
      const updated = prev.map((s) => {
        if (s.containerId === containerId) {
          const excursionTemp = s.maxThresholdCelsius + 4.5;
          const badHistory = [
            ...s.history,
            { time: "18:00", temp: excursionTemp, humidity: s.humidityPercent + 15 },
          ];
          return {
            ...s,
            currentTempCelsius: excursionTemp,
            compressorStatus: "EXCURSION_ALERT" as const,
            powerStatus: "BATTERY_BACKUP" as const,
            history: badHistory,
          };
        }
        return s;
      });
      try {
        localStorage.setItem("logichain_sensors", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  return (
    <LogiChainContext.Provider
      value={{
        vessels,
        containers,
        berths,
        customs,
        coldChainSensors,
        selectedVessel,
        selectVessel,
        updateContainerStatus,
        allocateBerth,
        releaseBerth,
        approveCustomsPIB,
        recalibrateReefer,
        simulateTempExcursion,
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
