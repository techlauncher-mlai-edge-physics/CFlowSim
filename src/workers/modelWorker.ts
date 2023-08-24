// a worker that can control the modelService via messages

import { Vector2 } from 'three';
import ModelService from '../services/modelService';
import { IncomingMessage } from './modelWorkerMessage';

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
    case 'getFullMatrix':
      if (modelService == null) {
        throw new Error('modelService is null');
      }
      this.postMessage({
        type: 'fullMatrix',
        matrix: modelService.getFullMatrix(),
      });
      break;
    case 'getDensity':
      if (modelService == null) {
        throw new Error('modelService is null');
      }
      this.postMessage({
        type: 'density',
        density: modelService.getDensity(),
      });
      break;
    default:
      throw new Error(`unknown func ${data.func}`);
  }
}
function updateForce(args: UpdateForceArgs) {
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
  const dataPath = new URL('/initData/pvf_incomp_44_nonneg/pvf_incomp_44_nonneg_0.json', import.meta.url);
  const outputCallback = (output: Float32Array): void => {
    const density = new Float32Array(output.length / 3);
    for (let i = 0; i < density.length; i++) {
      density[i] = output[i * 3];
    }
    event.postMessage({ type: 'output', density });
  };
  const modelService = await ModelService.createModelService(
    modelPath,
    [64, 64],
    1,
  );
  modelService.bindOutput(outputCallback);
  await modelService.initMatrixFromPath(dataPath);
  return modelService;
}
