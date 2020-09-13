import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import { terser } from "rollup-plugin-terser"

const sources=['config', 'gallery'];

export default sources.map((source) => ({
    input: `src/boot-${source}.js`,
    output: {
        file: `dist/${source}.js`,
        format: 'cjs'
    },
    plugins: [
        resolve(),
        babel(),
        terser()
    ]
}));
