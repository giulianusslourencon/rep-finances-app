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
        '@entities': './src/entities',
        '@repositories': './src/external/repositories',
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
