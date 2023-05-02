import * as t from "three";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import React, { useRef } from "react";
import vertexShader from "../shaders/vert.glsl";
import fragmentShader from "../shaders/frag.glsl";
import ModelService from "../services/modelService";
// import TestModel from '../services/testModelService';

export function DiffusionPlane(props: ThreeElements["mesh"]): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const ref = useRef<t.Mesh>(null!);
  useFrame((state) => {
    // potential performance issue?
    state.camera.setRotationFromAxisAngle(new t.Vector3(1, 0, 0), -Math.PI / 2);
    ref.current.lookAt(0, 99, 0);
  });

  // TODO: make plane into same dimension in segment as model output
  // TODO: change plane geometry to custom geometry if we want "bumps" in height,
  //       or we can leave it in plane if we don't do this

  // TODO: make config a property and be able to change it later
  //       when changing shader
  const renderConfig : Record<string, string> = {
    segX: '9.0',
    segY: '9.0',
    width: '2.0',
    height: '2.0',
    segXInt: '10',
    segArea: '4096', // TODO:
    densityRangeLow: '0.0',
    densityRangeHigh: '100.0',
    densityRangeSize: '100.0',
  }

  const sm = new t.ShaderMaterial();
  sm.vertexShader = vertexShader
    // match `${varName}` in shader and replace with values
    .replace(/\$\{(\w+?)\}/g, function (match: any, varName: string) {
      if (renderConfig[varName] !== undefined) {
        return renderConfig[varName];
      }
      return "1.0";
    });
  sm.fragmentShader = fragmentShader;
  sm.uniforms = {
    density: { value: null },
  };

  const modelPath = "../_next/static/chunks/pages/model/bno_small.onnx";
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  const dataPath = `${process.env.BASE_PATH}/pvf_incomp_44.json`;
  void ModelService.createModelService(modelPath, [64, 64], 10).then(
    (modelService) => {
      modelService.bindOutput(output);
      void modelService.initMatrixFromPath(dataPath).then(() => {
        void modelService.startSimulation();
      });
    }
  );

  // we'll create a deliberately larger advection to test slicing on the CPU
  // const tm = new TestModel(64) 
  // tm.bindOutput(output)
  // void tm.startSimulation()

  return (
    <mesh {...props} ref={ref} material={sm}>
      <planeGeometry args={[2, 2, 9, 9]} />
    </mesh>
  );

  function output(data: Float32Array): void {
    // we'll truncate the density map for now until we optimise the render
    const chop = data.slice(0, 10*10*3); 
    sm.uniforms.density.value = chop;
    sm.uniformsNeedUpdate = true;
  }
}
