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
  dwtTonnage: number;
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
  containerNumber: string;
  isoCode: string;
  type: ContainerType;
  ownerLine: string;
  grossWeightKg: number;
  tareWeightKg: number;
  bay: string;
  row: number;
  tier: number;
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
  goodsDescription: string;
  cifValueUsd: number;
  importDutyRatePercent: number;
  vatRatePercent: number;
  incomeTaxRatePercent: number; // PPh 22
  totalLevyIdr: number;
  packagesCount: number;
  grossWeightKg: number;
  billOfLadingNumber: string;
  clearanceChannel: "GREEN_LINE" | "YELLOW_LINE" | "RED_LINE";
  status: "PENDING_TAX" | "INSPECTION" | "CLEARED";
  submissionDate: string;
}

export interface SensorTelemetryPoint {
  time: string;
  temp: number;
  humidity: number;
}

export interface ColdChainSensorData {
  containerId: string;
  containerNumber: string;
  productType: string;
  targetTempCelsius: number;
  currentTempCelsius: number;
  minThresholdCelsius: number;
  maxThresholdCelsius: number;
  humidityPercent: number;
  powerStatus: "SHORE_POWER" | "GENSET_ACTIVE" | "BATTERY_BACKUP";
  compressorStatus: "NORMAL" | "DEFROSTING" | "EXCURSION_ALERT";
  history: SensorTelemetryPoint[];
}
