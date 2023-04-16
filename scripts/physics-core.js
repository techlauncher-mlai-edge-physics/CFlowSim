import * as ort from 'onnxruntime-web'
import { reshape } from 'mathjs'

/**
 * The physics simulation core performing the simulation induction via neural network model.
 */
export class PhysicsCore {
  /**
   * Constructor for PhysicsCore
   * @param {string} modelPath Path to the ONNX model
   * @param {string} dataPath Path to the initial state data in JSON format
   * @param {number} batchSize The initial data batch size
   * @param {number} gridSizeX The model simulation grid size on x axis
   * @param {number} gridSizeY The model simulation grid size on y axis
   */
  constructor(modelPath, dataPath, batchSize, gridSizeX = 64, gridSizeY = 64) {

    this.batchSize = batchSize
    this.gridSizeX = gridSizeX
    this.gridSizeY = gridSizeY

    this.tensorShape = [batchSize, gridSizeX, gridSizeY, 5]
    this.tensorSize = batchSize * gridSizeX * gridSizeY * 5
    this.pvShape = [batchSize, gridSizeX, gridSizeY, 3]
    this.X = new ort.Tensor('float32', new Float32Array(this.tensorSize), this.tensorShape)

    this.session = undefined
    this.isSessionReady = false
    this.modelPath = modelPath
    this.#initData(dataPath)
  }

  async #initSession() {
    this.session = await ort.InferenceSession.create(this.modelPath)
    this.isSessionReady = true
  }

  /**
   * Initialize state tensor for model inference
   * @param {string} dataPath Path to the initial state data in JSON format
   */
  #initData(dataPath) {
    fetch(dataPath)
      .then((response) => response.json())
      .then((json) => {
        let data = Float32Array.from(json.flat(Infinity))
        this.X = new ort.Tensor('float32', data, this.tensorShape)
      })
  }

  /**
   * Set the specific range of last dimension of state tensor as in data
   * @param {Array} data The data to be set
   * @param {Array} range The range of last dimension to override by data
   */
  #setData(data, range) {
    let X = reshape(Array.from(this.X.data), this.tensorShape)
    for (let batch = 0; batch < this.batchSize; batch++) {
      for (let x = 0; x < this.gridSizeX; x++) {
        for (let y = 0; y < this.gridSizeY; y++) {
          for (let i = range[0]; i < range[1]; i++) {
            X[batch][x][y][i] = data[batch][x][y][i - range[0]]
          }
        }
      }
    }
    this.X = new ort.Tensor('float32', Float32Array.from(X.flat(Infinity)), this.tensorShape)
  }

  /**
   * Decomposition output tensor produced by the neural network model.
   * @param {ort.Tensor} output The neural network output tensor
   * @returns {Object} The object similar to the initial state.
   */
  #decomposeOutput(output) {
    // TODO
    // return { partical: particals, velocity: velocities }
  }

  /**
   * Tun one step simulation inference and save the pv state for following inference.
   * @returns {ort.Tensor} output tensor
   */
  async runOneStep() {
    if (!this.isSessionReady) {
      await this.#initSession()
    }

    let feeds = { Input: this.X }
    let result = await this.session.run(feeds)

    let resultData = reshape(Array.from(result.Output.data), this.pvShape)
    this.#setData(resultData, [0, 3])

    return (result.Output)
  }

}