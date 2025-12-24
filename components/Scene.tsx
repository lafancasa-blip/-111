
import React from 'react';
import { TreeMorphState } from '../types';
import PostProcessing from './PostProcessing';
import ChristmasTreeParticles from './ChristmasTreeParticles';
import SnowParticles from './SnowParticles';
import { Sparkles, Stars, ContactShadows } from '@react-three/drei';

interface SceneProps {
  morphState: TreeMorphState;
}

const Scene: React.FC<SceneProps> = ({ morphState }) => {
  const isTree = morphState === TreeMorphState.TREE_SHAPE;

  return (
    <>
      <ambientLight intensity={0.15} />
      
      {/* High Contrast Cinematic Lighting */}
      <spotLight 
        position={[10, 20, 10]} 
        angle={0.25} 
        penumbra={1} 
        intensity={5} 
        castShadow 
        color="#ffffff"
      />
      
      {/* Emerald Base Light */}
      <pointLight position={[0, -4, 0]} intensity={isTree ? 4 : 1} color="#00FF88" distance={10} />

      {/* Internal Golden Core Glow */}
      <pointLight position={[0, 0, 0]} intensity={isTree ? 3 : 0} color="#FFD700" distance={10} />
      
      {/* Deep Red Accent Rim Light */}
      <pointLight position={[-5, 2, -5]} intensity={2} color="#8B0000" distance={12} />

      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={0.4} />
      <Sparkles count={200} scale={15} size={2} speed={0.2} opacity={0.3} color="#FFD700" />
      
      {/* Custom Shader Snowflakes */}
      <SnowParticles />

      <group position={[0, -1, 0]}>
        <ChristmasTreeParticles morphState={morphState} />
        <ContactShadows 
          opacity={0.6} 
          scale={20} 
          blur={3} 
          far={5} 
          color="#000502" 
        />
      </group>

      <PostProcessing />
    </>
  );
};

export default Scene;
