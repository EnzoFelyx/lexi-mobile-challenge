module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
    plugins: [
      // Emite o design:paramtypes que a tsyringe lê; os decorators (legacy) já vêm do babel-preset-expo.
      'babel-plugin-transform-typescript-metadata',
      // Embute as migrations do Drizzle (.sql) como texto no bundle.
      ['inline-import', { extensions: ['.sql'] }],
    ],
  };
};
