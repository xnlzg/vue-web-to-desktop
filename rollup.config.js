import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      exports: 'named',
      sourcemap: true
    },
    {
      file: 'dist/index.esm.js',
      format: 'es',
      exports: 'named',
      sourcemap: true
    }
  ],
  plugins: [
    terser({
      compress: {
        drop_console: false
      }
    })
  ],
  external: ['vue']
};
