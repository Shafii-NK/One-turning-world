export interface City {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  season: string;
  timeOfDay: string;
  copy: string;
  scrollRange: [number, number]; // [start, end] as percentages 0-1
  pathPosition: number; // position on solar curve 0-1
}

export interface ScrollState {
  progress: number; // 0-1 for entire journey
  cityIndex: number; // 0-4
  cityProgress: number; // 0-1 within current city
  scrollPixels: number;
  direction: 'forward' | 'backward' | 'idle';
}

export interface ChoreographyConfig {
  cityIndex: number;
  progress: number; // 0-1 within the city
  time: number; // delta time
}

export type CityType = 'tokyo' | 'cairo' | 'paris' | 'newyork' | 'ushuaia';
