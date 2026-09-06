import type { ScrollState, City } from './types';
import { CITIES, CITY_ARRAY } from './constants';

/**
 * Calculate point on quadratic Bézier curve
 * B(t) = (1-t)²P₀ + 2(1-t)tP₁ + t²P₂
 */
export function bezierPoint(
  t: number,
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number }
): { x: number; y: number } {
  const mt = 1 - t;
  const x = mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x;
  const y = mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y;
  return { x, y };
}

/**
 * Calculate scroll state based on viewport scroll position
 */
export function calculateScrollState(scrollY: number, viewportHeight: number): ScrollState {
  const totalScrollHeight = viewportHeight * 5; // Approximately 5 viewports worth
  const scrollProgress = Math.min(scrollY / totalScrollHeight, 1);
  const cityIndex = Math.floor(scrollProgress * 5);
  const cityStart = (cityIndex / 5);
  const cityEnd = ((cityIndex + 1) / 5);
  const cityProgress = (scrollProgress - cityStart) / (cityEnd - cityStart);

  return {
    progress: scrollProgress,
    cityIndex: Math.min(cityIndex, 4),
    cityProgress: Math.min(cityProgress, 1),
    scrollPixels: scrollY,
    direction: 'idle',
  };
}

/**
 * Get current city from scroll state
 */
export function getCurrentCity(cityIndex: number): City {
  return CITIES[CITY_ARRAY[Math.min(cityIndex, 4)]];
}

/**
 * Smooth damping using exponential decay (frame-independent)
 * newValue = current + (target - current) * (1 - exp(-dt * dampingFactor))
 */
export function easeTowardValue(
  current: number,
  target: number,
  deltaTime: number,
  dampingFactor: number
): number {
  const easeFactor = 1 - Math.exp(-deltaTime * dampingFactor);
  return current + (target - current) * easeFactor;
}

/**
 * Degrees to radians
 */
export function deg2rad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Radians to degrees
 */
export function rad2deg(radians: number): number {
  return (radians * 180) / Math.PI;
}

/**
 * Convert lat/lon to 3D position on sphere (radius 1)
 */
export function latLonToCartesian(lat: number, lon: number, radius: number = 1) {
  const phi = deg2rad(90 - lat);
  const theta = deg2rad(lon);
  
  return {
    x: radius * Math.sin(phi) * Math.cos(theta),
    y: radius * Math.cos(phi),
    z: radius * Math.sin(phi) * Math.sin(theta),
  };
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Linear interpolation
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Easing functions
 */
export const easings = {
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  easeInOutQuad: (t: number) =>
    t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeOutQuad: (t: number) => t * (2 - t),
};
