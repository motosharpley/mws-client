const path = require('path');

module.exports = {
  entry: {
    app: './src/index.js',
    restaurants: './src/js/restaurants.js',
    dbhelper: './src/js/dbhelper.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  }
};