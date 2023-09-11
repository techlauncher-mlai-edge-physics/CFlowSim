declare module '*.css';
declare module '*.glsl';
declare module '*.md';

declare module '*.md' {
  const html: string;
  export default html;
}

declare module 'three/addons/capabilities/WebGPU.js' {
  export class WebGPU {
    static isAvailable(): boolean;
    static getErrorMessage(): HTMLDivElement;
  }
}
declare module 'three/addons/renderers/webgpu/WebGPURenderer.js' {
  export class WebGPURenderer {
    constructor( parameters: map<string, object> );
  }
}
