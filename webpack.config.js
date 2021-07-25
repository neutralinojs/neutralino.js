let path = require('path');

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, './src/index.ts'),
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts'],
  },
  output: {
    filename: 'neutralino.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'Neutralino',
    libraryTarget: 'var'
  }
};
