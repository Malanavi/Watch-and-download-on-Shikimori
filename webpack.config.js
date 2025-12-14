const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const webpack = require('webpack');
const {SourceMapDevToolPlugin} = webpack;
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: ['./src/setPublicPath.ts', './src/content.ts'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'content.bundle.js',
    publicPath: '',
    clean: true,
  },
  devtool: false,
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.(ico|png|jpg|jpeg|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/icons/[name][ext]'
        }
      }
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      async: false,
      typescript: {
        configFile: path.resolve(__dirname, 'tsconfig.json'),
        diagnosticOptions: {
          semantic: true,
          syntactic: true,
        },
      },
    }),
    new SourceMapDevToolPlugin({
      filename: '[file].map',
      moduleFilenameTemplate: 'webpack:///[resource-path]'
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'assets/torrent-icons',
          to: 'assets/torrent-icons'
        },
        {
          from: 'assets/icons',
          to: 'assets/icons'
        },
        {from: 'manifest.json', to: '.'},
      ],
    }),
  ],
};
