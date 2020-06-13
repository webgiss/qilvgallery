import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { uglify } from "rollup-plugin-uglify";

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
        uglify()
    ]
}));