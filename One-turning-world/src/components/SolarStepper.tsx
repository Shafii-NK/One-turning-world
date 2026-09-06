import React, { useMemo } from 'react';
import type { ScrollState } from '../types';
import { SOLAR_CURVE, CITIES, CITY_ARRAY } from '../constants';
import { bezierPoint } from '../utils';

interface SolarStepperProps {
  scrollState: ScrollState;
  onCityClick: (cityIndex: number) => void;
}

export const SolarStepper: React.FC<SolarStepperProps> = ({ scrollState, onCityClick }) => {
  // Calculate positions on Bézier curve for each city
  const cityPositions = useMemo(() => {
    const { startPoint, controlPoint, endPoint } = SOLAR_CURVE;

    return CITY_ARRAY.map((cityKey) => {
      const city = CITIES[cityKey];
      const pos = bezierPoint(city.pathPosition, startPoint, controlPoint, endPoint);
      return { city, pos, index: city.id };
    });
  }, []);

  // Calculate current sun position
  const activeSunPos = useMemo(() => {
    const { startPoint, controlPoint, endPoint } = SOLAR_CURVE;
    return bezierPoint(scrollState.progress, startPoint, controlPoint, endPoint);
  }, [scrollState.progress]);

  // Calculate travelled path length for glow effect
  const travelledPath = useMemo(() => {
    const progress = scrollState.progress;

    if (progress > 0) {
      // Create a partial path to the current position
      const { startPoint, controlPoint, endPoint } = SOLAR_CURVE;

      // Approximate the arc length up to current progress
      let pathData = `M ${startPoint.x} ${startPoint.y}`;

      // Create segments up to current progress
      for (let i = 0; i <= progress; i += 0.01) {
        const pt = bezierPoint(i, startPoint, controlPoint, endPoint);
        pathData += ` L ${pt.x} ${pt.y}`;
      }

      return pathData;
    }

    return '';
  }, [scrollState.progress]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 px-6 py-8 pointer-events-none">
      {/* Solar curve SVG */}
      <svg
        viewBox={SOLAR_CURVE.viewBox}
        className="w-full max-w-4xl mx-auto h-32 pointer-events-auto"
        style={{ maxHeight: '200px' }}
      >
        {/* Background grid/guide (subtle) */}
        <defs>
          <linearGradient id="sunGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffb347" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ff8c00" stopOpacity="0.4" />
          </linearGradient>

          <filter id="sunGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="activeGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Main Bézier curve path */}
        <path
          d={SOLAR_CURVE.path}
          fill="none"
          stroke="#4a9eff"
          strokeWidth="2"
          opacity="0.3"
        />

        {/* Travelled path with glow */}
        {travelledPath && (
          <path
            d={travelledPath}
            fill="none"
            stroke="#ffb347"
            strokeWidth="3"
            opacity="0.6"
          />
        )}

        {/* City markers */}
        {cityPositions.map(({ city, pos, index }) => (
          <g key={index} onClick={() => onCityClick(index)} style={{ cursor: 'pointer' }}>
            {/* Marker circle */}
            <circle
              cx={pos.x}
              cy={pos.y}
              r={scrollState.cityIndex === index ? 8 : 6}
              fill={scrollState.cityIndex === index ? '#ff6b9d' : '#4a9eff'}
              opacity={scrollState.cityIndex === index ? 1 : 0.6}
              filter={scrollState.cityIndex === index ? 'url(#activeGlow)' : 'url(#sunGlow)'}
              className="transition-all duration-300"
            />

            {/* City label - always visible */}
            <text
              x={pos.x}
              y={pos.y + 20}
              textAnchor="middle"
              fontSize="12"
              fill="#ffffff"
              opacity="0.9"
              fontFamily="Cormorant Garamond, serif"
              className="pointer-events-none"
            >
              {city.name}
            </text>

            {/* Season label - visible when active */}
            {scrollState.cityIndex === index && (
              <text
                x={pos.x}
                y={pos.y - 20}
                textAnchor="middle"
                fontSize="11"
                fill="#ffb347"
                opacity="0.8"
                fontFamily="Cormorant Garamond, serif"
                className="pointer-events-none transition-opacity"
              >
                {city.season}
              </text>
            )}
          </g>
        ))}

        {/* Active sun - moves along the curve */}
        <g>
          {/* Sun rays */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const innerR = 10;
            const outerR = 16;
            const x1 = activeSunPos.x + Math.cos(rad) * innerR;
            const y1 = activeSunPos.y + Math.sin(rad) * innerR;
            const x2 = activeSunPos.x + Math.cos(rad) * outerR;
            const y2 = activeSunPos.y + Math.sin(rad) * outerR;

            return (
              <line
                key={angle}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#ffb347"
                strokeWidth="1.5"
                opacity="0.6"
              />
            );
          })}

          {/* Sun circle */}
          <circle
            cx={activeSunPos.x}
            cy={activeSunPos.y}
            r="10"
            fill="url(#sunGradient)"
            filter="url(#activeGlow)"
            opacity="0.9"
          />

          {/* Sun highlight */}
          <circle
            cx={activeSunPos.x - 3}
            cy={activeSunPos.y - 3}
            r="3"
            fill="#ffffff"
            opacity="0.5"
          />
        </g>

        {/* Progress line at bottom - very subtle */}
        <line
          x1={SOLAR_CURVE.startPoint.x}
          y1={SOLAR_CURVE.endPoint.y + 5}
          x2={SOLAR_CURVE.startPoint.x + (SOLAR_CURVE.endPoint.x - SOLAR_CURVE.startPoint.x) * scrollState.progress}
          y2={SOLAR_CURVE.endPoint.y + 5}
          stroke="#ffb347"
          strokeWidth="1"
          opacity="0.2"
        />
      </svg>
    </div>
  );
};
