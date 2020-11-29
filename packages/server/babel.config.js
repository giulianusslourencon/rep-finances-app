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
        '@entities': './src/entities',
        '@repositories': './src/repositories',
        '@useCases': './src/useCases'
      }
    }]
  ],
  ignore: [
    '**/*.spec.ts'
  ]
}