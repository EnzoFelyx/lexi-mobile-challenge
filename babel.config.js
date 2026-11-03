module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
    // Emite o design:paramtypes que a tsyringe lê; os decorators (legacy) já vêm do babel-preset-expo.
    plugins: ['babel-plugin-transform-typescript-metadata'],
  };
};
