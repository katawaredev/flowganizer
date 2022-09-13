const react = require("@vitejs/plugin-react");
const { defineConfig } = require("vite");
const { default: tsconfigPaths } = require("vite-tsconfig-paths");

module.exports = defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./config/vitest/setup-test-env.ts"],
  },
});
