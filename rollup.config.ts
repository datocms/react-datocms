import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json";

export default {
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
    },
    {
      file: pkg.module,
      format: "es",
    },
  ],
  external: [
    "react",
    "intersection-observer",
    "react-intersection-observer",
    "datocms-listen",
    "use-deep-compare-effect",
    "datocms-structured-text-generic-html-renderer",
    "datocms-structured-text-utils",
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      useTsconfigDeclarationDir: true,
      tsconfig: "tsconfig.esnext.json",
    }),
  ],
};
