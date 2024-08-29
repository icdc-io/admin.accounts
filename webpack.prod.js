const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common.js");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const isStats = process.env.STATS === "true";
const mode = process.env.ANALYZE ?? "disabled";
const Dotenv = require("dotenv-webpack");
const path = require("path");
const { DefinePlugin } = require("webpack");
// const CopyPlugin = require("copy-webpack-plugin");

// https://webpack.js.org/plugins/split-chunks-plugin/#splitchunksname
// const uniqueName = (module, chunks, cacheGroupKey) => {
//   const allChunksNames = chunks.map((item) => item.name).join("~");
//   return `${module}-${cacheGroupKey}-${allChunksNames}`;
// };

const ENV_PATTERN = /REACT_APP_/;
const stringifiedEnvVars = JSON.stringify(
  Object.keys(process.env)
    .filter((key) => ENV_PATTERN.test(key))
    .reduce((acc, curr) => {
      acc[curr] = process.env[curr];
      return acc;
    }, {}),
);

const prodConfig = {
  mode: "production",
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        parallel: 4,
      }),
    ],
  },
  devtool: false,
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader",
          "postcss-loader",
        ],
      },
      {
        test: /\.s[ac]ss$/i, // https://webpack.js.org/loaders/sass-loader/
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader", // https://webpack.js.org/loaders/css-loader/
            options: {
              modules: {
                mode: "icss",
              },
            },
          },
          {
            loader: "sass-loader",
          },
        ],
      },
    ],
  },
  plugins: [
    // https://webpack.js.org/plugins/mini-css-extract-plugin/#advanced-configuration-example
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
      chunkFilename: "[name].[contenthash].chunk.css",
    }),
    new DefinePlugin(stringifiedEnvVars),
    new BundleAnalyzerPlugin({
      analyzerMode: mode,
      generateStatsFile: isStats,
    }),
    new ESLintPlugin({ failOnError: true }),
    new Dotenv({
      path: path.resolve(__dirname, ".env.local"),
    }),
    // new CopyPlugin({
    //   patterns: [
    //     {
    //       from: "public/robots.txt",
    //       to: "robots.txt",
    //     },
    //   ],
    // }),
  ],
};

module.exports = () => {
  console.log("ProdConfig config loaded");
  return merge(commonConfig, prodConfig);
};
