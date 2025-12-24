
export enum TreeMorphState {
  SCATTERED = 'SCATTERED',
  TREE_SHAPE = 'TREE_SHAPE'
}

export interface ParticleData {
  id: number;
  scatterPos: [number, number, number];
  treePos: [number, number, number];
  scatterRot: [number, number, number];
  treeRot: [number, number, number];
  scale: number;
  color: string;
}

export interface VeoGenerationConfig {
  aspectRatio: '16:9' | '9:16';
  prompt?: string;
}
