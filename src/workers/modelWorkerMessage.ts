import { type ModelSave } from '../services/model/modelService';
import { type Vector2 } from 'three';

export interface IncomingMessage {
  func: RunnerFunc;
  args?: InitArgs | DeserializeArgs | UpdateForceArgs;
}

export enum RunnerFunc {
  INIT,
  START,
  PAUSE,
  DESERIALIZE,
  UPDATE_FORCE,
  SERIALIZE,
}

export interface InitArgs {
  modelPath: string;
  initConditionPath: string;
}

export interface DeserializeArgs {
  savedState: string; // need ajv validation
}

export interface UpdateForceArgs {
  loc: Vector2;
  forceDelta: Vector2;
}

export interface OutgoingMessage {
  type: string;
  density?: Float32Array[];
  success: boolean;
  matrix?: Float32Array;
  save?: ModelSave;
}
