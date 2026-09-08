import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { ScrollState } from '../types';
import { latLonToCartesian, easeTowardValue } from '../utils';
import { CITIES, CITY_ARRAY } from '../constants';

interface GlobeProps {
  scrollState: ScrollState;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export function useGlobe({ scrollState, canvasRef }: GlobeProps) {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeRef = useRef<THREE.Group | null>(null);
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const currentRotationRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const markersRef = useRef<THREE.Group | null>(null);
  const atmosphereRef = useRef<THREE.Mesh | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize Three.js scene
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;

    if (width === 0 || height === 0) {
      // Canvas not yet sized, skip for now
      return;
    }

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    setScene(scene);
    scene.background = new THREE.Color(0x000000);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.z = 2.5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      canvas, 
      antialias: true, 
      alpha: false,
      precision: 'highp'
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    // Globe group
    const globe = new THREE.Group();
    globeRef.current = globe;
    scene.add(globe);

    // Earth geometry and materials
    const geometry = new THREE.IcosahedronGeometry(1, 64);

    // Create canvas texture for Earth
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = 4096;
    textureCanvas.height = 2048;
    const ctx = textureCanvas.getContext('2d');
    if (ctx) {
      // Simple realistic Earth texture - blue ocean, brown/green continents
      ctx.fillStyle = '#1a4d7a';
      ctx.fillRect(0, 0, textureCanvas.width, textureCanvas.height);

      // Add some landmass patterns
      ctx.fillStyle = '#2d5a3d';
      // North America
      ctx.fillRect(0, 400, 800, 600);
      // South America
      ctx.fillRect(300, 800, 600, 500);
      // Europe
      ctx.fillRect(1500, 300, 400, 400);
      // Africa
      ctx.fillRect(1500, 600, 600, 800);
      // Asia
      ctx.fillRect(2200, 200, 1200, 800);
      // Australia
      ctx.fillRect(3000, 1000, 400, 400);

      // Add grain
      const imageData = ctx.getImageData(0, 0, textureCanvas.width, textureCanvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const grain = (Math.random() - 0.5) * 20;
        data[i] += grain;
        data[i + 1] += grain;
        data[i + 2] += grain;
      }
      ctx.putImageData(imageData, 0, 0);
    }

    const texture = new THREE.CanvasTexture(textureCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;

    const earthMaterial = new THREE.MeshPhongMaterial({
      map: texture,
      shininess: 5,
      emissive: new THREE.Color(0x0a1a2e),
    });

    const earth = new THREE.Mesh(geometry, earthMaterial);
    globe.add(earth);

    // Atmosphere
    const atmosphereGeometry = new THREE.IcosahedronGeometry(1.02, 64);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x4a9eff,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    atmosphereRef.current = atmosphere;
    globe.add(atmosphere);

    // Glow line (orbital)
    const orbitGeometry = new THREE.BufferGeometry();
    const orbitPoints = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      orbitPoints.push(
        Math.cos(angle) * 1.03,
        0,
        Math.sin(angle) * 1.03
      );
    }
    orbitGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(orbitPoints), 3));
    const orbitMaterial = new THREE.LineBasicMaterial({
      color: 0x4a9eff,
      transparent: true,
      opacity: 0.3,
      linewidth: 1,
    });
    const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
    globe.add(orbitLine);

    // City markers group
    const markers = new THREE.Group();
    markersRef.current = markers;
    globe.add(markers);

    // Add markers for each city
    CITY_ARRAY.forEach((cityKey, index) => {
      const city = CITIES[cityKey];
      const pos = latLonToCartesian(city.latitude, city.longitude, 1.04);

      const markerGeom = new THREE.IcosahedronGeometry(0.08, 16);
      const markerMat = new THREE.MeshStandardMaterial({
        color: index === 0 ? 0xff6b9d : 0x4a9eff,
        emissive: index === 0 ? 0xff6b9d : 0x4a9eff,
        emissiveIntensity: 0.8,
        roughness: 0.3,
        metalness: 0.5,
      });
      const marker = new THREE.Mesh(markerGeom, markerMat);
      marker.position.set(pos.x, pos.y, pos.z);
      marker.userData = { cityIndex: index };
      markers.add(marker);

      // Glow sphere around active marker
      if (index === 0) {
        const glowGeom = new THREE.IcosahedronGeometry(0.15, 16);
        const glowMat = new THREE.MeshStandardMaterial({
          color: 0xff6b9d,
          emissive: 0xff6b9d,
          emissiveIntensity: 0.5,
          transparent: true,
          opacity: 0.2,
          roughness: 0.4,
        });
        const glow = new THREE.Mesh(glowGeom, glowMat);
        glow.position.copy(marker.position);
        glow.userData = { isGlow: true, linkedMarker: marker };
        markers.add(glow);
      }
    });

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      // Update globe rotation with damping
      if (globeRef.current) {
        currentRotationRef.current.x = easeTowardValue(
          currentRotationRef.current.x,
          targetRotationRef.current.x,
          0.016, // ~60fps
          8
        );
        currentRotationRef.current.y = easeTowardValue(
          currentRotationRef.current.y,
          targetRotationRef.current.y,
          0.016,
          8
        );

        globeRef.current.rotation.x = currentRotationRef.current.x;
        globeRef.current.rotation.y = currentRotationRef.current.y;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      const newWidth = canvas.clientWidth;
      const newHeight = canvas.clientHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Mouse controls
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      dragStartRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current && globeRef.current) {
        const deltaX = (e.clientX - dragStartRef.current.x) * 0.005;
        const deltaY = (e.clientY - dragStartRef.current.y) * 0.005;

        targetRotationRef.current.y += deltaX;
        targetRotationRef.current.x += deltaY;

        dragStartRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      geometry.dispose();
      earthMaterial.dispose();
      atmosphereMaterial.dispose();
      orbitMaterial.dispose();
      renderer.dispose();
    };
  }, [canvasRef]);

  // Update globe based on scroll state
  useEffect(() => {
    if (!globeRef.current) return;

    const city = CITIES[CITY_ARRAY[scrollState.cityIndex]];
    const pos = latLonToCartesian(city.latitude, city.longitude, 1);

    // Rotate globe to center on city
    const theta = Math.atan2(pos.z, pos.x);
    const phi = Math.atan2(pos.y, Math.sqrt(pos.x * pos.x + pos.z * pos.z));

    targetRotationRef.current = {
      y: -theta,
      x: -phi,
    };

    // Update marker colors
    if (markersRef.current) {
      markersRef.current.children.forEach((child) => {
        if (child instanceof THREE.Mesh && child.userData.cityIndex !== undefined) {
          const mat = child.material as THREE.MeshStandardMaterial;
          if (child.userData.cityIndex === scrollState.cityIndex) {
            mat.color.setHex(0xff6b9d);
            mat.emissive.setHex(0xff6b9d);
          } else {
            mat.color.setHex(0x4a9eff);
            mat.emissive.setHex(0x4a9eff);
          }
        }
      });

      // Update glow sphere
      markersRef.current.children.forEach((child) => {
        if (child instanceof THREE.Mesh && child.userData.isGlow) {
          const linkedMarker = child.userData.linkedMarker;
          child.position.copy(linkedMarker.position);
        }
      });
    }

    // Update atmosphere color based on city
    if (atmosphereRef.current) {
      const mat = atmosphereRef.current.material as THREE.MeshBasicMaterial;
      switch (scrollState.cityIndex) {
        case 0: // Tokyo - pink
          mat.color.setHex(0xff9dbf);
          break;
        case 1: // Cairo - golden
          mat.color.setHex(0xffa500);
          break;
        case 2: // Paris - bronze
          mat.color.setHex(0xcd7f32);
          break;
        case 3: // New York - coral
          mat.color.setHex(0xff7f50);
          break;
        case 4: // Ushuaia - blue
          mat.color.setHex(0x4a9eff);
          break;
      }
    }
  }, [scrollState.cityIndex]);

  return { sceneRef, scene, cameraRef, rendererRef };
}
