// a worker that can control the modelService via messages

import ModelService from "../services/modelService";

let modelService: ModelService | null = null;

export function onmessage(this: any, event: MessageEvent): void {
  const data = event.data;
  if (data == null) {
    throw new Error("data is null");
  }
  if (data.type == null) {
    throw new Error("data.type is null");
  }
  console.log("worker received message", data);
  switch (data.type) {
    case "init":
      if (modelService == null) {
        initModelService()
          .then((service) => {
            modelService = service;
            this.postMessage({ type: "init" });
          })
          .catch((e) => {
            console.error("error in initModelService", e);
          });
      }
      break;
    case "start":
      if (modelService == null) {
        throw new Error("modelService is null");
        }
        
      modelService.startSimulation().catch((e) => {
        console.error("error in startSimulation", e);
      });
      break;
    case "pause":
      if (modelService == null) {
        throw new Error("modelService is null");
      }
      modelService.pauseSimulation();
          break;
      
  }
}

self.onmessage = onmessage;

async function initModelService(): Promise<ModelService> {
  const modelPath = "../_next/static/chunks/pages/model/bno_small.onnx";
  const dataPath = `${process.env.BASE_PATH}/pvf_incomp_44.json`;
  const outputCallback = (output: Float32Array): void => {
    postMessage({ type: "output", output });
  };
  const modelService = await ModelService.createModelService(
    modelPath,
    [64, 64],
    10
  );
  modelService.bindOutput(outputCallback);
  await modelService.initMatrixFromPath(dataPath);
  return modelService;
}
