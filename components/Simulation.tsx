import * as t from 'three';
import { useFrame, ThreeElements } from "@react-three/fiber";
import React, { useRef, useState } from 'react';
import vertexShader from "../shaders/vert.glsl"
import fragmentShader from "../shaders/frag.glsl"
import Engine from '../extern/Engine';

class TestEngine implements Engine {
  callback: (data: Float32Array) => void
  advectionSize: number

  constructor(size : number) {
    this.callback = () => {}
    this.advectionSize = size;
  }

  updateForce(pos: t.Vector2, forceDelta: t.Vector2): void {
  }

  async startSimulation(): Promise<void> {
    const x = new Float32Array(this.advectionSize*this.advectionSize)
    for (let i = 0; i < this.advectionSize*this.advectionSize; i++) 
      x[i] = i; //i/(this.advectionSize*this.advectionSize); // arbitrary densities
    this.callback(x)
  }

  bindOutput(callback: (data: Float32Array) => void): void {
    this.callback = callback
  }
}


export function DiffusionPlane(props: ThreeElements['mesh']) {
  const ref = useRef<t.Mesh>(null!);
  const colorBuf = new t.BufferAttribute(
    new Float32Array([
      1.0, 0.0, 0.0, // FF0000
      1.0, 1.0, 1.0, // FFFFFF
      1.0, 1.0, 1.0, // FFFFFF
      0.0, 0.0, 1.0, // 0000FF
    ]),
    3
  );
  useFrame((state) => {
    // potential performance issue?
    state.camera.setRotationFromAxisAngle(new t.Vector3(1, 0, 0), -Math.PI/2);
    ref.current.lookAt(0, 99, 0);
    ref.current.geometry.setAttribute('aColor', colorBuf);
  });

  // TODO: make plane into same dimension in segment as model output
  // TODO: change plane geometry to custom geometry if we want "bumps" in height,
  //       or we can leave it in plane if we don't do this

  let sm = new t.ShaderMaterial();
  sm.vertexShader = vertexShader
  sm.fragmentShader = fragmentShader
  sm.uniforms = {
    density: { value: null }
  }

  const engine = new TestEngine(10)
  engine.bindOutput(output)
  engine.startSimulation()

  return (
    <mesh {...props} ref={ref} material={sm}>
      <planeGeometry args={[2, 2, 10, 10]}/>
    </mesh>
  );

  function output(data: Float32Array) {
    //sm.uniforms.tex0.value = data;
    sm.uniforms.density.value = new t.BufferAttribute(data, 1);
    console.log(data)
  }
}

