import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";
import react from "@vitejs/plugin-react-swc";
import remarkRehypePlugin from "vite-plugin-remark-rehype";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), glsl(), remarkRehypePlugin()],
});
