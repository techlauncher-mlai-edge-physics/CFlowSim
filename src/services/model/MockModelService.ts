import { type ModelService } from './modelService';
import { type Vector2 } from 'three';

// not for use in production code
export default class MockModelService implements ModelService {
  inputTensor: Float32Array;
  mass: number;
  shape: [number, number, number, number];

  static createService(
    _modelPath: string,
    _gridSize: [number, number] = [64, 64],
    _batchSize = 1,
    _channelSize = 5,
    _outputChannelSize = 3,
    _fpsLimit = 15,
  ): MockModelService {
    return new MockModelService();
  }

  public constructor(
    it: Float32Array = new Float32Array(),
    m: number = 8,
    shape: [number, number, number, number] = [5, 3, 4, 2],
  ) {
    this.inputTensor = it;
    this.mass = m;
    this.shape = shape;
  }

  setShape(shape: [number, number, number, number]): void {
    this.shape = shape;
  }

  updateForce(_: Vector2, __: Vector2): void {}

  startSimulation(): void {}

  pauseSimulation(): void {}

  bindOutput(_: (data: Float32Array) => void): void {}

  getInputTensor(): Float32Array {
    return this.inputTensor;
  }

  loadDataArray(input: number[][][][]): void {
    this.inputTensor = new Float32Array(input.flat(3));
  }

  getMass(): number {
    return this.mass;
  }

  getInputShape(): [number, number, number, number] {
    return this.shape;
  }

  setMass(value: number): void {
    this.mass = value;
  }

  getType(): string {
    return 'mock';
  }
}
