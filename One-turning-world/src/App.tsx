import { useEffect } from 'react';
import { Canvas } from './components/Canvas';
import { SolarStepper } from './components/SolarStepper';
import { CityInfo } from './components/CityInfo';
import { useScrollState } from './hooks/useScrollState';

function App() {
  const { scrollState, scrollToCity, isReducedMotion } = useScrollState();

  useEffect(() => {
    // Disable smooth scrolling on body to prevent browser scroll
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <div className="w-full h-screen bg-black flex flex-col overflow-hidden">
      {/* Main canvas - hero of the experience */}
      <Canvas scrollState={scrollState} />

      {/* City information overlay */}
      <CityInfo scrollState={scrollState} />

      {/* Solar navigation stepper */}
      <SolarStepper scrollState={scrollState} onCityClick={scrollToCity} />

      {/* Accessibility: screen reader only navigation */}
      <nav className="sr-only" aria-label="City navigation">
        <ul>
          <li>
            <button onClick={() => scrollToCity(0)}>Tokyo</button>
          </li>
          <li>
            <button onClick={() => scrollToCity(1)}>Cairo</button>
          </li>
          <li>
            <button onClick={() => scrollToCity(2)}>Paris</button>
          </li>
          <li>
            <button onClick={() => scrollToCity(3)}>New York</button>
          </li>
          <li>
            <button onClick={() => scrollToCity(4)}>Ushuaia</button>
          </li>
        </ul>
      </nav>

      {/* Motion preference indicator */}
      {isReducedMotion && (
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Reduced motion is enabled. Animations have been adjusted for your preference.
        </div>
      )}
    </div>
  );
}

export default App;
