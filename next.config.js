/** @type {import("next").NextConfig} */
const CopyPlugin = require("copy-webpack-plugin");

const nextConfig = {
  reactStrictMode: true,
  output: "export",
  images: {
    unoptimized: true,
  },
<<<<<<< Updated upstream
  webpack(config, options) {
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: "./node_modules/onnxruntime-web/dist/ort-wasm.wasm",
            to: "static/chunks/pages",
          },
          {
            from: "./node_modules/onnxruntime-web/dist/ort-wasm-simd.wasm",
            to: "static/chunks/pages",
          },
          {
            from: "./node_modules/onnxruntime-web/dist/ort-wasm-threaded.wasm",
            to: "static/chunks/pages",
          },
          {
            from: "./node_modules/onnxruntime-web/dist/ort-wasm-simd.wasm",
            to: "static/chunks/pages",
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
      process.env.NODE_ENV === "production"
        ? "http://localhost:8000"
        : "http://localhost:3000",
=======

  webpack: ( config, {} ) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      use: {
          loader: 'raw-loader'
      }
    })
    return config
>>>>>>> Stashed changes
  },
};

module.exports = nextConfig;
