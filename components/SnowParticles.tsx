
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SnowParticles: React.FC = () => {
  const count = 1000;
  const meshRef = useRef<THREE.Points>(null);

  const [positions, speeds, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    const sze = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = Math.random() * 30 - 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
      spd[i] = 0.5 + Math.random() * 2.0;
      sze[i] = 0.02 + Math.random() * 0.08;
    }
    return [pos, spd, sze];
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
      uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <shaderMaterial
        transparent
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={`
          uniform float uTime;
          attribute float size;
          varying float vOpacity;
          void main() {
            vec3 pos = position;
            pos.y = mod(pos.y - uTime * 1.5, 30.0) - 10.0;
            pos.x += sin(uTime * 0.5 + position.z) * 0.5;
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            
            // Further reduced base size to 0.8 for a extremely delicate "diamond dust" look
            gl_PointSize = 0.8 * (30.0 / -mvPosition.z);
            
            vOpacity = smoothstep(-10.0, -8.0, pos.y) * smoothstep(20.0, 15.0, pos.y);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          varying float vOpacity;
          void main() {
            float r = distance(gl_PointCoord, vec2(0.5));
            if (r > 0.5) discard;
            gl_FragColor = vec4(1.0, 1.0, 1.0, vOpacity * (1.0 - r * 2.0));
          }
        `}
      />
    </points>
  );
};

export default SnowParticles;
