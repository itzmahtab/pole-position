import type { TrackId } from "@/components/shared/track-svg";

export interface CircuitInfo {
  trackId: TrackId;
  name: string;
  country: string;
  locality: string;
  corners: number;
  drsZones: number;
  lengthKm: number;
  raceLaps: number;
  lapRecord: string;
  lapRecordDriver: string;
  lapRecordYear: number;
  firstGp: number;
}

// Curated metadata for the 7 available track layouts.
export const CIRCUIT_INFO: Record<TrackId, CircuitInfo> = {
  monaco: {
    trackId: "monaco",
    name: "Circuit de Monaco",
    country: "Monaco",
    locality: "Monte Carlo",
    corners: 19,
    drsZones: 1,
    lengthKm: 3.337,
    raceLaps: 78,
    lapRecord: "1:12.909",
    lapRecordDriver: "Lewis Hamilton",
    lapRecordYear: 2021,
    firstGp: 1950,
  },
  silverstone: {
    trackId: "silverstone",
    name: "Silverstone Circuit",
    country: "United Kingdom",
    locality: "Silverstone",
    corners: 18,
    drsZones: 2,
    lengthKm: 5.891,
    raceLaps: 52,
    lapRecord: "1:27.097",
    lapRecordDriver: "Max Verstappen",
    lapRecordYear: 2020,
    firstGp: 1950,
  },
  suzuka: {
    trackId: "suzuka",
    name: "Suzuka International Racing Course",
    country: "Japan",
    locality: "Suzuka",
    corners: 18,
    drsZones: 2,
    lengthKm: 5.807,
    raceLaps: 53,
    lapRecord: "1:30.983",
    lapRecordDriver: "Lewis Hamilton",
    lapRecordYear: 2019,
    firstGp: 1987,
  },
  spa: {
    trackId: "spa",
    name: "Circuit de Spa-Francorchamps",
    country: "Belgium",
    locality: "Spa",
    corners: 19,
    drsZones: 2,
    lengthKm: 7.004,
    raceLaps: 44,
    lapRecord: "1:46.286",
    lapRecordDriver: "Valtteri Bottas",
    lapRecordYear: 2018,
    firstGp: 1950,
  },
  monza: {
    trackId: "monza",
    name: "Autodromo Nazionale Monza",
    country: "Italy",
    locality: "Monza",
    corners: 11,
    drsZones: 2,
    lengthKm: 5.793,
    raceLaps: 53,
    lapRecord: "1:21.046",
    lapRecordDriver: "Rubens Barrichello",
    lapRecordYear: 2004,
    firstGp: 1950,
  },
  bahrain: {
    trackId: "bahrain",
    name: "Bahrain International Circuit",
    country: "Bahrain",
    locality: "Sakhir",
    corners: 15,
    drsZones: 3,
    lengthKm: 5.412,
    raceLaps: 57,
    lapRecord: "1:31.447",
    lapRecordDriver: "Pedro de la Rosa",
    lapRecordYear: 2005,
    firstGp: 2004,
  },
  generic: {
    trackId: "generic",
    name: "Grand Prix Circuit",
    country: "",
    locality: "",
    corners: 14,
    drsZones: 2,
    lengthKm: 5.4,
    raceLaps: 57,
    lapRecord: "—",
    lapRecordDriver: "",
    lapRecordYear: 0,
    firstGp: 1950,
  },
};
