import * as t from "three";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef } from "react";
import vertexShader from "../shaders/vert.glsl";
import fragmentShader from "../shaders/frag.glsl";

class SimulationParams {
  // render options
  densityLowColour: t.Color = new t.Color("blue")
  densityHighColour: t.Color = new t.Color("red")
}

// we will store the parameters in an interface explicitly so
// we can pass the parameter object directly
interface Renderable {
  params: SimulationParams
  worker: Worker
}

// converts a colour to vector3, does not preserve alpha
function colToVec3(col: t.Color): t.Vector3 { return new t.Vector3(col.r, col.g, col.b) }

function DiffusionPlane(props: ThreeElements["mesh"] & Renderable): JSX.Element {
  // INITIALISATION

  // reference to the parent mesh
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const ref = useRef<t.Mesh>(null!);

  // create the shader
  const shaderMat = useMemo(() => {
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

    const shaderMat = new t.ShaderMaterial();
    shaderMat.vertexShader = vertexShader
      // match `${varName}` in shader and replace with values
      .replace(/\$\{(\w+?)\}/g, function (match: any, varName: string) {
        if (renderConfig[varName] !== undefined) {
          return renderConfig[varName];
        }
        return "1.0";
      });
    shaderMat.fragmentShader = fragmentShader;
    // it looks like the uniform is bound to the colours
    // so we dont have to manually resend the uniform every time the colour changes...
    // still needs more experimentation done
    shaderMat.uniforms = {
      density: { value: null },
      hiCol:  { value: colToVec3(props.params.densityHighColour) }, 
      lowCol: { value: colToVec3(props.params.densityLowColour)  }, 
    };

    return shaderMat;
  }, [props.params.densityHighColour, props.params.densityLowColour])

  // HOOKS

  useFrame((state) => {
    // potential performance issue?
    state.camera.setRotationFromAxisAngle(new t.Vector3(1, 0, 0), -Math.PI / 2);
    ref.current.lookAt(0, 99, 0);
  });

  // create a worker and assign it the model computations
  useEffect(() => {
    void (async () => {
      const worker = props.worker
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
      shaderMat.uniforms.density.value = data.slice(32*32);
      shaderMat.uniformsNeedUpdate = true;
    }
  }, [shaderMat, props.worker]);

  return (
    <mesh {...props} ref={ref} material={shaderMat}>
      <planeGeometry args={[2, 2, 31, 31]} />
    </mesh>
  );
}

export { DiffusionPlane, SimulationParams }