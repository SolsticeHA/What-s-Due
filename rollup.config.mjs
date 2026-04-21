import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

const isWatch = process.env.ROLLUP_WATCH === "true";

export default {
  input: "src/whats-due-panel.ts",
  output: {
    file: "custom_components/whats_due/frontend/whats-due-panel.js",
    format: "es",
    sourcemap: isWatch,
    inlineDynamicImports: true,
  },
  plugins: [
    resolve({ browser: true }),
    commonjs(),
    typescript({
      tsconfig: "./tsconfig.json",
      outDir: "custom_components/whats_due/frontend",
      outputToFilesystem: false,
    }),
    !isWatch && terser({ format: { comments: false } }),
  ].filter(Boolean),
};
