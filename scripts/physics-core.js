import * as ort from 'onnxruntime-web';
import { reshape } from 'mathjs';

/**
 * The physics simulation core performing the simulation induction via neural network model.
 */
export class PhysicsCore {
  /**
   * Constructor for PhysicsCore
   * @param {string} modelPath Path to the ONNX model
   * @param {number} modelBatchSize ONNX model trainning batch size
   * @param {string} dataPath Path to the initial state data in JSON format
   * @param {number} dataBatchSize The initial data batch size
   * @param {number} gridSizeX The model simulation grid size on x axis
   * @param {number} gridSizeY The model simulation grid size on y axis
   */
  constructor(modelPath, modelBatchSize, dataPath, dataBatchSize, gridSizeX = 64, gridSizeY = 64) {

    this.batchSize = dataBatchSize
    this.modelBatchSize = modelBatchSize
    this.gridSizeX = gridSizeX
    this.gridSizeY = gridSizeY

    this.tensorShape = [modelBatchSize, gridSizeX, gridSizeY, 5]
    this.tensorSize = modelBatchSize * gridSizeX * gridSizeY * 5
    this.X = new ort.Tensor('float32', new Float32Array(this.tensorSize), this.tensorShape)

    this.particalShape = [modelBatchSize, gridSizeX, gridSizeY, 1]
    this.velocityShape = [modelBatchSize, gridSizeX, gridSizeY, 2]
    this.forceShape = [modelBatchSize, gridSizeX, gridSizeY, 2]

    this.session = undefined

    this.#initSession(modelPath)
    this.#initData(dataPath)
  }

  async #initSession(modelPath) {
    this.session = await ort.InferenceSession.create(modelPath)
  }

  /**
   * Initialize state tensor for model inference
   * @param {string} dataPath Path to the initial state data in JSON format
   */
  #initData(dataPath) {
    fetch(dataPath)
      .then((response) => response.json())
      .then((json) => {
        let data = Float32Array.from(json.flat())
        let dataExtended = new Float32Array(this.tensorSize)
        dataExtended.set(data)
        this.X = new ort.Tensor('float32', dataExtended, this.tensorShape)
      })
  }

  /**
   * Set the specific range of last dimension of state tensor as in data
   * @param {Array} data The data to be set
   * @param {Array} range The range of last dimension to override by data
   */
  #setData(data, range) {
    let X = reshape(Array.from(this.X.data()), this.tensorShape)
    for (let batch = 0; batch < this.batchSize; batch++) {
      for (let x = 0; x < this.gridSizeX; x++) {
        for (let y = 0; y < this.gridSizeY; y++) {
          for (let i = range[0]; i < range[1]; i++) {
            X[batch][x][y][i] = data[batch][x][y][i - range[0]]
          }
        }
      }
    }
    this.X = new ort.Tensor('float32', Float32Array.from(X.flat()), this.tensorShape)
  }

  /**
   * Decomposition output tensor produced by the neural network model.
   * @param {ort.Tensor} output The neural network output tensor
   * @returns {Object} The object similar to the initial state.
   */
  #decomposeOutput(output) {
    // return { partical: particals, velocity: velocities }
  }

  /**
   * run one step simulation inference
   * @returns {ort.Tensor} output tensor
   */
  async runOneStep() {
    let feeds = { Input: this.X }
    result = await this.session.run(feeds)
    return (result['Output'])
  }

}