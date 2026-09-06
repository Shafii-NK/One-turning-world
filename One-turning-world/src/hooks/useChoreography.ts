import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { ScrollState } from '../types';

interface ChoreographyScene {
  tokyo: THREE.Group;
  cairo: THREE.Group;
  paris: THREE.Group;
  newyork: THREE.Group;
  ushuaia: THREE.Group;
}

type ObjectRotationMap = Map<THREE.Object3D, { x: number; y: number; z: number }>;

export function useChoreography(
  scene: THREE.Scene | null,
  scrollState: ScrollState
) {
  const choreographyRef = useRef<ChoreographyScene | null>(null);
  const objectsRotationRef = useRef<ObjectRotationMap>(new Map());

  useEffect(() => {
    if (!scene) return;

    if (!choreographyRef.current) {
      choreographyRef.current = {
        tokyo: new THREE.Group(),
        cairo: new THREE.Group(),
        paris: new THREE.Group(),
        newyork: new THREE.Group(),
        ushuaia: new THREE.Group(),
      };

      // Initialize Tokyo - Sakura and abstract elements
      createTokyoChoreography(choreographyRef.current.tokyo, objectsRotationRef.current);
      scene.add(choreographyRef.current.tokyo);

      // Initialize Cairo - Glass and brass elements
      createCairoChoreography(choreographyRef.current.cairo, objectsRotationRef.current);
      scene.add(choreographyRef.current.cairo);

      // Initialize Paris - Lattice and glass
      createParisChoreography(choreographyRef.current.paris, objectsRotationRef.current);
      scene.add(choreographyRef.current.paris);

      // Initialize New York - Art Deco and architectural
      createNewYorkChoreography(choreographyRef.current.newyork, objectsRotationRef.current);
      scene.add(choreographyRef.current.newyork);

      // Initialize Ushuaia - Aurora and ice
      createUshuaiaChoreography(choreographyRef.current.ushuaia, objectsRotationRef.current);
      scene.add(choreographyRef.current.ushuaia);
    }

    // Hide all choreography groups initially
    Object.values(choreographyRef.current).forEach((group) => {
      group.visible = false;
    });

    // Show only current city's choreography
    const cityChoreography = Object.values(choreographyRef.current)[scrollState.cityIndex];
    if (cityChoreography) {
      cityChoreography.visible = true;

      // Update positions based on city progress (0-1)
      updateChoreographyPositions(
        cityChoreography,
        scrollState.cityProgress,
        objectsRotationRef.current
      );
    }
  }, [scene, scrollState.cityIndex, scrollState.cityProgress]);

  return choreographyRef;
}

function createTokyoChoreography(group: THREE.Group, rotationMap: ObjectRotationMap) {
  // Sakura petals
  const petalCount = 30;
  for (let i = 0; i < petalCount; i++) {
    const petal = new THREE.Mesh(
      new THREE.BufferGeometry().setAttribute(
        'position',
        new THREE.BufferAttribute(
          new Float32Array([
            -0.1, 0, 0,
            0.1, 0, 0,
            0, 0.15, 0,
            -0.05, -0.08, 0,
            0.05, -0.08, 0,
          ]),
          3
        )
      ),
      new THREE.MeshBasicMaterial({ color: 0xff9dbf, transparent: true, opacity: 0.6 })
    );

    const angle = (i / petalCount) * Math.PI * 2;
    const radius = 0.8 + Math.random() * 0.5;
    petal.position.set(
      Math.cos(angle) * radius,
      -0.5 + Math.random() * 1,
      Math.sin(angle) * radius
    );
    petal.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

    group.add(petal);
    rotationMap.set(petal, { x: 0, y: 0, z: 0.3 });
  }

  // Abstract torii gates
  for (let i = 0; i < 3; i++) {
    const toriGroup = new THREE.Group();
    const angle = (i / 3) * Math.PI * 2;
    const radius = 1.2;

    toriGroup.position.set(Math.cos(angle) * radius, 0.2, Math.sin(angle) * radius);

    // Vertical posts
    const postGeom = new THREE.BoxGeometry(0.05, 0.3, 0.05);
    const postMat = new THREE.MeshBasicMaterial({ color: 0xff6b6b });
    const post1 = new THREE.Mesh(postGeom, postMat);
    post1.position.x = -0.15;
    toriGroup.add(post1);

    const post2 = new THREE.Mesh(postGeom, postMat);
    post2.position.x = 0.15;
    toriGroup.add(post2);

    group.add(toriGroup);
  }

  // Chrome ribbons
  for (let i = 0; i < 5; i++) {
    const ribbonGeom = new THREE.PlaneGeometry(0.3, 0.8);
    const ribbonMat = new THREE.MeshBasicMaterial({
      color: 0xcccccc,
      transparent: true,
      opacity: 0.4,
      wireframe: false,
    });
    const ribbon = new THREE.Mesh(ribbonGeom, ribbonMat);

    const angle = (i / 5) * Math.PI * 2;
    ribbon.position.set(Math.cos(angle) * 0.6, 0, Math.sin(angle) * 0.6);
    ribbon.rotation.y = angle;

    group.add(ribbon);
    rotationMap.set(ribbon, { x: 0.1, y: 0.05, z: 0 });
  }
}

function createCairoChoreography(group: THREE.Group, rotationMap: ObjectRotationMap) {
  // Glass bubbles
  const bubbleCount = 15;
  for (let i = 0; i < bubbleCount; i++) {
    const bubbleGeom = new THREE.IcosahedronGeometry(0.1 + Math.random() * 0.08, 16);
    const bubbleMat = new THREE.MeshBasicMaterial({
      color: 0xffd700,
      transparent: true,
      opacity: 0.2,
      wireframe: true,
    });
    const bubble = new THREE.Mesh(bubbleGeom, bubbleMat);

    const angle = Math.random() * Math.PI * 2;
    const radius = 0.7 + Math.random() * 0.5;
    bubble.position.set(
      Math.cos(angle) * radius,
      -0.3 + Math.random() * 0.6,
      Math.sin(angle) * radius
    );

    group.add(bubble);
    rotationMap.set(bubble, {
      x: Math.random() * 0.02,
      y: Math.random() * 0.02,
      z: Math.random() * 0.02,
    });
  }

  // Minaret-like forms (brass cones)
  for (let i = 0; i < 3; i++) {
    const minaretGeom = new THREE.ConeGeometry(0.1, 0.4, 16);
    const minaretMat = new THREE.MeshBasicMaterial({ color: 0xcd7f32, wireframe: true });
    const minaret = new THREE.Mesh(minaretGeom, minaretMat);

    const angle = (i / 3) * Math.PI * 2;
    minaret.position.set(Math.cos(angle) * 1.0, 0.3, Math.sin(angle) * 1.0);
    minaret.rotation.x = Math.PI * 0.2;

    group.add(minaret);
    rotationMap.set(minaret, { x: 0, y: 0.08, z: 0 });
  }

  // Warm stone facets
  for (let i = 0; i < 8; i++) {
    const facetGeom = new THREE.TetrahedronGeometry(0.15);
    const facetMat = new THREE.MeshBasicMaterial({
      color: 0xc9a961,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });
    const facet = new THREE.Mesh(facetGeom, facetMat);

    const angle = (i / 8) * Math.PI * 2;
    facet.position.set(Math.cos(angle) * 0.8, 0, Math.sin(angle) * 0.8);

    group.add(facet);
  }
}

function createParisChoreography(group: THREE.Group, rotationMap: ObjectRotationMap) {
  // Iron lattice ribbons
  const ribbonCount = 4;
  for (let i = 0; i < ribbonCount; i++) {
    const ribbonGeom = new THREE.PlaneGeometry(1.2, 0.2);
    const ribbonMat = new THREE.MeshBasicMaterial({
      color: 0x4a3c30,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });
    const ribbon = new THREE.Mesh(ribbonGeom, ribbonMat);

    const angle = (i / ribbonCount) * Math.PI * 2;
    ribbon.position.z = Math.sin(angle) * 0.5;
    ribbon.rotation.x = angle;
    ribbon.rotation.y = Math.PI * 0.25;

    group.add(ribbon);
    rotationMap.set(ribbon, { x: 0.02, y: 0, z: 0.05 });
  }

  // Abstract glass pyramid (Louvre)
  const pyramidGeom = new THREE.TetrahedronGeometry(0.4);
  const pyramidMat = new THREE.MeshBasicMaterial({
    color: 0x87ceeb,
    wireframe: true,
    transparent: true,
    opacity: 0.4,
  });
  const pyramid = new THREE.Mesh(pyramidGeom, pyramidMat);
  pyramid.position.y = 0.1;
  group.add(pyramid);
  rotationMap.set(pyramid, { x: 0.02, y: 0.03, z: 0 });

  // Autumn leaves (billboard-like geometry)
  const leafCount = 20;
  for (let i = 0; i < leafCount; i++) {
    const leafGeom = new THREE.PlaneGeometry(0.08, 0.1);
    const leafMat = new THREE.MeshBasicMaterial({
      color: 0xcd6b30,
      transparent: true,
      opacity: 0.4,
    });
    const leaf = new THREE.Mesh(leafGeom, leafMat);

    const angle = (i / leafCount) * Math.PI * 2;
    const radius = 0.6 + Math.random() * 0.4;
    leaf.position.set(
      Math.cos(angle) * radius,
      -0.2 + Math.random() * 0.4,
      Math.sin(angle) * radius
    );
    leaf.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

    group.add(leaf);
    rotationMap.set(leaf, { x: 0.05, y: 0.03, z: 0.02 });
  }
}

function createNewYorkChoreography(group: THREE.Group, rotationMap: ObjectRotationMap) {
  // Art Deco fans
  for (let i = 0; i < 3; i++) {
    const fanGroup = new THREE.Group();
    const angle = (i / 3) * Math.PI * 2;
    fanGroup.position.set(Math.cos(angle) * 0.9, 0, Math.sin(angle) * 0.9);

    for (let j = 0; j < 8; j++) {
      const sliceGeom = new THREE.PlaneGeometry(0.3, 0.2);
      const sliceMat = new THREE.MeshBasicMaterial({
        color: 0xffa500,
        wireframe: true,
        transparent: true,
        opacity: 0.5,
      });
      const slice = new THREE.Mesh(sliceGeom, sliceMat);
      slice.rotation.z = (j / 8) * Math.PI * 0.5;
      fanGroup.add(slice);
    }

    group.add(fanGroup);
    rotationMap.set(fanGroup, { x: 0, y: 0.06, z: 0.02 });
  }

  // Architectural lights (lines)
  for (let i = 0; i < 12; i++) {
    const lineGeom = new THREE.BufferGeometry().setAttribute(
      'position',
      new THREE.BufferAttribute(
        new Float32Array([
          0, -0.2, 0,
          0, 0.3, 0,
        ]),
        3
      )
    );
    const lineMat = new THREE.LineBasicMaterial({ color: 0xff6347, linewidth: 2 });
    const line = new THREE.Line(lineGeom, lineMat);

    const angle = (i / 12) * Math.PI * 2;
    const radius = 0.7;
    line.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);

    group.add(line);
  }

  // Geometric snow (simple planes)
  const snowCount = 25;
  for (let i = 0; i < snowCount; i++) {
    const snowGeom = new THREE.PlaneGeometry(0.05, 0.05);
    const snowMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3,
    });
    const snow = new THREE.Mesh(snowGeom, snowMat);

    snow.position.set(
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2
    );

    group.add(snow);
    rotationMap.set(snow, { x: 0.01, y: 0.01, z: 0.01 });
  }
}

function createUshuaiaChoreography(group: THREE.Group, rotationMap: ObjectRotationMap) {
  // Aurora ribbons
  const ribbonCount = 4;
  for (let i = 0; i < ribbonCount; i++) {
    const ribbonGeom = new THREE.PlaneGeometry(2, 0.3);
    const ribbonMat = new THREE.MeshBasicMaterial({
      color: 0x00ff7f,
      transparent: true,
      opacity: 0.3,
      wireframe: true,
    });
    const ribbon = new THREE.Mesh(ribbonGeom, ribbonMat);

    ribbon.position.y = -0.2 + (i / ribbonCount) * 0.6;
    ribbon.rotation.x = Math.PI * 0.1;

    group.add(ribbon);
    rotationMap.set(ribbon, { x: 0.01, y: 0.04, z: 0 });
  }

  // Glacial prisms
  const prismCount = 12;
  for (let i = 0; i < prismCount; i++) {
    const prismGeom = new THREE.IcosahedronGeometry(0.12 + Math.random() * 0.08, 8);
    const prismMat = new THREE.MeshBasicMaterial({
      color: 0x87ceeb,
      transparent: true,
      opacity: 0.2,
      wireframe: true,
    });
    const prism = new THREE.Mesh(prismGeom, prismMat);

    const angle = (i / prismCount) * Math.PI * 2;
    const radius = 0.8;
    prism.position.set(
      Math.cos(angle) * radius,
      -0.3 + Math.random() * 0.2,
      Math.sin(angle) * radius
    );

    group.add(prism);
    rotationMap.set(prism, {
      x: Math.random() * 0.02,
      y: Math.random() * 0.02,
      z: Math.random() * 0.02,
    });
  }

  // Dark pebbles
  for (let i = 0; i < 20; i++) {
    const pebbleGeom = new THREE.DodecahedronGeometry(0.08);
    const pebbleMat = new THREE.MeshBasicMaterial({
      color: 0x2a2a2a,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const pebble = new THREE.Mesh(pebbleGeom, pebbleMat);

    pebble.position.set(
      (Math.random() - 0.5) * 1.6,
      -0.4 + Math.random() * 0.3,
      (Math.random() - 0.5) * 1.6
    );

    group.add(pebble);
  }
}

function updateChoreographyPositions(
  group: THREE.Group,
  progress: number,
  objectsRotation: Map<THREE.Object3D, { x: number; y: number; z: number }>
) {
  group.children.forEach((child) => {
    if (child instanceof THREE.Mesh || child instanceof THREE.Group) {
      // Subtle scale and position based on progress
      const scale = 0.8 + progress * 0.4;
      child.scale.set(scale, scale, scale);

      // Rotation updates
      const rotVelocity = objectsRotation.get(child);
      if (rotVelocity) {
        child.rotation.x += rotVelocity.x * 0.016;
        child.rotation.y += rotVelocity.y * 0.016;
        child.rotation.z += rotVelocity.z * 0.016;
      }

      // Gentle vertical float
      if (child.userData && child.userData.originalY === undefined) {
        child.userData.originalY = child.position.y;
      }
      child.position.y = (child.userData?.originalY || 0) + Math.sin(progress * Math.PI) * 0.2;
    }
  });
}
