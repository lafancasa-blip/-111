
import React from 'react';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { Vector2 } from 'three';

const PostProcessing: React.FC = () => {
  return (
    <EffectComposer disableNormalPass multisampling={4}>
      <Bloom 
        intensity={2.2} 
        luminanceThreshold={0.2} 
        luminanceSmoothing={0.8} 
        mipmapBlur
      />
      <Noise opacity={0.03} />
      <Vignette eskil={false} offset={0.05} darkness={1.2} />
      <ChromaticAberration 
        offset={new Vector2(0.0008, 0.0008)} 
      />
    </EffectComposer>
  );
};

export default PostProcessing;
