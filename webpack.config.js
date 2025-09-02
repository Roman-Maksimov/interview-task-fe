const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'src/index.tsx'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js',
    clean: true,
    publicPath: '/',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html'),
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    historyApiFallback: true,
    port: 8080,
    open: true,
    hot: true,
    proxy: [
      {
        context: ['/aftermath-api'],
        target: 'https://testnet.aftermath.finance',
        changeOrigin: true,
        secure: true,
        logLevel: 'debug',
        pathRewrite: {
          '^/aftermath-api': '/api',
        },
      },
      {
        context: ['/sui-api'],
        target: 'https://fullnode.testnet.sui.io',
        changeOrigin: true,
        secure: true,
        logLevel: 'debug',
        pathRewrite: {
          '^/sui-api': '',
        },
      },
    ],
  },
};

