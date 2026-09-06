import React, { useEffect, useState } from 'react';
import type { ScrollState } from '../types';
import { CITIES, CITY_ARRAY } from '../constants';

interface CityInfoProps {
  scrollState: ScrollState;
}

export const CityInfo: React.FC<CityInfoProps> = ({ scrollState }) => {
  const [displayedCity, setDisplayedCity] = useState(CITIES[CITY_ARRAY[0]]);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const currentCity = CITIES[CITY_ARRAY[scrollState.cityIndex]];

    if (currentCity.id !== displayedCity.id) {
      setFadeOut(true);
      const timer = setTimeout(() => {
        setDisplayedCity(currentCity);
        setFadeOut(false);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [scrollState.cityIndex, displayedCity.id]);

  return (
    <div className="fixed bottom-32 left-6 z-20 max-w-xs pointer-events-none">
      <div
        className={`transition-opacity duration-300 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
      >
        {/* City name */}
        <h1
          className="text-5xl md:text-6xl font-light mb-4"
          style={{ fontFamily: 'Cormorant Garamond, serif', letterSpacing: '0.05em' }}
        >
          {displayedCity.name}
        </h1>

        {/* Editorial copy */}
        <p
          className="text-sm md:text-base leading-relaxed text-gray-200"
          style={{ fontFamily: 'Cormorant Garamond, serif', maxWidth: '320px' }}
        >
          {displayedCity.copy}
        </p>
      </div>
    </div>
  );
};
