const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const { dependencies } = require("./package.json");
const isEnvProduction = process.env.NODE_ENV === "production";

module.exports = {
  entry: path.resolve(__dirname, "src", "accounts.jsx"),
  output: {
    publicPath: "auto",
    clean: true,
    filename: isEnvProduction
      ? "static/js/[name].[contenthash:8].js"
      : "static/js/bundle.js",
    // There are also additional JS chunk files if you use code splitting.
    chunkFilename: isEnvProduction
      ? "static/js/[name].[contenthash:8].chunk.js"
      : "static/js/[name].chunk.js",
    assetModuleFilename: "static/media/[name].[hash][ext]",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.inline.svg$/,
        use: "@svgr/webpack",
      },
      {
        test: /\.(eot|ttf|woff|woff2|png|jpg|jpeg|gif|otf|svg)$/i,
        type: "asset",
        exclude: /\.inline.svg$/,
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new ModuleFederationPlugin({
      name: "accounts",
      filename: "remoteEntry.js",
      exposes: {
        "./accounts": "./src/accounts.jsx",
      },
      remotes: {
        container: isEnvProduction
          ? "host@http://localhost:8000/general.js"
          : "host@http://localhost:8000/general.js",
      },
      shared: {
        react: {
          singleton: true, // true - load this module once
          strictVersion: true, // only necessary version
          requiredVersion: dependencies.react, // define required module version
        },
        "react-router-dom": {
          singleton: true,
          strictVersion: true,
          requiredVersion: dependencies["react-router-dom"],
        },
        "react-i18next": {
          singleton: true,
          strictVersion: true,
          requiredVersion: dependencies["react-i18next"],
        },
        "semantic-ui-react": {
          singleton: true,
          strictVersion: true,
          requiredVersion: dependencies["seamless-ui-react"],
        },
        "react-redux": {
          singleton: true,
          strictVersion: true,
          requiredVersion: dependencies["react-redux"],
        },
      },
    }),
  ],
};
