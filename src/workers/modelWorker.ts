// a worker that can control the modelService via messages

import { type Vector2 } from 'three';
import {
  type ModelService,
  type ModelSave,
  createModelService,
  modelSerialize,
  // modelDeserialize
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
        const [path, base] = data.args as [string, string];
        const url = new URL(path, base)
        // fetch the data
        console.log("FETCHING");
        const fetchFunc = async (dataPath: URL): Promise<number[][][][]> => {
          return (await fetch(dataPath).then(
            async (res) => await res.json(),
          )) as number[][][][];
        }

        initModelService<URL>(this, url, fetchFunc)
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

    case 'serialize':
      this.postMessage({
        type: 'modelSave',
        save: workerSerialize()
      });
      break;
    case 'deserialize':
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

// serialise the current model service
function workerSerialize(): ModelSave {
  // return a modelsave with the current model
  if (modelService == null)
    throw new Error('modelService is null, cannot serialise');
  // TODO: implement a way to change the model path
  const modelPath = '/model/bno_small_001.onnx';
  const save = modelSerialize(modelPath, modelService)
  if (save == null)
    throw new Error('something went wrong during model serialisation')
  return save
}

async function initModelService<T>(
  event: DedicatedWorkerGlobalScope,
  initialDataPath: T,
  fetchData: (dataPath: T) => Promise<number[][][][]>,
  modelPath: string = '/model/bno_small_001.onnx',
): Promise<ModelService> {
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
  const data = await fetchData(initialDataPath)
  modelService.loadDataArray(data);
  return modelService;
}
