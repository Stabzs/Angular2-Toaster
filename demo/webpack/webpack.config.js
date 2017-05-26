module.exports = {
  entry: "./src/main.ts",
  output: {
      filename: "bundle.js"
  },
  devtool: 'source-map',
  resolve: {
      extensions: ['.webpack.js', '.web.js', '.ts',  '.js']
  },
  module: {
      loaders: [
      { test: /\.ts$/, loader: 'ts-loader' }
      ]
  }
};