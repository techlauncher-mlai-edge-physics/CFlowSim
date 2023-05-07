import * as t from "three";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import vertexShader from "../shaders/vert.glsl";
import fragmentShader from "../shaders/frag.glsl";

class SimulationParams {
  // render options
  densityLowColour: t.Vector3 = new t.Vector3(0,0,1)
  densityHighColour: t.Vector3 = new t.Vector3(1,0,0)
}

// we will store the parameters in an interface explicitly so
// we can pass the parameter object directly
interface Renderable {
  params: SimulationParams
}

function DiffusionPlane(props: ThreeElements["mesh"] & Renderable): JSX.Element {
  // INITIALISATION

  // reference to the parent mesh
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const ref = useRef<t.Mesh>(null!);

  // create the shader
  // TODO: move the rest of renderConfig to SimulationParams
  const renderConfig : Record<string, string> = {
    segX: '31.0',
    segY: '31.0',
    width: '2.0',
    height: '2.0',
    segXInt: '32',
    segArea: '1024', 
    densityRangeLow: '0.0',
    densityRangeHigh: '3.0',
    densityRangeSize: '3.0',
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
  // it looks like the uniform is bound to the colours
  // so we dont have to manually resend the uniform every time the colour changes...
  // still needs more experimentation done
  sm.uniforms = {
    density: { value: null },
    hiCol: { value: props.params.densityHighColour }, 
    lowCol: { value: props.params.densityLowColour }, 
  };

  // HOOKS

  useFrame((state) => {
    // potential performance issue?
    state.camera.setRotationFromAxisAngle(new t.Vector3(1, 0, 0), -Math.PI / 2);
    ref.current.lookAt(0, 99, 0);
  });

  // create a worker and assign it the model computations
  useEffect(() => {
    void (async () => {
      const worker = new Worker(
        new URL("../workers/modelWorker", import.meta.url), {
          type: "module",
        }
      );
      worker.postMessage({ func: "init" });
      worker.onmessage = (e) => {
        switch (e.data.type)
        {
          case "init":
            console.log("starting")
            worker.postMessage({ func: "start" })
            break;

          case "output":
            output(e.data.density)
            break;
        }

      };

      worker.onerror = (e) => { console.log(e) };

      console.log("worker created", worker);
    })()

    // SUBSCRIPTIONS

    // update the density uniforms every time
    // output is received
    function output(data: Float32Array): void {
      console.log(data)
      if (data == null)
        return
      sm.uniforms.density.value = data.slice(32*32);
      sm.uniformsNeedUpdate = true;
    }

  }, [sm]);

  return (
    <mesh {...props} ref={ref} material={sm}>
      <planeGeometry args={[2, 2, 31, 31]} />
    </mesh>
  );
}

export { DiffusionPlane, SimulationParams }