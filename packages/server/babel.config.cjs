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
        '@shared': './src/shared',
        '@entities': './src/entities',
        '@useCases': './src/useCases',
        '@utils': './src/adapters/utils',
        '@presentation': './src/adapters/presentation',
        '@repositories': './src/adapters/repositories',
        '@main': './src/main',
      }
    }],
    ["babel-plugin-add-import-extension", { extension: "mjs" }]
  ],
  ignore: [
    '__tests__'
  ]
}
