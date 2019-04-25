const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

var extractPlugin = new ExtractTextPlugin({
  filename: './client/public/bundle.css',
});

const options = {
  devTool: 'source-map',
  uglify: {},
};

// if (process.env.NODE_ENV === 'production') {
//   options.devTool = '';
//   module.exports.plugins.push(new webpack.optimize.UglifyJsPlugin({
//     compress: { warnings: false }
//   }))
// }

module.exports = {
  entry: ['./client/src/index.jsx'],
  output: {
    filename: './client/public/bundle.js',
  },
  watch: true,
  devtool: options.devTool,
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0'],
        },
      },

      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff',
      },

      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
      },

      {
        test: /\.scss$/, // made scss
        use: extractPlugin.extract({
          use: ['css-loader', 'sass-loader'],
        }),
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65,
              },
              optipng: {
                optimizationLevel: 7,
              },
              pngquant: {
                quality: 65,
              },
              svggo: {},
              webp: {
                quality: 65,
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [extractPlugin, new Dotenv()],
};
