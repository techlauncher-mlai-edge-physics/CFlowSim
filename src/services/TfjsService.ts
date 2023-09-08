import * as tf from '@tensorflow/tfjs';
import { type Vector2 } from 'three';
import type Model from './model';

export class TfjsService {
  model!: tf.GraphModel;
  gridSize: [number, number];
  batchSize: number;
  channelSize: number;
  outputChannelSize: number;
  mass: tf.Tensor;
  fpsLimit: number;
  density: tf.Tensor;
  velocity: tf.Tensor;
  pressure: tf.TensorBuffer<tf.Rank.R4>;

  isPaused: boolean;
  curFrameCountbyLastSecond: number;
  private outputCallback!: (data: Float32Array) => void;

  constructor() {
    this.gridSize = [0, 0];
    this.batchSize = 0;
    this.isPaused = true;
    this.channelSize = 0;
    this.outputChannelSize = 0;
    this.mass = tf.variable(tf.zeros([0]));
    this.fpsLimit = 30;
    this.curFrameCountbyLastSecond = 0;
    this.density = tf.zeros([0, 0, 0, 0]);
    this.velocity = tf.zeros([0, 0, 0, 0]);
    this.pressure = tf.buffer([0, 0, 0, 0]);
  }

  async createService(
    modelPath: string,
    gridSize: [number, number] = [64, 64],
    batchSize = 1,
    channelSize = 5,
    outputChannelSize = 3,
    fpsLimit = 15,
  ): Promise<TfjsService> {
    this.model = await tf.loadGraphModel(modelPath);
    this.gridSize = gridSize;
    this.batchSize = batchSize;
    this.channelSize = channelSize;
    this.outputChannelSize = outputChannelSize;
    this.fpsLimit = fpsLimit;

    this.mass = tf.tensor(1.0);
    this.density = tf.zeros([batchSize, ...gridSize, 1]);
    this.velocity = tf.zeros([batchSize, ...gridSize, 2]);
    this.pressure = tf.buffer([batchSize, ...gridSize, 1]);

    this.isPaused = false;
    return this;
  }

  async loadJSONFileFromUrl(url: string): Promise<ModelData> {
    const response = await fetch(url);
    const json = (await response.json()) as JSON;
    // check if json is valid
    if ('density' in json && 'velocity' in json && 'pressure' in json) {
      throw new Error('Invalid JSON file');
    }
    // turn json into ModelData

    return json as unknown as ModelData;
  }

  loadMatrixFromJson(json: ModelData): void {
    this.density = tf.tensor4d(json.density);
    this.velocity = tf.tensor4d(json.velocity);
    this.pressure = tf.tensor4d(json.pressure).bufferSync();
    this.mass = this.density.sum();
  }

  pauseSimulation(): void {
    this.isPaused = true;
  }

  bindOutput(callback: (data: Float32Array) => void): void {
    this.outputCallback = callback;
  }

  startSimulation(): void {
    this.isPaused = false;
    this.curFrameCountbyLastSecond = 0;
    this.fpsHeartbeat();
    this.iterate();
  }

  private fpsHeartbeat(): void {
    setTimeout(() => {
      this.curFrameCountbyLastSecond = 0;
      if (this.curFrameCountbyLastSecond >= this.fpsLimit) {
        this.startSimulation();
      } else {
        this.fpsHeartbeat();
      }
    }, 1000);
  }
  getInput(): tf.Tensor<tf.Rank> {
    return tf.concat(
      [this.density, this.velocity, this.pressure.toTensor()],
      3,
    );
  }
  private iterate(): void {
    if (this.isPaused) {
      return;
    }
    this.curFrameCountbyLastSecond += 1;
    const input = this.getInput();
    const energy = this.velocity.square().sum();
    const output = this.model?.predict(input) as tf.Tensor<tf.Rank>;
    // update density, velocity
    this.density = output?.slice(
      [0, 0, 0, 0],
      [this.batchSize, ...this.gridSize, 1],
    ) as tf.Tensor4D;
    this.velocity = output?.slice(
      [0, 0, 0, 1],
      [this.batchSize, ...this.gridSize, 2],
    ) as tf.Tensor4D;
    // update density, velocity
    const newEnergy = this.velocity.square().sum();
    const energyScale = energy.div(newEnergy);
    this.velocity = this.velocity.mul(energyScale.sqrt());
    const newMass = this.density.sum();
    const massScale = this.mass.div(newMass);
    this.density = this.density.mul(massScale);
    this.outputCallback(output?.dataSync() as Float32Array);
    // set timeout to 0 to allow other tasks to run, like pause and apply force
    setTimeout(() => {
      this.iterate();
    }, 0);
  }

  updateForce(pos: Vector2, forceDelta: Vector2, batchIndex = 0): void {
    this.pressure.set(
      this.pressure.get(batchIndex, pos.x, pos.y, 0) + forceDelta.x,
      batchIndex,
      pos.x,
      pos.y,
      3,
    );
    this.pressure.set(
      this.pressure.get(batchIndex, pos.x, pos.y, 1) + forceDelta.y,
      batchIndex,
      pos.x,
      pos.y,
      4,
    );
  }
}
interface ModelData {
  density: number[][][][];
  velocity: number[][][][];
  pressure: number[][][][];
}
