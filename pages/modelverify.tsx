import * as THREE from "three";
import css from "../styles/Home.module.css";
import { Canvas, useFrame, type ThreeElements } from "@react-three/fiber";
import { MapControls } from "@react-three/drei";
import React, { useRef } from "react";
import ModelService from "../services/modelService";

const vertexShader = `
attribute vec3 aColor;
varying lowp vec4 vColor;

void main(void) {
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  vColor = vec4(aColor, 1.0);
}
`;

const fragmentShader = `
varying lowp vec4 vColor;

void main(void) {
  gl_FragColor = vColor;
}
`;

function Plane(props: ThreeElements["mesh"]) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const ref = useRef<THREE.Mesh>(null!);
  const colorBuf = new THREE.BufferAttribute(
    new Float32Array([
      1.0,
      0.0,
      0.0, // FF0000
      1.0,
      1.0,
      1.0, // FFFFFF
      1.0,
      1.0,
      1.0, // FFFFFF
      0.0,
      0.0,
      1.0, // 0000FF
    ]),
    3
  );
  useFrame((state) => {
    // potential performance issue?
    state.camera.setRotationFromAxisAngle(
      new THREE.Vector3(1, 0, 0),
      -Math.PI / 2
    );
    ref.current.lookAt(0, 99, 0);
    ref.current.geometry.setAttribute("aColor", colorBuf);
  });
  // TODO: make plane into same dimension in segment as model output
  // TODO: change plane geometry to custom geometry if we want "bumps" in height,
  //       or we can leave it in plane if we don't do this
  return (
    <mesh {...props} ref={ref}>
      <planeGeometry args={[2, 2, 1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}

export default function Home() {
  const modelPath = "../_next/static/chunks/pages/model/bno_small.onnx";
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  const dataPath = `${process.env.BASE_PATH}/pvf_incomp_44.json`;
  const outputCallback = (output: Float32Array) => {
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
      <Canvas
        shadows
        className={css.canvas}
        camera={{
          position: [1, 10, 1],
        }}
      >
        <ambientLight />
        <Plane position={[0, 0, 0]} />
        {/* <Floor /> */}
        <MapControls />
      </Canvas>
    </div>
  );
}
