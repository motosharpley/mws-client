const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: {
    polyfills: './src/js/polyfills.js',
    app: './src/index.js'
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    hot: true
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Restaurant Reviews',
      template: 'src/index.html',
    }),
    new HtmlWebpackPlugin({
      title: 'Restaurant Details',
      template: 'src/restaurant.html',
      filename: 'restaurant.html'
    }),
    new CopyWebpackPlugin([
      {from: './src/js/dbhelper.js', to: './js'},
      {from: './src/js/main.js', to: './js'},
      {from: './src/js/restaurant_info.js', to: './js'},
      {from: './src/sw.js'},
      {from: 'src/img', to: './img'},
      {from: './src/manifest.json'}
    ]),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  output: {
    filename: '.[name].bundle.js',
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
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
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