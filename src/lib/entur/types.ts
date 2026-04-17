export type PlaceSearchResult = {
  id: string;
  name: string;
  label: string;
  category?: string;
  layer?: string;
  lat?: number;
  lon?: number;
};