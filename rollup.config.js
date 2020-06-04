import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
// import babelrc from 'babelrc-rollup';
import { uglify } from "rollup-plugin-uglify";

export default [{
    input: 'src/bootConfig.js',
    output: {
        file: 'dist/config.js',
        format: 'cjs'
    },
    plugins: [
        resolve(),
        babel({include:'src/**'}),
        uglify()
    ]
},{
    input: 'src/boot.js',
    output: {
        file: 'dist/gallery.js',
        format: 'cjs'
    },
    plugins: [
        resolve(),
        babel({include:'src/**'}),
        uglify()
    ]
}];