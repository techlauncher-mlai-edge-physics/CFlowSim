/** @type {import("next").NextConfig} */
const CopyPlugin = require("copy-webpack-plugin");

const nextConfig = {
  reactStrictMode: true,
  output: "export",
  images: {
    unoptimized: true,
  },
  webpack(config, options) {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      use: {
        loader: "raw-loader",
      },
    });
    if (process.env.NODE_ENV === "development") {
      config.optimization.minimize = false;
    }
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: "./node_modules/onnxruntime-web/dist/ort-wasm.wasm",
            to: "public",
          },
          {
            from: "./node_modules/onnxruntime-web/dist/ort-wasm-simd.wasm",
            to: "public",
          },
          {
            from: "./node_modules/onnxruntime-web/dist/ort-wasm-threaded.wasm",
            to: "public",
          },
          {
            from: "./model",
            to: "static/chunks/pages/model",
          },
        ],
      })
    );
    return config;
  },
  env: {
    BASE_PATH:
      process.env.NODE_ENV === "development"
        ? "http://localhost:8000"
        : "https://techlauncher-mlai-edge-physics.github.io",
  },
};

module.exports = nextConfig;
