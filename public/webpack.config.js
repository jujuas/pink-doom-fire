const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanObsoleteChunks = require('webpack-clean-obsolete-chunks');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const fs = require('fs');
const lessToJs = require('less-vars-to-js');
const themeVariables = lessToJs(fs.readFileSync('./src/assets/css/Theme.less', 'utf8'), {
  resolveVariables: true,
  stripPrefix: true,
});

var path = require('path');
const ENV = process.env.NODE_ENV || 'development';
const isProd = ENV != 'development';
const VERSION = JSON.stringify(require('./package.json').version).replace(/["']/g, '');
const publicPath = path.join(__dirname, './package.json');
const shouldUseRelativeAssetPaths = publicPath === './';

const plugins = [
  new CleanObsoleteChunks(),
  new webpack.HotModuleReplacementPlugin(),
  new HtmlWebpackPlugin({
    template: path.join(__dirname, 'src/index.html'),
    filename: 'index.html',
    inject: 'body',
  }),
  new CopyWebpackPlugin([{ from: path.join(__dirname, 'src/assets') }]),
  new MiniCssExtractPlugin({
    filename: '[name].css',
    chunkFilename: '[id].css',
  }),
];

if (isProd) {
  plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
      quiet: true,
    })
  );
  plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    })
  );
}

module.exports = env => {
  console.log(
    `|******************* NODE_ENV: ${ENV.toUpperCase()} #### VERSION: ${VERSION} ***********************************|`
  );

  return {
    mode: isProd ? 'production' : 'development',
    entry: {
      application: path.join(__dirname, 'src/Boot.js'),
      vendor: ['react', 'react-dom', 'react-router', 'react-router-dom'],
    },
    output: {
      filename: '[name].[hash].js',
      path: path.join(__dirname, 'build/'),
      publicPath: '/itca',
    },
    devtool: env.prod ? false : 'inline-source-map',
    resolve: {
      alias: {
        envs: path.join(__dirname, 'src/envs', ENV),
        react: path.resolve('./node_modules/react'),
      },
    },
    bail: env.prod,
    module: {
      rules: [
        {
          test: /\.js$|\.jsx$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
            },
          },
        },
        { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] },
        {
          test: /\.less$/,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                sourceMap: false,
                minimize: true,
              },
            },
            {
              loader: 'less-loader',
              options: {
                modifyVars: themeVariables,
              },
            },
          ],
        },
      ],
    },
    plugins: plugins,
    optimization: {
      minimize: isProd,
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            ecma: 7,
            ie8: false,
            output: {
              comments: false,
            },
          },
          cache: true,
          parallel: true,
          sourceMap: true,
        }),
      ],
      runtimeChunk: true,
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all',
          },
        },
      },
    },
  };
};
