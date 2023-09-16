import { type Vector2 } from 'three';
import { TfjsService } from './TfjsService';
import ONNXService from './ONNXService';

export interface ModelService {
  startSimulation: () => void;
  pauseSimulation: () => void;
  bindOutput: (callback: (data: Float32Array) => void) => void;
  getInputTensor: () => Float32Array;
  updateForce: (pos: Vector2, forceDelta: Vector2) => void;
  loadDataArray: (array: number[][][][]) => void;
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
  // detect the model type
  // TODO: read the model type from the model definition file
  const modelType = modelPath.split('.').pop();
  switch (modelType) {
    case 'json':
      return await TfjsService.createService(
        modelPath,
        gridSize,
        batchSize,
        channelSize,
        outputChannelSize,
        fpsLimit,
      );
    case 'onnx':
      return await ONNXService.createService(
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

interface ModelData {
  name: string;
  inputTensor: Float32Array;
}

export function modelSerialize(model: ModelService | null): string {
  if (model == null) return '';

  const data: ModelData = {
    name: 'test',
    inputTensor: model.getInputTensor(),
  };
  return JSON.stringify(data);
}

export async function modelDeserialize(_input: string): Promise<ModelService> {
  return await createModelService('/model/bno_small_001.onnx');
}