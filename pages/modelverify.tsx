import css from "../styles/Home.module.css";
import ModelService from "../services/modelService";
export default function Home(): JSX.Element {
  const modelPath = "../_next/static/chunks/pages/model/bno_small.onnx";
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  const dataPath = `${process.env.BASE_PATH}/pvf_incomp_44.json`;
  const outputCallback = (output: Float32Array): void => {
    console.log(output);
  };
  void ModelService.createModelService(modelPath, [64, 64], 10).then(
    (modelService) => {
      modelService.bindOutput(outputCallback);
      void modelService.initMatrixFromPath(dataPath).then(() => {
        void modelService.startSimulation();
      });
    }
  );
  return (
    <div className={css.scene}>
      {/* write a simple discreption here */}
      <h1 className={css.title}>Model Verification</h1>
      <div className={css.description}>
        <p> simulation draft </p>
        <p> Get started by opening console</p>
      </div>
    </div>
  );
}
