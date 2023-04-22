import * as ort from "onnxruntime-web";
import chunk from "lodash/chunk";
import { flattenDeep } from "lodash";

export default class ModelServices {
  session: ort.InferenceSession | null;
  gridSize: [number, number];
  batchSize: number;
  private matrixTensor: ort.Tensor | null;
  private tensorShape: [number, number, number, number];
  private tensorSize: number;
  private pvShape: [number, number, number, number];
  // the last one is for different types of data
  // 0: partial density
  // 1, 2 : partial velocity
  // 3, 4 : Force (currently not used)

  // hold constructor private to prevent direct instantiation
  // ort.InferenceSession.create() is async,
  // so we need to use a static async method to create an instance
  private constructor() {
    this.session = null;
    this.matrixTensor = null;
    // matrixData and matrixTensor must be sync.
    this.gridSize = [0, 0];
    this.batchSize = 0;
    this.tensorShape = [0, 0, 0, 0];
    this.tensorSize = 0;
    this.pvShape = [0, 0, 0, 0];
  }

  // static async method to create an instance
  static async createModelServices(
    modelPath: string,
    gridSize: [number, number],
    batchSize: number
  ) {
    console.log("createModelServices called");
    const modelServices = new ModelServices();
    await modelServices.init(modelPath, gridSize, batchSize);
    console.log("createModelServices finished");
    return modelServices;
  }

  initMatrixFromPath(path: string) {
    // check if the path is a relative path
    if (path[0] !== "/" && process.env.BASE_PATH != null) {
      path = `${process.env.BASE_PATH}/${path}`;
    }
    console.log(`initMatrixFromPath called with path: ${path}`);
    void fetch(path).then((r) => {
      void r.json().then((data) => {
        this.initMatrixFromJSON(data);
      });
    });
  }

  // return the data that reshaped to the shape of [batchSize, gridSize[0], gridSize[1], 5]
  getMatrixData(): number[][][][] {
    const matrixData = this.getMatrixRawData();
    if (matrixData instanceof Float32Array) {
      return chunk(matrixData, this.tensorSize / this.batchSize).map((d) =>
        chunk(d, this.tensorSize / this.batchSize / this.gridSize[0]).map((d) =>
          chunk(
            d,
            this.tensorSize /
              this.batchSize /
              this.gridSize[0] /
              this.gridSize[1]
          )
        )
      );
    } else {
      throw new Error("matrixData is not Float32Array");
    }
  }

  getMatrixRawData() {
    return this.matrixTensor?.data;
  }

  async runOneStep() {
    await this.iterate();
  }

  private async init(
    modelPath: string,
    gridSize: [number, number],
    batchSize: number
  ) {
    this.session = await ort.InferenceSession.create(modelPath, {
      executionProviders: ["webgl"],
      graphOptimizationLevel: "all",
    });
    this.gridSize = gridSize;
    this.batchSize = batchSize;
    this.tensorShape = [batchSize, gridSize[0], gridSize[1], 5];
    this.tensorSize = batchSize * gridSize[0] * gridSize[1] * 5;
    this.pvShape = [batchSize, gridSize[0], gridSize[1], 3];
  }

  private initMatrixFromJSON(data: any) {
    console.log("initMatrixFromJSON called");
    const matrixData = new Float32Array(data.flat(Infinity));
    this.matrixTensor = new ort.Tensor("float32", matrixData, this.tensorShape);
  }

  private async iterate() {
    if (this.session == null) {
      throw new Error(
        "session is null, createModelServices() must be called at first"
      );
    }
    if (this.matrixTensor == null) {
      throw new Error("matrixTensor is null");
    }
    const feeds: Record<string, ort.Tensor> = {};
    feeds[this.session.inputNames[0]] = this.matrixTensor;
    const outputs = await this.session.run(feeds);

    if (outputs.Output.data instanceof Float32Array) {
      const outputData = chunk(
        outputs.Output.data,
        this.tensorSize / this.batchSize
      ).map((d) =>
        chunk(d, this.tensorSize / this.batchSize / this.gridSize[0]).map((d) =>
          chunk(
            d,
            this.tensorSize /
              this.batchSize /
              this.gridSize[0] /
              this.gridSize[1]
          )
        )
      );
      this.updateMatrixFromOutputData(outputData);
    } else {
      throw new Error("outputData is not Float32Array");
    }
  }

  private updateMatrixFromOutputData(outputData: number[][][][]) {
    const curData = this.getMatrixData();
    for (let batch = 0; batch < this.batchSize; batch++) {
      for (let x = 0; x < this.gridSize[0]; x++) {
        for (let y = 0; y < this.gridSize[1]; y++) {
          for (let i = 0; i < this.pvShape[3]; i++) {
            curData[batch][x][y][i] = outputData[batch][x][y][i];
          }
        }
      }
    }
    const flatData = flattenDeep(curData);
    this.matrixTensor = new ort.Tensor(
      "float32",
      new Float32Array(flatData),
      this.tensorShape
    );
  }
}
