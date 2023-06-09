/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { RollupOptions } from 'rollup';
import dts from 'rollup-plugin-dts';
import external from 'rollup-plugin-peer-deps-external';
import pkg from './package.json' assert { type: 'json' };
/**
* Comment with library information to be appended in the generated bundles.
*/
const banner = `/**
* ${pkg.name} ${pkg.version}
* (c) ${pkg.author.name} ${pkg.author.email}
* Released under the ${pkg.license} License.
*/
`.trim();

const options: RollupOptions =
{
    input: 'src/index.ts',
    output: [
        {
            banner,
            file: './dist/esm/index.js',
            format: 'esm',
            sourcemap: true
        },
        {
            banner,
            file: './dist/esm/index.min.js',
            format: 'esm',
            sourcemap: true,
            plugins: [terser()]
        },
        {
            banner,
            file: './dist/system/index.js',
            format: 'system',
            sourcemap: true
        },
        {
            banner,
            file: './dist/system/index.min.js',
            format: 'system',
            sourcemap: true,
            plugins: [terser()]
        }
    ],
    plugins: [
        external() as unknown as Plugin,    // I think the definition is out of date.
        resolve(),
        typescript({ tsconfig: './tsconfig.json' })
    ]
};
export default [
    options,
    {
        input: './dist/esm/types/src/index.d.ts',
        output: [{ file: pkg.types, format: "esm" }],
        plugins: [dts()],
    }
];