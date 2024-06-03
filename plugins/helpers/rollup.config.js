import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import json from "@rollup/plugin-json";
import terser from '@rollup/plugin-terser';

export default [{
  input: 'src/server/index.js',
  output: {
    file: 'dist/server/index.js',
    format: 'esm'
  },
  plugins: [resolve(), commonjs(), json(), terser()]
}, {
  input: 'src/client/index.js',
  output: {
    file: 'dist/client/index.js',
    format: 'esm'
  },
  plugins: [resolve(), commonjs(), json(), terser()]
}];