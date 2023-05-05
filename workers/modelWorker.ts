// a worker that can control the modelService via messages

import ModelService from "../services/modelService";

let modelService: ModelService | null = null;

export function onmessage(this: any, event: MessageEvent): void {
  const data = event.data;
  if (data == null) {
    throw new Error("data is null");
  }
  if (data.func == null) {
    throw new Error("data.type is null");
  }
  console.log("worker received message", data);
  switch (data.func) {
    case "init":
      if (modelService == null) {
        initModelService(this)
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
    case "updateForce":
      if (modelService == null) {
        throw new Error("modelService is null");
      }
      modelService.updateForce(data.args.loc, data.args.forceDelta);
  }
}

self.onmessage = onmessage;

async function initModelService(event: any): Promise<ModelService> {
  const modelPath = "../chunks/pages/model/bno_small.onnx";
  const dataPath = `${process.env.BASE_PATH}/initData/pvf_incomp_44_0.json`;
  const outputCallback = (output: Float32Array): void => {
    const density = new Float32Array(output.length / 3);
    for (let i = 0; i < density.length; i++) {
      density[i] = output[i * 3];
    }
    event.postMessage({ type: "output", density });
  };
  const modelService = await ModelService.createModelService(
    modelPath,
    [64, 64],
    1
  );
  modelService.bindOutput(outputCallback);
  await modelService.initMatrixFromPath(dataPath);
  return modelService;
}
