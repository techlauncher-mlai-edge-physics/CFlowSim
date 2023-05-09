import * as t from "three";
import { useFrame, type ThreeElements, type ThreeEvent } from "@react-three/fiber";
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
  disableInteraction: boolean
}

// converts a colour to vector3, does not preserve alpha
function colToVec3(col: t.Color): t.Vector3 { return new t.Vector3(col.r, col.g, col.b) }

function DiffusionPlane(props: ThreeElements["mesh"] & Renderable): React.ReactElement {
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
      width: '10.0',
      height: '8.0',
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

    // provide a dummy density field first

    // TODO: until we standardise parameters a bit more we'll hardcode
    // an advection size of 32*32
    const initDensity = new Float32Array(new Array(32*32).fill(1))

    shaderMat.uniforms = {
      density: { value: initDensity },
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
  const { worker } = props
  useEffect(() => {
    void (async () => {
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

  const { disableInteraction } = props;
  let pointMoved = false;
  let trackMove = false;
  const prevPointPos = new t.Vector2(0, 0);
  const pointPos = new t.Vector2(0, 0);
  const pointDown = (e:ThreeEvent<PointerEvent>): void => {
    if (e.uv == null) return;
    pointMoved = false;
    trackMove = true;
    // make top left corner (0,0)
    prevPointPos.set(e.uv.x, 1 - e.uv.y);
  }
  const pointMove = (e:ThreeEvent<PointerEvent>): void => {
    if (!trackMove) return;
    if (e.uv == null) return;
    pointMoved = true;
    pointPos.set(e.uv.x, 1 - e.uv.y);
  }
  const pointUp = (e:ThreeEvent<PointerEvent>): void => {
    pointMoved = false;
    trackMove = false;
  }
  // 30 fps force update for now
  const forceInterval = 1000 / 30;
  // should be in config
  const forceMul = 100
  // grid size of model, should be changed with config
  const gridSize = new t.Vector2(32, 32)
  setInterval(()=>{
    if (disableInteraction) return;
    if (!pointMoved) return;
    const forceDelta = (new t.Vector2).subVectors(pointPos, prevPointPos).multiplyScalar(forceMul);
    const loc = (new t.Vector2).add(pointPos).multiply(gridSize).round();
    prevPointPos.set(pointPos.x, pointPos.y);
    pointMoved = false;
    console.log('[event] Applying force', forceDelta, 'at', loc);
    // call model with param
    worker.postMessage({
      func: 'updateForce',
      args: {
        loc,
        forceDelta
      }
    });
  }, forceInterval);

  return (
    <mesh {...props} ref={ref} material={shaderMat}
      onPointerUp={pointUp}
      onPointerDown={pointDown}
      onPointerMove={pointMove} >
      <planeGeometry args={[10, 8, 31, 31]} />
    </mesh>
  );
}

export { DiffusionPlane, SimulationParams }