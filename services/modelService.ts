import * as ort from "onnxruntime-web";
import { type Vector2 } from "three";

export default class ModelService {
  session: ort.InferenceSession | null;
  gridSize: [number, number];
  batchSize: number;

  private tensorShape: [number, number, number, number];
  private tensorSize: number;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  private outputCallback: (data: Float32Array) => void;
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
  static async createModelServices(
    modelPath: string,
    gridSize: [number, number] = [64, 64],
    batchSize: number = 1
  ) {
    console.log("createModelServices called");
    const modelServices = new ModelService();
    console.log("createModelServices constructor called");
    await modelServices.init(modelPath, gridSize, batchSize);
    console.log("createModelServices finished");
    return modelServices;
  }

  initMatrixFromPath(path: string) {
    // check if the path is a relative path
    if (path[0] === "/" && process.env.BASE_PATH != null) {
      path = `${process.env.BASE_PATH}/${path}`;
    }
    console.log(`initMatrixFromPath called with path: ${path}`);
    void fetch(path).then((r) => {
      void r.json().then((data) => {
        this.initMatrixFromJSON(data);
        console.log("initMatrixFromPath finished");
      });
    });
  }

  bindOutput(callback: (data: Float32Array) => void) {
    this.outputCallback = callback;
  }

  async startSimulation() {
    await this.iterate();
  }

  pauseSimulation() {
    this.continueSimulation = false;
  }

  private async init(
    modelPath: string,
    gridSize: [number, number],
    batchSize: number
  ) {
    // ort.env.wasm.wasmPaths = "http://localhost:8000/_next/static/chunks/pages";
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

  private initMatrixFromJSON(data: any) {
    console.log("initMatrixFromJSON called");
    this.matrixArray = new Float32Array(data.flat(Infinity));
    if (this.matrixArray.length !== this.tensorSize) {
      throw new Error(
        `matrixArray length ${this.matrixArray.length} does not match tensorSize ${this.tensorSize}`
      );
    }
  }

  private async iterate() {
    if (this.session == null) {
      throw new Error(
        "session is null, createModelServices() must be called at first"
      );
    }
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
        if (outputs.Output.data instanceof Float32Array) {
          this.outputCallback(outputs.Output.data);
          this.copyOutputToMatrix(outputs.Output.data);
          if (this.continueSimulation) {
            void this.iterate();
          }
        }
      })
      .catch((e) => {
        console.error("error in session.run", e);
      });
  }

  private copyOutputToMatrix(outputs: Float32Array) {
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
      }
      this.matrixArray[toIndex] = outputs[fromIndex];
      fromIndex++;
      toIndex++;
      cntOffset++;
    }
    if (toIndex !== this.matrixArray.length) {
      throw new Error(
        `toIndex ${toIndex} does not match matrixArray length ${this.matrixArray.length}`
      );
    }
  }

  updateForce(pos: Vector2, forceDelta: Vector2) {
    const index = this.getIndex(pos);
    this.matrixArray[index + 3] += forceDelta.x;
    this.matrixArray[index + 4] += forceDelta.y;
  }

  private getIndex(pos: Vector2, batchIndex = 0) {
    return (
      batchIndex * this.gridSize[0] * this.gridSize[1] +
      pos.y * this.gridSize[0] +
      pos.x
    );
  }
}
