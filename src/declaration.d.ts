declare module '*.css';
declare module '*.glsl';
declare module '*.md';

declare module '*.md' {
  const html: string;
  export default html;
}

declare module 'three/addons/capabilities/WebGPU.js' {
  export default class WebGPU extends object {
    static isAvailable(): boolean;
    static getErrorMessage(): HTMLDivElement;
  }
}
declare module 'three/addons/renderers/webgpu/WebGPURenderer.js' {
  export default class WebGPURenderer extends Renderer {
    constructor(parameters: object);
  }
}
