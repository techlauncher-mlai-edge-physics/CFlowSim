import { type Vector2 } from 'three';
import { TfjsService } from './TfjsService';
import ONNXService from './ONNXService';
import MockModelService from './MockModelService';

export interface ModelService {
  startSimulation: () => void;
  pauseSimulation: () => void;
  bindOutput: (callback: (data: Float32Array) => void) => void;
  getInputTensor: () => Float32Array;
  getMass: () => number;
  getInputShape: () => [number, number, number, number];
  updateForce: (pos: Vector2, forceDelta: Vector2) => void;
  loadDataArray: (array: number[][][][]) => void;
  setMass: (mass: number) => void;
  getType: () => string;
}

// a simple factory function to create a model service
export async function createModelService(
  modelPath: string,
  gridSize: [number, number] = [64, 64],
  batchSize = 1,
  channelSize = 5,
  outputChannelSize = 3,
  fpsLimit = 15,
): Promise<ModelService> {
  // deal with internal paths
  console.log(modelPath);

  if (modelPath.startsWith('/model/')) {
    modelPath = new URL(modelPath, import.meta.url).href;
  }
  console.log(modelPath);

  // detect the model type
  // TODO: read the model type from the model definition file
  const modelType = modelPath.split('.').pop();
  console.log(modelType);
  switch (modelType) {
    case 'json':
      return await TfjsService.createService(
        modelPath,
        gridSize,
        batchSize,
        channelSize,
        outputChannelSize,
        fpsLimit,
        (await isWebGPUAvailable()) ? 'webgpu' : 'webgl',
      );
    case 'onnx':
      return await ONNXService.createService(
        modelPath,
        gridSize,
        batchSize,
        channelSize,
        outputChannelSize,
        fpsLimit,
        // ignore the backend setting for now
        // since ONNXRuntime doesn't support all ops we are using in webgpu
        // await isWebGPUAvailable() ? 'webgpu' : 'wasm',
      );
    case 'mock':
      return MockModelService.createService(
        modelPath,
        gridSize,
        batchSize,
        channelSize,
        outputChannelSize,
        fpsLimit,
      );
    default:
      throw new Error('Invalid model type');
  }
}

export function modelSerialize(
  url: string,
  model: ModelService | null,
): ModelSave {
  if (model == null) {
    throw new Error(
      'model is null, cannot serialise, check model is initialised or not',
    );
  }
  // export a JSON as ModelSave

  return {
    inputTensor: reshape(model.getInputTensor(), model.getInputShape()),
    mass: model.getMass(),
    modelType: model.getType(),
    modelUrl: url,
    time: new Date().toISOString(),
  };
}

export async function modelDeserialize(
  input: ModelSave,
): Promise<ModelService> {
  // create a model service from a ModelSave object
  // TODO: read the model type from the model definition file
  const modelService = await createModelService(
    input.modelUrl,
    [input.inputTensor[0].length, input.inputTensor[0][0].length],
    input.inputTensor.length,
    input.inputTensor[0][0][0].length,
    input.inputTensor[0][0][0].length,
    15,
  );
  modelService.loadDataArray(input.inputTensor);
  modelService.setMass(input.mass);
  return modelService;
}

export interface ModelSave {
  modelType: string;
  modelUrl: string;
  time: string;
  inputTensor: number[][][][];
  mass: number;
}

function reshape(
  arr: Float32Array,
  shape: [number, number, number, number],
): number[][][][] {
  const [d1, d2, d3, d4] = shape;
  const result = new Array(d1);
  let offset = 0;
  for (let i = 0; i < d1; i++) {
    result[i] = new Array(d2);
    for (let j = 0; j < d2; j++) {
      result[i][j] = new Array(d3);
      for (let k = 0; k < d3; k++) {
        result[i][j][k] = new Array(d4);
        for (let l = 0; l < d4; l++) {
          result[i][j][k][l] = arr[offset++];
        }
      }
    }
  }
  return result;
}

// check if webgpu is available
async function isWebGPUAvailable(): Promise<boolean> {
  if ('gpu' in navigator) {
    const gpu = await navigator.gpu.requestAdapter();
    if (gpu !== null) {
      return true;
    }
  }
  return false;
}
