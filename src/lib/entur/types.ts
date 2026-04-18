export type PlaceSearchResult = {
  id: string;
  name: string;
  label: string;
  category?: string;
  layer?: string;
  lat?: number;
  lon?: number;
};

export type Departure = {
  id: string;
  destination: string;
  aimedDepartureTime?: string;
  expectedDepartureTime?: string;
  lineId?: string;
  linePublicCode?: string;
  transportMode?: string;
  quayPublicCode?: string;
  realtime: boolean;
  cancelled: boolean;
};