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
        const [dataPath, modelurl] = data.args as [
          string,
          string,
        ];
        getServiceFromInitCond(this, dataPath, modelurl)
          .then((service) => {
            modelService = service;
            this.postMessage({ type: 'init', success: true });
          })
          .catch((e) => {
            console.error('error in createNewModelService', e);
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
        save: workerSerialize(),
      });
      break;
    case 'deserialize':
      if (modelService == null) throw new Error('modelService is null');
      modelService.pauseSimulation();
      getServiceFromSave(this, data.args as ModelSave)
        .then((ms) => {
          modelService = ms;
          console.log('successfully restored model service with', ms);
          modelService.startSimulation();
          this.postMessage({ type: 'deserialize', success: true });
        })
        .catch((e) => {
          throw new Error(`something went wrong with deserialisation ${e}`);
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

// serialise the current model service
export function workerSerialize(): ModelSave {
  // return a modelsave with the current model
  if (modelService == null)
    throw new Error('modelService is null, cannot serialise');
  // TODO: implement a way to change the model path
  const modelPath = '/model/bno_small_001.onnx';
  const save = modelSerialize(modelPath, modelService);
  if (save == null)
    throw new Error('something went wrong during model serialisation');
  return save;
}

// create a model service and restore
// all of its state from a ModelSave
async function getServiceFromSave(
  event: DedicatedWorkerGlobalScope,
  save: ModelSave,
): Promise<ModelService> {
  const modelService = await createModelService(save.modelUrl, [64, 64], 1);
  bindCallback(event, modelService);
  // restore previous state
  modelService.loadDataArray(save.inputTensor);
  modelService.setMass(save.mass);
  return modelService;
}

// create a new model service and load the data array
// from a file containing initial conditions
async function getServiceFromInitCond(
  event: DedicatedWorkerGlobalScope,
  dataPath: string,
  modelPath: string,
): Promise<ModelService> {
  const modelService = await createModelService(modelPath, [64, 64], 1);
  bindCallback(event, modelService);
  // fetch the data
  // check the content type
  // dataPath should be start with /initData/ and end with .json
  if (!dataPath.startsWith('/initData/') || !dataPath.endsWith('.json')) {
    throw new Error(`invalid data path ${dataPath}`);
  }

  const response = await fetch(dataPath);
  if (!response.ok) {
    throw new Error(`failed to fetch data from ${dataPath}`);
  }
  const contentType = response.headers.get('content-type');
  if (contentType != null && !contentType.startsWith('application/json')) {
    throw new Error(`invalid content type ${contentType}`);
  }
  const data = await response.json();
  modelService.loadDataArray(data);
  return modelService;
}

// bind this worker's output callback to a service
function bindCallback(
  event: DedicatedWorkerGlobalScope,
  modelService: ModelService,
): void {
  const outputCallback = (output: Float32Array): void => {
    const density = new Float32Array(output.length / 3);
    for (let i = 0; i < density.length; i++) {
      density[i] = output[i * 3];
    }
    event.postMessage({ type: 'output', density });
  };
  modelService.bindOutput(outputCallback);
}
