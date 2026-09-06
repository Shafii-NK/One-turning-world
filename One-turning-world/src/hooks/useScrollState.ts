import { useState, useEffect, useRef, useCallback } from 'react';
import type { ScrollState } from '../types';
import { calculateScrollState, easeTowardValue } from '../utils';
import { SCROLL_CONFIG } from '../constants';

export function useScrollState() {
  const [scrollState, setScrollState] = useState<ScrollState>({
    progress: 0,
    cityIndex: 0,
    cityProgress: 0,
    scrollPixels: 0,
    direction: 'idle',
  });

  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastScrollYRef = useRef(0);
  const targetScrollStateRef = useRef<ScrollState | null>(null);
  const lastTimestampRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Smooth scroll animation loop
  const animate = useCallback((timestamp: number) => {
    if (lastTimestampRef.current === 0) {
      lastTimestampRef.current = timestamp;
      animationFrameRef.current = requestAnimationFrame(animate);
      return;
    }

    const deltaTime = (timestamp - lastTimestampRef.current) / 1000;
    lastTimestampRef.current = timestamp;

    if (targetScrollStateRef.current) {
      setScrollState((prev) => {
        const target = targetScrollStateRef.current!;
        const dampingFactor = isReducedMotion ? 2 : SCROLL_CONFIG.dampingFactor;

        return {
          ...prev,
          progress: easeTowardValue(prev.progress, target.progress, deltaTime, dampingFactor),
          cityIndex: target.cityIndex,
          cityProgress: easeTowardValue(
            prev.cityProgress,
            target.cityProgress,
            deltaTime,
            dampingFactor
          ),
          scrollPixels: target.scrollPixels,
          direction: target.direction,
        };
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    }
  }, [isReducedMotion]);

  const handleScroll = useCallback((e: WheelEvent) => {
    e.preventDefault();

    const scrollAmount = e.deltaY > 0 ? 100 : -100;
    lastScrollYRef.current = Math.max(0, lastScrollYRef.current + scrollAmount);

    const viewportHeight = window.innerHeight;
    const maxScroll = viewportHeight * 5;
    lastScrollYRef.current = Math.min(lastScrollYRef.current, maxScroll);

    const newState = calculateScrollState(lastScrollYRef.current, viewportHeight);
    targetScrollStateRef.current = {
      ...newState,
      direction: scrollAmount > 0 ? 'forward' : 'backward',
    };

    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', ' '].includes(e.key)) {
      const scrollAmount = ['ArrowDown', 'PageDown'].includes(e.key) ? 100 : -100;
      const spaceMultiplier = e.key === ' ' ? 5 : 1;

      lastScrollYRef.current = Math.max(
        0,
        lastScrollYRef.current + scrollAmount * spaceMultiplier
      );

      const viewportHeight = window.innerHeight;
      const maxScroll = viewportHeight * 5;
      lastScrollYRef.current = Math.min(lastScrollYRef.current, maxScroll);

      const newState = calculateScrollState(lastScrollYRef.current, viewportHeight);
      targetScrollStateRef.current = {
        ...newState,
        direction: scrollAmount > 0 ? 'forward' : 'backward',
      };

      if (!animationFrameRef.current) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }

      e.preventDefault();
    }
  }, [animate]);

  // Scroll to city by index
  const scrollToCity = useCallback((cityIndex: number) => {
    const viewportHeight = window.innerHeight;
    const cityProgress = cityIndex / 5;
    const scrollPixels = cityProgress * viewportHeight * 5;

    lastScrollYRef.current = Math.min(scrollPixels, viewportHeight * 5);

    const newState = calculateScrollState(lastScrollYRef.current, viewportHeight);
    targetScrollStateRef.current = {
      ...newState,
      direction: 'forward',
    };

    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  // Setup listeners
  useEffect(() => {
    window.addEventListener('wheel', handleScroll, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleScroll, handleKeyDown]);

  // Cleanup animation frame
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    scrollState,
    scrollRef,
    scrollToCity,
    isReducedMotion,
  };
}
