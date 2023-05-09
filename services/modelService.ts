import * as ort from "onnxruntime-web";
import { type Vector2 } from "three";
import type Model from "./model";

export default class ModelService implements Model {
  session: ort.InferenceSession | null;
  gridSize: [number, number];
  batchSize: number;
  channelSize: number;
  outputChannelSize: number;
  mass: number;

  private tensorShape: [number, number, number, number];
  private tensorSize: number;
  private outputTensorSize: number;
  private outputCallback!: (data: Float32Array) => void;
  private matrixArray: Float32Array;
  // 0: partial density
  // 1, 2: partial velocity
  // 3, 4: Force (currently not used)

  // hold constructor private to prevent direct instantiation
  // ort.InferenceSession.create() is async,
  // so we need to use a static async method to create an instance
  private isPaused: boolean;

  private constructor() {
    this.session = null;
    this.matrixArray = new Float32Array();
    // matrixData and matrixTensor must be sync.
    this.gridSize = [0, 0];
    this.batchSize = 0;
    this.tensorShape = [0, 0, 0, 0];
    this.tensorSize = 0;
    this.outputTensorSize = 0;
    this.isPaused = true;
    this.channelSize = 0;
    this.outputChannelSize = 0;
    this.mass = 0;
  }

  // static async method to create an instance
  static async createModelService(
    modelPath: string,
    gridSize: [number, number] = [64, 64],
    batchSize: number = 1,
    channelSize: number = 5,
    outputChannelSize: number = 3,
  ): Promise<ModelService> {
    console.log("createModelService called");
    const modelServices = new ModelService();
    console.log("createModelService constructor called");
    await modelServices.init(modelPath, gridSize, batchSize, channelSize, outputChannelSize);
    console.log("createModelService finished");
    return modelServices;
  }

  async initMatrixFromPath(path: string): Promise<void> {
    // check if the path is a relative path
    if (path[0] === "/" && process.env.BASE_PATH != null) {
      path = `${process.env.BASE_PATH}/${path}`;
    }
    console.log(`initMatrixFromPath called with path: ${path}`);
    const matrix = await fetch(path).then(async (res) => await res.json());
    if (matrix == null) {
      throw new Error(`The matrix from ${path} is null`);
    }
    this.initMatrixFromJSON(matrix);
  }

  bindOutput(callback: (data: Float32Array) => void): void {
    this.outputCallback = callback;
  }

  async startSimulation(): Promise<void> {
    // start iterate() in a new thread
    this.isPaused = false;
    this.iterate().catch((e) => {
      console.error("error in iterate", e);
      this.isPaused = true;
    });
  }

  pauseSimulation(): void {
    this.isPaused = true;
  }

  private async init(
    modelPath: string,
    gridSize: [number, number],
    batchSize: number,
    channelSize: number,
    outputChannelSize: number,
  ): Promise<void> {
    console.log("init called");
    this.session = await ort.InferenceSession.create(modelPath, {
      executionProviders: ["wasm"],
      graphOptimizationLevel: "all",
    });
    console.log("init session created");
    this.channelSize = channelSize;
    this.outputChannelSize = outputChannelSize;
    this.gridSize = gridSize;
    this.batchSize = batchSize;
    this.tensorShape = [batchSize, gridSize[0], gridSize[1], channelSize];
    this.tensorSize = batchSize * gridSize[0] * gridSize[1] * channelSize;
    this.outputTensorSize = batchSize * gridSize[0] * gridSize[1] * outputChannelSize;
  }

  private initMatrixFromJSON(data: any): void {
    data = this.normalizeMatrix(data);
    console.log("initMatrixFromJSON called");
    this.matrixArray = new Float32Array(data.flat(Infinity));
    if (this.matrixArray.length !== this.tensorSize) {
      throw new Error(
        `matrixArray length ${this.matrixArray.length} does not match tensorSize ${this.tensorSize}`
      );
    }
    this.mass = this.matrixSum(this.matrixArray, [0, 1]);
  }

  private async iterate(): Promise<void> {
    if (this.session == null) {
      throw new Error(
        "session is null, createModelServices() must be called at first"
      );
    }
    console.log("iterate called");
    console.log("this.matrixArray", this.matrixArray);
    const inputTensor = new ort.Tensor(
      "float32",
      this.matrixArray,
      this.tensorShape
    );
    const feeds: Record<string, ort.Tensor> = {};
    feeds[this.session.inputNames[0]] = inputTensor;
    this.session
      .run(feeds)
      .then((outputs) => {
        console.log("outputs type", typeof outputs);
        // check if the output canbe downcasted to Float32Array
        if (outputs.Output.data instanceof Float32Array) {
          const outputData = this.constrainOutput(outputs.Output.data);
          this.outputCallback(outputData);
          this.copyOutputToMatrix(outputData);
          setTimeout(() => {
            if (!this.isPaused) {
              this.iterate().catch((e) => {
                console.error("error in iterate", e);
                this.isPaused = true;
              });
            }
          });
        }
      })
      .catch((e) => {
        console.error("error in session.run", e);
        this.isPaused = true;
      });
  }

  private normalizeMatrix(matrix: number[][][][]): number[][][][] {
    for (let channel = 0; channel < this.channelSize; channel++) {
      // calculate mean
      let sum = 0;
      for (let batch = 0; batch < this.batchSize; batch++) {
        for (let x = 0; x < this.gridSize[0]; x++) {
          for (let y = 0; y < this.gridSize[1]; y++) {
            sum += matrix[batch][x][y][channel];
          }
        }
      }
      const mean = sum / (this.batchSize * this.gridSize[0] * this.gridSize[1]);
      // calculate standard deviation, subtract mean
      sum = 0;
      for (let batch = 0; batch < this.batchSize; batch++) {
        for (let x = 0; x < this.gridSize[0]; x++) {
          for (let y = 0; y < this.gridSize[1]; y++) {
            matrix[batch][x][y][channel] -= mean;
            sum += matrix[batch][x][y][channel] ** 2;
          }
        }
      }
      const std =
        Math.sqrt(sum / (this.batchSize * this.gridSize[0] * this.gridSize[1]));
      // normalize
      for (let batch = 0; batch < this.batchSize; batch++) {
        for (let x = 0; x < this.gridSize[0]; x++) {
          for (let y = 0; y < this.gridSize[1]; y++) {
            matrix[batch][x][y][channel] /= std;
          }
        }
      }
    }
    return matrix;
  }

  private constrainOutput(data: Float32Array): Float32Array {
    const energy = this.matrixSum(this.matrixArray, [1, 3], (value) => value ** 2, false);
    data = this.constrainPressure(data);
    data = this.constrainVelocity(data, energy);
    return data;
  }

  private constrainPressure(data: Float32Array): Float32Array {
    const scale = this.mass / this.matrixSum(data, [0, 1], (value) => value, true);
    console.log("Pressure scale", scale);
    return this.matrixAlter(data, [0, 1], (value) => value * scale, true);
  }

  private constrainVelocity(data: Float32Array, energy: number): Float32Array {
    const scale = Math.sqrt(energy / this.matrixSum(data, [1, 3], (value) => value ** 2, true));
    console.log("Velocity scale", scale);
    if (scale <= 1) return data;
    return this.matrixAlter(data, [1, 3], (value) => value * scale, true);
  }

  private copyOutputToMatrix(outputs: Float32Array): void {
    if (this.matrixArray.length === 0) {
      throw new Error("matrixArray is empty");
    }
    let fromIndex = 0;
    let toIndex = 0;
    let cntOffset = 0;
    while (fromIndex < outputs.length) {
      if (cntOffset >= 3) {
        cntOffset = 0;
        toIndex += 2;
        if (toIndex >= this.matrixArray.length) {
          throw new Error(
            `toIndex ${toIndex} exceeds matrixArray length ${this.matrixArray.length}`
          );
        }
      }
      this.matrixArray[toIndex] = outputs[fromIndex];
      fromIndex++;
      toIndex++;
      cntOffset++;
    }
    if (fromIndex !== outputs.length) {
      throw new Error(
        `fromIndex ${fromIndex} does not match outputs length ${outputs.length}`
      );
    }
    if (toIndex + 2 !== this.matrixArray.length) {
      throw new Error(
        `toIndex ${toIndex} does not match matrixArray length ${this.matrixArray.length}`
      );
    }
  }

  updateForce(pos: Vector2, forceDelta: Vector2): void {
    const index: number = this.getIndex(pos);
    this.matrixArray[index + 3] += forceDelta.x;
    this.matrixArray[index + 4] += forceDelta.y;
  }

  private getIndex(pos: Vector2, batchIndex: number = 0): number {
    return (
      batchIndex * this.gridSize[0] * this.gridSize[1] * this.channelSize +
      pos.y * this.gridSize[1] * this.channelSize +
      pos.x * this.channelSize
    );
  }

  private matrixSum(
    matrix: Float32Array,
    channelRange: [number, number],
    f: (value: number) => number = (value) => value,
    isOutput: boolean = false
  ): number {
    const tensorSize = isOutput ? this.outputTensorSize : this.tensorSize;
    const channelSize = isOutput ? this.outputChannelSize : this.channelSize;
    let sum = 0;
    let index = 0;
    while (index < tensorSize) {
      for (let k = channelRange[0]; k < channelRange[1]; k++) {
        sum += f(matrix[index + k]);
      }
      index += channelSize;
    }
    return sum;
  }

  private matrixAlter(
    matrix: Float32Array,
    channelRange: [number, number],
    f: (value: number) => number,
    isOutput: boolean = false
  ): Float32Array {
    const tensorSize = isOutput ? this.outputTensorSize : this.tensorSize;
    const channelSize = isOutput ? this.outputChannelSize : this.channelSize;
    let index = 0;
    while (index < tensorSize) {
      for (let k = channelRange[0]; k < channelRange[1]; k++) {
        matrix[index + k] = f(matrix[index + k]);
      }
      index += channelSize;
    }
    return matrix;
  }
}
