import { type Vector2 } from "three"
import type Model from "./model";
import { randFloat } from "three/src/math/MathUtils";

export default class TestModel implements Model {
  callback: (data: Float32Array) => void;
  advectionSize: number;
  advection : Float32Array 

  constructor(size: number) {
    this.callback = () => {};
    this.advectionSize = size;
    this.advection = new Float32Array(this.advectionSize*this.advectionSize)
  }

  updateForce(pos: Vector2, forceDelta: Vector2): void {
  }

  async startSimulation(): Promise<void> {
    for (let i = 0; i < this.advectionSize*this.advectionSize; i++) 
    {
      this.advection[i] = randFloat(-1,3); 
    }
    this.callback(this.advection)
  }

  bindOutput(callback: (data: Float32Array) => void): void {
    this.callback = callback;
  }
}
