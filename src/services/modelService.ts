import { type Vector2 } from 'three';

export default interface ModelService {
  startSimulation: () => void;
  pauseSimulation: () => void;
  bindOutput: (callback: (data: Float32Array) => void) => void;
  getInputTensor: () => Float32Array;
  updateForce: (pos: Vector2, forceDelta: Vector2) => void;
  loadJSONFileFromUrl: (url: string) => Promise<void>;
}
