module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        }
      }
    ],
    '@babel/preset-typescript'
  ],
  plugins: [
    ['module-resolver', {
      alias: {
        '@server': './src',
        '@config': './src/config',
        '@entities': './src/entities',
        '@repositories': './src/repositories',
        '@shared': './src/shared',
        '@useCases': './src/useCases'
      }
    }]
  ],
  ignore: [
    '**/*.spec.ts'
  ]
}