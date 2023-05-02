import { type Vector2 } from "three"
import type Model from "./model";

export default class TestModel implements Model {
  callback: (data: Float32Array) => void;
  advectionSize: number;

  constructor(size: number) {
    this.callback = () => {};
    this.advectionSize = size;
  }

  updateForce(pos: Vector2, forceDelta: Vector2): void {
    // placeholder for test code
  }

  async startSimulation(): Promise<void> {
    const x = new Float32Array(this.advectionSize*this.advectionSize*3)
    for (let i = 0; i < this.advectionSize*this.advectionSize; i+=3) 
    {
      x[i] = i; 
      x[i+1] = i; 
      x[i+2] = i; 
    }
    this.callback(x)
  }

  bindOutput(callback: (data: Float32Array) => void): void {
    this.callback = callback;
  }
}
