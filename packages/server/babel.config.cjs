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
        '@errors': './src/domain/errors',
        '@entities': './src/domain/entities',
        '@useCases': './src/useCases',
        '@presentation': './src/presentation',
        '@utils': './src/solutions/utils',
        '@repositories': './src/solutions/repositories',
        '@main': './src/main'
      }
    }],
    ["babel-plugin-add-import-extension", { extension: "mjs" }],
    ["@babel/plugin-proposal-decorators", { "legacy": true }]
  ],
  ignore: [
    '__tests__'
  ]
}
