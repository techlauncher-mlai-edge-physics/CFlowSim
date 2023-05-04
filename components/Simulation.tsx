import * as t from "three";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import vertexShader from "../shaders/vert.glsl";
import fragmentShader from "../shaders/frag.glsl";

// We could potentially move this into another class if need be
/*
class SimulationParams {
  // render options

  // total discrete number of points along the plane to simualte
  private segmentX: number = 10
  private segmentY: number = 10

  // size of the plane
  private drawSize: t.Vector2 = new t.Vector2(2)

  // range of density values
  private densityRangeLow: number = 0
  private densityRangeHigh: number = 100

  public set segmentX (x:number) {

  }
}
*/
function DiffusionPlane(props: ThreeElements["mesh"]): JSX.Element {
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
    densityRangeHigh: '2.0',
    densityRangeSize: '100.0',
  }

  // create the shader
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

  // create a worker and assign it the model computations
  useEffect(() => {
    void (async () => {
      const worker = new Worker(
        new URL("../workers/modelWorker", import.meta.url),
        {
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
            console.log(e.data);
            sm.uniforms.density.value = e.data;
            sm.uniformsNeedUpdate = true;
            break;
        }

      };
      worker.onerror = (e) => {
        console.log(e);
      };

      console.log("worker created", worker);

      // setWorker(worker);
      console.log("worker created");
    })()
  }, [sm]);

// 

  return (
    <mesh {...props} ref={ref} material={sm}>
      <planeGeometry args={[2, 2, 9, 9]} />
    </mesh>
  );
}

export { DiffusionPlane }