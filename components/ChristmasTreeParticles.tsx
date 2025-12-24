
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TreeMorphState, ParticleData } from '../types';

interface ChristmasTreeParticlesProps {
  morphState: TreeMorphState;
}

const ChristmasTreeParticles: React.FC<ChristmasTreeParticlesProps> = ({ morphState }) => {
  const needleCount = 3500;
  const ornamentCount = 50; 
  const lightCount = 120;
  const giftBoxCount = 18;
  const gemCount = 35;
  const starCount = 12; 
  const goldDustCount = 1000;
  const spiralParticleCount = 450;

  const tempObject = new THREE.Object3D();
  const morphProgressRef = useRef(0);
  
  const needleRef = useRef<THREE.InstancedMesh>(null);
  const ornamentRef = useRef<THREE.InstancedMesh>(null);
  const lightRef = useRef<THREE.InstancedMesh>(null);
  const giftRef = useRef<THREE.InstancedMesh>(null);
  const gemRef = useRef<THREE.InstancedMesh>(null);
  const starRef = useRef<THREE.InstancedMesh>(null);
  const goldDustRef = useRef<THREE.InstancedMesh>(null);
  const spiralRef = useRef<THREE.InstancedMesh>(null);

  // Georgia-style Serif "S" Shape
  const sShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0.85, 1.25);
    shape.bezierCurveTo(0.85, 1.65, 0.45, 1.75, 0.1, 1.75);
    shape.bezierCurveTo(-0.65, 1.75, -0.85, 1.25, -0.85, 0.85);
    shape.bezierCurveTo(-0.85, 0.45, -0.3, 0.25, 0.2, 0.1);
    shape.bezierCurveTo(0.7, -0.1, 0.8, -0.65, 0.8, -1.0);
    shape.bezierCurveTo(0.8, -1.5, 0.5, -1.75, -0.1, -1.75);
    shape.bezierCurveTo(-0.8, -1.75, -1.0, -1.3, -1.0, -0.85);
    shape.lineTo(-0.65, -0.85); 
    shape.bezierCurveTo(-0.65, -1.3, -0.3, -1.45, 0, -1.45);
    shape.bezierCurveTo(0.45, -1.45, 0.45, -1.05, 0.45, -0.85);
    shape.bezierCurveTo(0.45, -0.45, 0.1, -0.25, -0.4, -0.05);
    shape.bezierCurveTo(-0.85, 0.2, -1.15, 0.65, -1.15, 1.0);
    shape.bezierCurveTo(-1.15, 1.5, -0.65, 1.6, -0.15, 1.6);
    shape.bezierCurveTo(0.3, 1.6, 0.6, 1.45, 0.6, 1.15);
    shape.lineTo(0.85, 1.15);
    shape.closePath();
    return shape;
  }, []);

  const heptagramShape = useMemo(() => {
    const shape = new THREE.Shape();
    const points = 7;
    const outerRadius = 1;
    const innerRadius = 0.45;
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / points;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    return shape;
  }, []);

  const data = useMemo(() => {
    const height = 6.5;
    const baseRadius = 2.8;

    const generateParticleData = (count: number, scatterRadius: number, colorArr: string[], heightBias: number = 1.0, limitHeight: number = 1.0) => {
      const particles: ParticleData[] = [];
      for (let i = 0; i < count; i++) {
        const t = Math.pow(Math.random(), heightBias) * limitHeight;
        const y = t * height - height / 2;
        const radius = baseRadius * (1 - t);
        const angle = Math.random() * Math.PI * 2;
        const sRadius = scatterRadius + Math.random() * (scatterRadius * 0.5);
        const sTheta = Math.random() * Math.PI * 2;
        const sPhi = Math.acos(2 * Math.random() - 1);
        particles.push({
          id: i,
          treePos: [Math.cos(angle) * radius, y, Math.sin(angle) * radius],
          scatterPos: [sRadius * Math.sin(sPhi) * Math.cos(sTheta), sRadius * Math.sin(sPhi) * Math.sin(sTheta), sRadius * Math.cos(sPhi)],
          treeRot: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
          scatterRot: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
          scale: 0.1,
          color: colorArr[i % colorArr.length]
        });
      }
      return particles;
    };

    const needles = generateParticleData(needleCount, 12, ['#013220'], 0.65, 1.0);
    needles.forEach((n, i) => {
      const t = Math.pow(i / needleCount, 0.65);
      const angle = t * height * 14 + (Math.random() * 0.8);
      n.treeRot = [Math.PI / 2, angle, 0];
      n.scale = 0.08 + Math.random() * 0.12;
    });

    // Ornaments Palette: Velvet Red, Velvet Green, Velvet Pale Yellow
    const ornaments = generateParticleData(ornamentCount, 15, ['#8B0000', '#014421', '#FDF5E6'], 1.4, 0.75);
    ornaments.forEach(o => o.scale = 0.12 + Math.random() * 0.12);

    const gifts = generateParticleData(giftBoxCount, 18, ['#8B0000', '#550000', '#A52A2A'], 1.0, 0.4);
    gifts.forEach(g => {
      g.scale = 0.15 + Math.random() * 0.5;
      g.treeRot = [0, Math.random() * Math.PI, 0];
    });

    const gems = generateParticleData(gemCount, 16, ['#00FF88', '#00A050'], 1.0, 0.8);
    gems.forEach(g => g.scale = 0.08 + Math.random() * 0.12);

    const stars = generateParticleData(starCount, 20, ['#FFD700'], 1.2, 0.9);
    stars.forEach(s => s.scale = 0.25);

    const goldDust = generateParticleData(goldDustCount, 14, ['#FFD700', '#FFF7CC'], 0.9, 1.0);
    goldDust.forEach(d => d.scale = 0.02 + Math.random() * 0.04);

    const spirals: ParticleData[] = [];
    for (let i = 0; i < spiralParticleCount; i++) {
      const side = i % 2 === 0 ? 0 : 1;
      const t = (i / spiralParticleCount);
      const y = t * height - height / 2;
      const radius = baseRadius * (1 - t) * 1.02;
      const angle = t * Math.PI * 10 + (side * Math.PI);
      spirals.push({
        id: i,
        treePos: [Math.cos(angle) * radius, y, Math.sin(angle) * radius],
        scatterPos: [(Math.random() - 0.5) * 25, (Math.random() - 0.5) * 25, (Math.random() - 0.5) * 25],
        treeRot: [0, angle, 0],
        scatterRot: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        scale: 0.03 + Math.random() * 0.03,
        color: '#8B0000'
      });
    }

    const lights = generateParticleData(lightCount, 15, ['#FFF4D1'], 1.0, 1.0);
    lights.forEach(l => l.scale = 0.05);

    return { needles, ornaments, gifts, gems, stars, goldDust, spirals, lights };
  }, []);

  useFrame((state, delta) => {
    const target = morphState === TreeMorphState.TREE_SHAPE ? 1 : 0;
    morphProgressRef.current = THREE.MathUtils.lerp(morphProgressRef.current, target, delta * 1.8);

    const updateInstances = (ref: React.RefObject<THREE.InstancedMesh>, items: ParticleData[], scaleMult: number = 1, zScale: number = 1, isDust: boolean = false) => {
      if (!ref.current) return;
      items.forEach((p, i) => {
        let x = THREE.MathUtils.lerp(p.scatterPos[0], p.treePos[0], morphProgressRef.current);
        let y = THREE.MathUtils.lerp(p.scatterPos[1], p.treePos[1], morphProgressRef.current);
        let z = THREE.MathUtils.lerp(p.scatterPos[2], p.treePos[2], morphProgressRef.current);
        
        const rx = THREE.MathUtils.lerp(p.scatterRot[0], p.treeRot[0], morphProgressRef.current);
        const ry = THREE.MathUtils.lerp(p.scatterRot[1], p.treeRot[1], morphProgressRef.current);
        const rz = THREE.MathUtils.lerp(p.scatterRot[2], p.treeRot[2], morphProgressRef.current);

        if (morphProgressRef.current < 0.9 && !isDust) {
          const spin = state.clock.elapsedTime * 0.2 * (1 - morphProgressRef.current);
          const ox = x;
          const oz = z;
          x = ox * Math.cos(spin) - oz * Math.sin(spin);
          z = ox * Math.sin(spin) + oz * Math.cos(spin);
        }

        const scale = THREE.MathUtils.lerp(0.001, p.scale * scaleMult, Math.min(1, morphProgressRef.current * 2));

        tempObject.position.set(x, y, z);
        tempObject.rotation.set(rx, ry, rz);
        tempObject.scale.set(scale, scale, scale * zScale);
        tempObject.updateMatrix();
        ref.current!.setMatrixAt(i, tempObject.matrix);
        
        if (ref.current?.instanceColor) {
          ref.current.setColorAt(i, new THREE.Color(p.color));
        }
      });
      ref.current.instanceMatrix.needsUpdate = true;
      if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
    };

    updateInstances(needleRef, data.needles, 1, 4);
    updateInstances(ornamentRef, data.ornaments, 1, 1);
    updateInstances(giftRef, data.gifts, 1, 1);
    updateInstances(gemRef, data.gems, 1, 1.5);
    updateInstances(starRef, data.stars, 1, 0.2);
    updateInstances(goldDustRef, data.goldDust, 1, 1, true);
    updateInstances(spiralRef, data.spirals, 1, 1);

    if (lightRef.current) {
      data.lights.forEach((p, i) => {
        const x = THREE.MathUtils.lerp(p.scatterPos[0], p.treePos[0], morphProgressRef.current);
        const y = THREE.MathUtils.lerp(p.scatterPos[1], p.treePos[1], morphProgressRef.current);
        const z = THREE.MathUtils.lerp(p.scatterPos[2], p.treePos[2], morphProgressRef.current);
        const flicker = 1 + Math.sin(state.clock.elapsedTime * 5 + i) * 0.5;
        const scale = THREE.MathUtils.lerp(0, p.scale * flicker, morphProgressRef.current);
        tempObject.position.set(x, y, z);
        tempObject.scale.setScalar(scale);
        tempObject.updateMatrix();
        lightRef.current!.setMatrixAt(i, tempObject.matrix);
      });
      lightRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Needles */}
      <instancedMesh ref={needleRef} args={[null as any, null as any, needleCount]}>
        <coneGeometry args={[0.08, 1, 4]} />
        <meshPhysicalMaterial 
          color="#013220" 
          roughness={0.25} 
          metalness={0.7} 
          emissive="#000803" 
          clearcoat={0.3}
        />
      </instancedMesh>

      {/* Ornaments - FLOCKED VELVET MATERIAL (Matte, Sheen, Non-Reflective) */}
      <instancedMesh ref={ornamentRef} args={[null as any, null as any, ornamentCount]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhysicalMaterial 
          roughness={0.9} 
          metalness={0.0} 
          clearcoat={0.0}
          reflectivity={0.05}
          sheen={1.0}
          sheenColor="#ffffff"
          sheenRoughness={0.8}
          transmission={0}
        />
      </instancedMesh>

      {/* Gems */}
      <instancedMesh ref={gemRef} args={[null as any, null as any, gemCount]}>
        <octahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial 
          color="#00FF88" 
          roughness={0.1} 
          transmission={0.4} 
          thickness={1}
          metalness={0.2}
          emissive="#004422"
          emissiveIntensity={1.2}
        />
      </instancedMesh>

      {/* Stars - Satin Gold */}
      <instancedMesh ref={starRef} args={[null as any, null as any, starCount]}>
        <extrudeGeometry args={[heptagramShape, { depth: 0.2, bevelEnabled: true, bevelSize: 0.05 }]} />
        <meshPhysicalMaterial 
          color="#FFD700" 
          metalness={1.0} 
          roughness={0.5} 
          reflectivity={0.15}
        />
      </instancedMesh>

      {/* Gold Dust */}
      <instancedMesh ref={goldDustRef} args={[null as any, null as any, goldDustCount]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={3} />
      </instancedMesh>

      {/* Red Spirals */}
      <instancedMesh ref={spiralRef} args={[null as any, null as any, spiralParticleCount]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial color="#8B0000" emissive="#8B0000" emissiveIntensity={2} />
      </instancedMesh>

      {/* Fairy Lights */}
      <instancedMesh ref={lightRef} args={[null as any, null as any, lightCount]}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshStandardMaterial color="#FFF4D1" emissive="#FFD700" emissiveIntensity={12} />
      </instancedMesh>

      {/* Gift Boxes - Deep Red Satin */}
      <instancedMesh ref={giftRef} args={[null as any, null as any, giftBoxCount]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshPhysicalMaterial 
          roughness={0.6} 
          metalness={0.7} 
          clearcoat={0.1} 
          reflectivity={0.1}
        />
      </instancedMesh>

      {/* Signature "S" at Top - Satin Gold Luster */}
      <group position={[0, 3.45, 0]} visible={morphState === TreeMorphState.TREE_SHAPE}>
        <mesh rotation={[0, 0, 0]} scale={0.22}>
          <extrudeGeometry 
            args={[sShape, { 
              depth: 0.15, 
              bevelEnabled: true, 
              bevelThickness: 0.05, 
              bevelSize: 0.05, 
              bevelSegments: 8 
            }]} 
          />
          <meshPhysicalMaterial 
            color="#FFD700" 
            emissive="#FFD700" 
            emissiveIntensity={10} 
            metalness={1.0} 
            roughness={0.4} 
            clearcoat={0.5}
            clearcoatRoughness={0.3}
            reflectivity={0.2}
          />
          <pointLight intensity={10} color="#FFD700" distance={5} />
        </mesh>
      </group>
    </group>
  );
};

export default ChristmasTreeParticles;
