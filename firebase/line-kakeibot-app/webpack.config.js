const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { TypedCssModulesPlugin } = require('typed-css-modules-webpack-plugin');

const IS_DEBUG = process.env.production !== 'true';
console.log('IS_DEBUG', IS_DEBUG);

const SRC_PATH = path.resolve('src');
const ASSETS_PATH = path.resolve('assets');
const OUTPUT_PATH = path.resolve('../public/v3');

const DEBUG_PLUGINS = [
  new HtmlWebpackPlugin({
    title: '[debug] 家計簿',
    filename: path.join(OUTPUT_PATH, 'accounts/index.html'),
    template: path.join(ASSETS_PATH, 'index.template.html'),
    chunks: ['accounts/index'],
  }),
  new HtmlWebpackPlugin({
    title: '[debug] 設定画面',
    filename: path.join(OUTPUT_PATH, 'setting/index.html'),
    template: path.join(ASSETS_PATH, 'index.template.html'),
    chunks: ['setting/index'],
  }),
  new HtmlWebpackPlugin({
    title: '[debug] 金額は？',
    filename: path.join(OUTPUT_PATH, 'input-helper/index.html'),
    template: path.join(ASSETS_PATH, 'index.template.html'),
    chunks: ['input-helper/index'],
  }),
];
const PUBLISH_PLUGINS = [
  new MiniCssExtractPlugin({
    filename: '[name].css',
  }),
  new HtmlWebpackPlugin({
    title: '家計簿',
    description: '使った金額を確認できます',
    filename: path.join(OUTPUT_PATH, 'accounts/index.html'),
    template: path.join(ASSETS_PATH, 'index.template.html'),
    hash: true,
    chunks: ['accounts/index'],
    minify: {
      collapseWhitespace: true,
    },
  }),
  new HtmlWebpackPlugin({
    title: '設定画面',
    description: '家計簿の設定をします',
    filename: path.join(OUTPUT_PATH, 'setting/index.html'),
    template: path.join(ASSETS_PATH, 'index.template.html'),
    hash: true,
    chunks: ['setting/index'],
    minify: {
      collapseWhitespace: true,
    },
  }),
  new HtmlWebpackPlugin({
    title: '金額は？',
    filename: path.join(OUTPUT_PATH, 'input-helper/index.html'),
    template: path.join(ASSETS_PATH, 'index.template.html'),
    hash: true,
    chunks: ['input-helper/index'],
    minify: {
      collapseWhitespace: true,
    },
  }),
];

const DEBUG_CSS_RULE = {
  test: /\.css$/,
  use: [
    {
      loader: 'style-loader',
    },
    {
      loader: 'css-loader',
      options: {
        sourceMap: true,
        modules: {
          mode: 'local',
          exportLocalsConvention: 'camelCase',
          localIdentName: '[name]-[local]-[hash:base64:5]',
        },
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: true,
      },
    },
  ],
};
const PUBLISH_CSS_RULE = {
  test: /\.css$/,
  use: [
    MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        modules: {
          mode: 'local',
          exportLocalsConvention: 'camelCase',
          localIdentName: '[hash:base64:5]',
        },
      },
    },
    'postcss-loader',
  ],
};

module.exports = {
  mode: IS_DEBUG ? 'development' : 'production',
  entry: {
    'accounts/index': path.join(SRC_PATH, 'accounts'),
    'setting/index': path.join(SRC_PATH, 'setting'),
    'input-helper/index': path.join(SRC_PATH, 'input-helper'),
  },
  output: {
    filename: '[name].js',
    path: OUTPUT_PATH,
    publicPath: IS_DEBUG ? '/' : '/v3/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.css', '.svg'],
    alias: {
      '@global-style': path.resolve(__dirname, 'src/styles'),
    },
  },
  ...(IS_DEBUG
    ? {
        devtool: 'inline-source-map',
        devServer: {
          contentBase: OUTPUT_PATH,
          compress: true,
          disableHostCheck: true,
          host: '0.0.0.0',
          port: 3000,
          https: {
            key: fs.readFileSync('./certs/localhost-key.pem'),
            cert: fs.readFileSync('./certs/localhost.pem'),
          },
        },
      }
    : {}),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
      {
        test: /\.(svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {},
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[hash]-[name].[ext]',
            },
          },
        ],
      },
      IS_DEBUG ? DEBUG_CSS_RULE : PUBLISH_CSS_RULE,
    ],
  },
  plugins: [
    ...(IS_DEBUG ? DEBUG_PLUGINS : PUBLISH_PLUGINS),
    new TypedCssModulesPlugin({
      globPattern: 'src/**/*.css',
      camelCase: true,
    }),
  ],
};
