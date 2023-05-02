import * as ort from "onnxruntime-web";
import { type Vector2 } from "three";
import type Model from "./model";

export default class ModelService implements Model {
  session: ort.InferenceSession | null;
  gridSize: [number, number];
  batchSize: number;

  private tensorShape: [number, number, number, number];
  private tensorSize: number;
  private outputCallback!: (data: Float32Array) => void;
  private matrixArray: Float32Array;
  // 0: partial density
  // 1, 2: partial velocity
  // 3, 4: Force (currently not used)

  // hold constructor private to prevent direct instantiation
  // ort.InferenceSession.create() is async,
  // so we need to use a static async method to create an instance
  private continueSimulation: boolean;

  private constructor() {
    this.session = null;
    this.matrixArray = new Float32Array();
    // matrixData and matrixTensor must be sync.
    this.gridSize = [0, 0];
    this.batchSize = 0;
    this.tensorShape = [0, 0, 0, 0];
    this.tensorSize = 0;
    this.continueSimulation = true;
  }

  // static async method to create an instance
  static async createModelService(
    modelPath: string,
    gridSize: [number, number] = [64, 64],
    batchSize: number = 1
  ): Promise<ModelService> {
    console.log("createModelService called");
    const modelServices = new ModelService();
    console.log("createModelService constructor called");
    await modelServices.init(modelPath, gridSize, batchSize);
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
    this.continueSimulation = true;
    this.iterate().catch((e) => {
      console.error("error in iterate", e);
      this.continueSimulation = false;
    });
  }

  pauseSimulation(): void {
    this.continueSimulation = false;
  }

  private async init(
    modelPath: string,
    gridSize: [number, number],
    batchSize: number
  ): Promise<void> {
    console.log("init called");
    this.session = await ort.InferenceSession.create(modelPath, {
      executionProviders: ["wasm"],
      graphOptimizationLevel: "all",
    });
    console.log("init session created");
    this.gridSize = gridSize;
    this.batchSize = batchSize;
    this.tensorShape = [batchSize, gridSize[0], gridSize[1], 5];
    this.tensorSize = batchSize * gridSize[0] * gridSize[1] * 5;
  }

  private initMatrixFromJSON(data: any): void {
    console.log("initMatrixFromJSON called");
    this.matrixArray = new Float32Array(data.flat(Infinity));
    if (this.matrixArray.length !== this.tensorSize) {
      throw new Error(
        `matrixArray length ${this.matrixArray.length} does not match tensorSize ${this.tensorSize}`
      );
    }
  }

  private async iterate(): Promise<void> {
    if (this.session == null) {
      throw new Error(
        "session is null, createModelServices() must be called at first"
      );
    }
    while (this.continueSimulation) {
      console.log("iterate called");
      console.log("this.matrixArray", this.matrixArray);
      const inputTensor = new ort.Tensor(
        "float32",
        this.matrixArray,
        this.tensorShape
      );
      const feeds: Record<string, ort.Tensor> = {};
      feeds[this.session.inputNames[0]] = inputTensor;
      try {
        const outputs = await this.session.run(feeds);
        console.log("outputs type", typeof outputs);
        // check if the output canbe downcasted to Float32Array
        if (outputs.Output.data instanceof Float32Array) {
          this.outputCallback(outputs.Output.data);
          this.copyOutputToMatrix(outputs.Output.data);
          if (!this.continueSimulation) {
            break;
          }
        }
      } catch (e) {
        console.error("error in session.run", e);
        this.continueSimulation = false;
      }
    }
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
      batchIndex * this.gridSize[0] * this.gridSize[1] +
      pos.y * this.gridSize[0] +
      pos.x
    );
  }
}
