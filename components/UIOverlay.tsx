
import React from 'react';
import { TreeMorphState } from '../types';

interface UIOverlayProps {
  morphState: TreeMorphState;
  onToggle: () => void;
  onOpenVeo: () => void;
}

const UIOverlay: React.FC<UIOverlayProps> = ({ morphState, onToggle, onOpenVeo }) => {
  const isTree = morphState === TreeMorphState.TREE_SHAPE;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between pt-16 pb-10 px-6">
      {/* Top Section */}
      <div className="text-center">
        <h2 className="metallic-text text-5xl font-luxury tracking-tighter mb-4 drop-shadow-2xl uppercase">
          {isTree ? "Merry Christmas" : "SATCHI"}
        </h2>
        <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent mx-auto" />
      </div>

      {/* Bottom Controls - Repositioned to be lower */}
      <div className="flex flex-col gap-6 pointer-events-auto items-center mt-auto">
        <button 
          onClick={onToggle}
          className="group relative px-14 py-4 bg-black/60 backdrop-blur-xl border border-[#d4af37]/40 hover:border-[#d4af37] transition-all duration-700 overflow-hidden rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
        >
          <div className="absolute inset-0 bg-[#d4af37] opacity-0 group-hover:opacity-20 transition-opacity" />
          <span className="relative z-10 text-[#d4af37] uppercase tracking-[0.4em] text-[11px] font-bold">
            {isTree ? "Release Elements" : "Manifest Tree"}
          </span>
        </button>
        
        {/* The Veo option was removed as per '底部的可增加照片选项去掉' */}
      </div>
    </div>
  );
};

export default UIOverlay;
