import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';
import react from '@vitejs/plugin-react-swc';
import { plugin as mdPlugin, Mode } from 'vite-plugin-markdown';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    glsl(),
    mdPlugin({
      mode: [Mode.REACT],
    }),
  ],
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
    },
  },
  build: {
    target: 'esnext',
  },
});
