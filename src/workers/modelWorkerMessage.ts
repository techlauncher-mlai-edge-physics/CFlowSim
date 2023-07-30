export interface IncomingMessage {
  func: string;
  args?: unknown;
}
export interface OutgoingMessage {
  type: string;
  density?: Float32Array;
  success: boolean;
  matrix?: Float32Array;
}
