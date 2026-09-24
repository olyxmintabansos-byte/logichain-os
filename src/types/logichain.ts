export type VesselStatus = "UNDERWAY" | "ANCHORED" | "BERTHED" | "MOORED" | "MAINTENANCE";

export type ContainerType = "DRY_VAN_20FT" | "DRY_VAN_40FT" | "REEFER_COLD_40FT" | "HAZMAT_TANK" | "OPEN_TOP";

export type ContainerStatus = "IN_YARD" | "GATE_IN" | "LOADED_ON_VESSEL" | "CUSTOMS_HOLD" | "RELEASED";

export interface CargoVessel {
  id: string;
  name: string;
  imoNumber: string;
  flag: string;
  teuCapacity: number;
  currentTeuLoad: number;
  dwtTonnage: number; // Deadweight Tonnage
  speedKnots: number;
  headingDegrees: number;
  originPort: string;
  destinationPort: string;
  eta: string;
  status: VesselStatus;
  currentCoordinates: {
    lat: number;
    lng: number;
  };
}

export interface ContainerYardAsset {
  id: string;
  containerNumber: string; // e.g. MSKU-908124-7
  isoCode: string;
  type: ContainerType;
  ownerLine: string; // e.g. Maersk, Evergreen, CMA CGM, ONE
  grossWeightKg: number;
  tareWeightKg: number;
  bay: string; // e.g. Bay 04
  row: number; // 1 - 6
  tier: number; // 1 - 4
  status: ContainerStatus;
  temperatureTargetCelsius?: number;
  actualTemperatureCelsius?: number;
  hazmatClass?: string;
  sealNumber: string;
  billOfLading: string;
}

export interface PortBerth {
  id: string;
  name: string;
  terminal: string;
  maxDraftMeters: number;
  maxLoaMeters: number;
  status: "AVAILABLE" | "OCCUPIED" | "RESERVED";
  assignedVesselName?: string;
}

export interface CustomsEntry {
  id: string;
  pibNumber: string; // Pemberitahuan Impor Barang
  importerName: string;
  hsCode: string;
  cifValueUsd: number;
  importDutyRatePercent: number;
  vatRatePercent: number;
  clearanceChannel: "GREEN_LINE" | "YELLOW_LINE" | "RED_LINE";
  status: "PENDING_TAX" | "INSPECTION" | "CLEARED";
  submissionDate: string;
}
