// a worker that can control the modelService via messages

import { type Vector2 } from 'three';
import {
  type ModelService,
  createModelService,
} from '../services/model/modelService';
import { type IncomingMessage } from './modelWorkerMessage';

let modelService: ModelService | null = null;

interface UpdateForceArgs {
  loc: Vector2;
  forceDelta: Vector2;
}

export function onmessage(
  this: DedicatedWorkerGlobalScope,
  event: MessageEvent,
): void {
  const data = event.data as IncomingMessage;
  if (data == null) {
    throw new Error('data is null');
  }
  if (data.func == null) {
    throw new Error('data.type is null');
  }
  console.log('worker received message', data);
  switch (data.func) {
    case 'init':
      if (modelService == null) {
        initModelService(this)
          .then((service) => {
            modelService = service;
            this.postMessage({ type: 'init', success: true });
          })
          .catch((e) => {
            console.error('error in initModelService', e);
          });
      }
      break;
    case 'start':
      if (modelService == null) {
        throw new Error('modelService is null');
      }
      modelService.startSimulation();
      break;
    case 'pause':
      if (modelService == null) {
        throw new Error('modelService is null');
      }
      modelService.pauseSimulation();
      break;
    case 'updateForce':
      updateForce(data.args as UpdateForceArgs);
      break;
    case 'getInputTensor':
      if (modelService == null) {
        throw new Error('modelService is null');
      }
      this.postMessage({
        type: 'inputTensor',
        tensor: modelService.getInputTensor(),
      });
      break;
    default:
      throw new Error(`unknown func ${data.func}`);
  }
}
function updateForce(args: UpdateForceArgs): void {
  if (modelService == null) {
    throw new Error('modelService is null');
  }
  modelService.updateForce(args.loc, args.forceDelta);
}

self.onmessage = onmessage;

async function initModelService(
  event: DedicatedWorkerGlobalScope,
): Promise<ModelService> {
  const modelPath = '/model/bno_small_001.onnx';
  const dataPath = new URL(
    '/initData/pvf_incomp_44_nonneg/pvf_incomp_44_nonneg_0.json',
    import.meta.url,
  );
  const outputCallback = (output: Float32Array): void => {
    const density = new Float32Array(output.length / 3);
    for (let i = 0; i < density.length; i++) {
      density[i] = output[i * 3];
    }
    event.postMessage({ type: 'output', density });
  };
  const modelService = await createModelService(modelPath, [64, 64], 1);
  modelService.bindOutput(outputCallback);
  // fetch the data
  const data = (await fetch(dataPath).then(async (res) =>
    await res.json(),
  )) as number[][][][];
  modelService.loadDataArray(data);
  return modelService;
}

interface ModelData {
  name: string;
  inputTensor: Float32Array;
}

export function modelSerialize(model : ModelService | null) : string {
  if (model == null)
    return ""

  const data: ModelData = {
    name: "test",
    inputTensor: model.getInputTensor()
  }
  return JSON.stringify(data);
}

export function modelDeserialize(input: string): Promise<ModelService>
{
  return new Promise((_, __) => JSON.parse(input) as ModelData)
}
