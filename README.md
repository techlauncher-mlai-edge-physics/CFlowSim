# Physics In The Browser

**Deployed at [GitHub Action](https://techlauncher-mlai-edge-physics.github.io)**

This project is a web application that allows users to simulate the fluid dynamics of a 2D fluid system enhanced by machine learning. The application is built using [React](https://reactjs.org/) and [Three.js](https://threejs.org/). The machine learning model is built using [PyTorch](https://pytorch.org/) and converted to [ONNX](https://onnx.ai/) format for inference in the browser using [onnxruntime-web](https://npmjs.com/package/onnxruntime-web).

## Getting Started

The public deployment of the application can be found at [GitHub Action](https://techlauncher-mlai-edge-physics.github.io). To build and run the application locally, follow the instructions below.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18.0.0 or later has been tested, volta config is included in package.json)

### Installation

1. Clone the repo

   ```sh
   git clone --depth 1 https://github.com/techlauncher-mlai-edge-physics/physics_in_the_browser.git
   ```

2. Install NPM packages

   ```sh
   npm install
   ```

   or if you wish to help develop the application, install the development packages

   ```sh
   npm install --include=dev
   ```

3. Build the application

   ```sh
   npm run build
   ```

   The built application will be in the `out` folder.

   **For development**, you can run the application in `dev` command

   ```sh
   npm run dev
   ```

   The application will be served at `localhost:8000`. However, dynamic reloading is not supported, as `onnxruntime-web` is incompatible with nodejs environment. So current workaround is to wrap build command in `dev` command.

## Relavent Work

To Do

## License

Distributed under the _placeholder_ License. See `LICENSE` for more information.
