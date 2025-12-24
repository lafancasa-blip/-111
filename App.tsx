
import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import Scene from './components/Scene';
import UIOverlay from './components/UIOverlay';
import VeoOverlay from './components/VeoOverlay';
import { TreeMorphState } from './types';

const App: React.FC = () => {
  const [morphState, setMorphState] = useState<TreeMorphState>(TreeMorphState.SCATTERED);
  const [showVeo, setShowVeo] = useState(false);

  const toggleMorph = () => {
    setMorphState(prev => 
      prev === TreeMorphState.SCATTERED ? TreeMorphState.TREE_SHAPE : TreeMorphState.SCATTERED
    );
  };

  return (
    <div className="relative w-full h-screen bg-[#000a1a]">
      <Suspense fallback={<div className="flex items-center justify-center h-full text-[#d4af37] font-luxury animate-pulse uppercase tracking-[0.5em]">Initializing Signature...</div>}>
        <Canvas shadows gl={{ antialias: true, stencil: false, depth: true }}>
          <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={50} />
          <color attach="background" args={['#000a1a']} />
          
          <Scene morphState={morphState} />
          
          <OrbitControls 
            enablePan={false} 
            maxPolarAngle={Math.PI / 1.7} 
            minDistance={4} 
            maxDistance={15} 
          />
          <Environment preset="night" />
        </Canvas>
      </Suspense>

      <UIOverlay 
        morphState={morphState} 
        onToggle={toggleMorph} 
        onOpenVeo={() => setShowVeo(true)} 
      />

      {showVeo && <VeoOverlay onClose={() => setShowVeo(false)} />}
    </div>
  );
};

export default App;
