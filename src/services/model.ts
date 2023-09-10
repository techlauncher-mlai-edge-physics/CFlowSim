import { type Vector2 } from 'three';

export default interface Model {
  updateForce: (pos: Vector2, forceDelta: Vector2) => void;
  startSimulation: () => void;
  bindOutput: (callback: (data: Float32Array) => void) => void;
  getInputTensor(): Float32Array;
}
