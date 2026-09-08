import type { City, CityType } from './types';

export const CITIES: Record<CityType, City> = {
  tokyo: {
    id: 0,
    name: 'Tokyo',
    latitude: 35.6762,
    longitude: 139.6503,
    season: 'Spring',
    timeOfDay: 'Sunrise',
    copy: 'The city exhales in pink light, where tradition rises and tomorrow quietly takes shape.',
    scrollRange: [0, 0.2],
    pathPosition: 0.015,
  },
  cairo: {
    id: 1,
    name: 'Cairo',
    latitude: 30.0444,
    longitude: 31.2357,
    season: 'Summer',
    timeOfDay: 'Rising Daylight',
    copy: 'Light becomes architecture, casting the river, stone and sky in molten gold.',
    scrollRange: [0.2, 0.4],
    pathPosition: 0.25,
  },
  paris: {
    id: 2,
    name: 'Paris',
    latitude: 48.8566,
    longitude: 2.3522,
    season: 'Autumn',
    timeOfDay: 'Solar Zenith',
    copy: 'The afternoon folds into bronze, glass and the slow choreography of fallen leaves.',
    scrollRange: [0.4, 0.6],
    pathPosition: 0.5,
  },
  newyork: {
    id: 3,
    name: 'New York',
    latitude: 40.7128,
    longitude: -74.006,
    season: 'Late Autumn',
    timeOfDay: 'Descending Coral Light',
    copy: 'Steel catches the final coral light as the first snow edits the city into silence.',
    scrollRange: [0.6, 0.8],
    pathPosition: 0.75,
  },
  ushuaia: {
    id: 4,
    name: 'Ushuaia',
    latitude: -54.8019,
    longitude: -68.3030,
    season: 'Deep Winter',
    timeOfDay: 'Sunset',
    copy: 'At the end of the continent, ice, wind and southern light move as one.',
    scrollRange: [0.8, 1.0],
    pathPosition: 0.985,
  },
};

export const CITY_ARRAY: CityType[] = ['tokyo', 'cairo', 'paris', 'newyork', 'ushuaia'];

export const LANDMARK_SPRITES = [
  {
    id: 'giza-pyramids', city: 'cairo', asset: '/sprites/cairo-giza-pyramids.webp',
    entryPoint: [-1.2, -0.2, 0.15], focalPoint: [-0.52, 0.08, 0.7], exitPoint: [1.25, 0.35, 0.05],
    scale: 0.72, direction: 1, orbitSize: 1.18, opacity: 0.96, focalPosition: 0.32,
  },
  {
    id: 'great-sphinx', city: 'cairo', asset: '/sprites/cairo-great-sphinx.webp',
    entryPoint: [1.2, -0.35, 0.2], focalPoint: [0.42, -0.08, 0.72], exitPoint: [-1.15, 0.28, 0.1],
    scale: 0.58, direction: -1, orbitSize: 1.12, opacity: 0.96, focalPosition: 0.7,
  },
  {
    id: 'eiffel-tower', city: 'paris', asset: '/sprites/paris-eiffel-tower.webp',
    entryPoint: [-1.2, -0.1, 0.1], focalPoint: [-0.42, 0.08, 0.72], exitPoint: [1.15, 0.38, 0],
    scale: 0.78, direction: 1, orbitSize: 1.2, opacity: 0.96, focalPosition: 0.3,
  },
  {
    id: 'pont-alexandre-iii', city: 'paris', asset: '/sprites/paris-pont-alexandre-iii.webp',
    entryPoint: [1.18, -0.3, 0.12], focalPoint: [0.38, -0.16, 0.74], exitPoint: [-1.2, 0.32, 0.05],
    scale: 0.62, direction: -1, orbitSize: 1.16, opacity: 0.94, focalPosition: 0.72,
  },
  {
    id: 'empire-state-building', city: 'newyork', asset: '/sprites/new-york-empire-state-building.webp',
    entryPoint: [-1.2, -0.2, 0.08], focalPoint: [-0.48, 0.1, 0.72], exitPoint: [1.2, 0.36, 0.05],
    scale: 0.76, direction: 1, orbitSize: 1.18, opacity: 0.96, focalPosition: 0.28,
  },
  {
    id: 'statue-of-liberty', city: 'newyork', asset: '/sprites/new-york-statue-of-liberty.webp',
    entryPoint: [1.2, -0.35, 0.1], focalPoint: [0.46, 0.02, 0.68], exitPoint: [-1.2, 0.3, 0.05],
    scale: 0.62, direction: -1, orbitSize: 1.14, opacity: 0.95, focalPosition: 0.58,
  },
  {
    id: 'brooklyn-bridge', city: 'newyork', asset: '/sprites/new-york-brooklyn-bridge.webp',
    entryPoint: [-1.15, 0.32, 0.05], focalPoint: [0, -0.18, 0.75], exitPoint: [1.18, -0.25, 0.08],
    scale: 0.68, direction: 1, orbitSize: 1.2, opacity: 0.94, focalPosition: 0.82,
  },
  {
    id: 'les-eclaireurs', city: 'ushuaia', asset: '/sprites/ushuaia-les-eclaireurs.webp',
    entryPoint: [-1.2, -0.18, 0.12], focalPoint: [-0.45, 0.06, 0.72], exitPoint: [1.2, 0.34, 0.04],
    scale: 0.62, direction: 1, orbitSize: 1.16, opacity: 0.96, focalPosition: 0.34,
  },
  {
    id: 'end-of-world-train', city: 'ushuaia', asset: '/sprites/ushuaia-end-of-world-train.webp',
    entryPoint: [1.2, -0.32, 0.1], focalPoint: [0.42, -0.16, 0.7], exitPoint: [-1.18, 0.3, 0.05],
    scale: 0.62, direction: -1, orbitSize: 1.18, opacity: 0.95, focalPosition: 0.68,
  },
] as const;

// Solar curve Bézier path: M 52 106 Q 500 -76 948 106
// ViewBox: 0 0 1000 126
export const SOLAR_CURVE = {
  viewBox: '0 0 1000 126',
  path: 'M 52 106 Q 500 -76 948 106',
  startPoint: { x: 52, y: 106 },
  controlPoint: { x: 500, y: -76 },
  endPoint: { x: 948, y: 106 },
};

// Smooth scroll acceleration based on viewport height
export const SCROLL_CONFIG = {
  dampingFactor: 0.12, // Smooth interpolation (delta-time based)
  minScrollVelocity: 0.01,
  throttleMs: 16, // ~60fps
};

// Responsive breakpoints
export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1280,
  widescreen: 1440,
};

// Typography
export const FONTS = {
  display: 'Cormorant Garamond, serif',
  body: 'system-ui, -apple-system, sans-serif',
};

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
