module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        },
        modules: false
      }
    ],
    '@babel/preset-typescript'
  ],
  plugins: [
    ['module-resolver', {
      alias: {
        '@presentation': './src/adapters/presentation',
        '@repositories': './src/adapters/repositories',
        '@entities': './src/entities',
        '@main': './src/main',
        '@shared': './src/shared',
        '@useCases': './src/useCases'
      }
    }],
    ["babel-plugin-add-import-extension", { extension: "mjs" }]
  ],
  ignore: [
    '**/__tests__'
  ]
}
