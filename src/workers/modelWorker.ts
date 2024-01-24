// a worker that can control the modelService via messages

import {
  createModelService,
  type ModelSave,
  modelSerialize,
  type ModelService,
} from '../services/model/modelService';
import {
  type DeserializeArgs,
  type IncomingMessage,
  type InitArgs,
  type UpdateForceArgs,
  RunnerFunc,
} from './modelWorkerMessage';
import AutoSaveService from '../services/autoSave/autoSaveService';
import Ajv, { type JSONSchemaType } from 'ajv';

let modelService: ModelService | null = null;
let autoSaveService: AutoSaveService | null = null;
let modelUrl: string = '';

const modelSaveSchema: JSONSchemaType<ModelSave> = {
  type: 'object',
  properties: {
    modelType: { type: 'string' },
    modelUrl: { type: 'string' },
    time: { type: 'string' },
    inputTensor: {
      type: 'array',
      items: {
        type: 'array',
        items: {
          type: 'array',
          items: {
            type: 'array',
            items: { type: 'number' },
          },
        },
      },
    },
    mass: { type: 'number' },
  },
  required: ['modelType', 'modelUrl', 'inputTensor', 'mass'],
  additionalProperties: false,
};
const ajv = new Ajv();
const modelSaveSchemaValidator = ajv.compile(modelSaveSchema);

export function onmessage(
  this: DedicatedWorkerGlobalScope,
  event: MessageEvent,
): void {
  const data = event.data as IncomingMessage;
  if (data == null) {
    throw new Error('data is null');
  }
  console.log('worker received message', data);
  switch (data.func) {
    case RunnerFunc.INIT:
      if (modelService == null) {
        const { modelPath, initConditionPath } = data.args as InitArgs;
        modelUrl = modelPath;
        getServiceFromInitCond(this, initConditionPath, modelPath)
          .then((service) => {
            modelService = service;
            autoSaveService = new AutoSaveService(() => {
              return modelSerialize(modelPath, modelService);
            });
            this.postMessage({ type: 'init', success: true });
          })
          .catch((e) => {
            console.error('error in createNewModelService', e);
          });
      }
      break;
    case RunnerFunc.START:
      if (modelService == null) {
        throw new Error('modelService is null');
      }
      modelService.startSimulation();
      if (autoSaveService != null) {
        try {
          autoSaveService.startAutoSave();
        } catch (e) {
          // if error is not ready, retry in 1 second
          const error = e as Error;
          if (error.message === 'IndexedDB not ready') {
            setTimeout(() => {
              autoSaveService?.startAutoSave();
            }, 500);
          } else {
            throw e;
          }
        }
      }
      break;
    case RunnerFunc.PAUSE:
      if (modelService == null) {
        throw new Error('modelService is null');
      }
      modelService.pauseSimulation();
      if (autoSaveService != null) {
        autoSaveService.pauseAutoSave();
      }
      break;
    case RunnerFunc.UPDATE_FORCE:
      updateForce(data.args as UpdateForceArgs);
      break;
    case RunnerFunc.SERIALIZE:
      this.postMessage({
        type: 'modelSave',
        save: workerSerialize(),
      });
      break;
    case RunnerFunc.DESERIALIZE: {
      // if (modelService == null) throw new Error('modelService is null');
      // modelService.pauseSimulation();
      const { savedState } = data.args as DeserializeArgs;
      let possibleSave: ModelSave;
      if (typeof savedState === 'string') {
        possibleSave = JSON.parse(savedState);
        if (!modelSaveSchemaValidator(possibleSave)) {
          throw new Error('invalid modelSave');
        }
      } else {
        possibleSave = savedState;
      }
      getServiceFromSave(this, possibleSave)
        .then((ms) => {
          modelService = ms;
          console.log('successfully restored model service with', ms);
          this.postMessage({ type: 'deserialize', success: true });
        })
        .catch((e) => {
          throw new Error(`something went wrong with deserialisation ${e}`);
        });
      break;
    }
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
  const save = modelSerialize(modelUrl, modelService);
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
  console.log('restoring model service from', save);
  const modelService = await createModelService(save.modelUrl, [64, 64], 1);
  modelUrl = save.modelUrl;
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
  const cache: Float32Array[] = [];
  const outputCallback = (output: Float32Array): void => {
    console.log('outputCallback', output);
    const density = new Float32Array(output.length / 3);
    for (let i = 0; i < density.length; i++) {
      density[i] = output[i * 3];
    }
    cache.push(density);
  };
  setInterval(() => {
    console.log('cache', cache);
    if (cache.length > 0) {
      event.postMessage({ type: 'output', density: cache });
      cache.splice(0, cache.length);
    }
  }, 1000);
  modelService.bindOutput(outputCallback);
}
