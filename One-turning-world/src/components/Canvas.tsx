import React, { useRef, useEffect } from 'react';
import type { ScrollState } from '../types';
import { useGlobe } from '../hooks/useGlobe';
import { useChoreography } from '../hooks/useChoreography';

interface CanvasProps {
  scrollState: ScrollState;
}

export const Canvas: React.FC<CanvasProps> = ({ scrollState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { scene } = useGlobe({ 
    scrollState, 
    canvasRef: canvasRef as React.RefObject<HTMLCanvasElement> 
  });

  // Initialize choreography after scene is created
  useChoreography(scene, scrollState);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        // Canvas automatically handles resize through ResizeObserver in useGlobe
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-screen block"
      style={{
        display: 'block',
        width: '100%',
        height: '100vh',
        margin: 0,
        padding: 0,
        backgroundColor: '#000000',
      }}
    />
  );
};
