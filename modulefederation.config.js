const { dependencies } = require("./package.json");

const isEnvProduction = process.env.NODE_ENV === "production";

module.exports = {
  name: "accounts",
  filename: "remoteEntry.js",
  exposes: {
    "./accounts": "./src/accounts.jsx",
  },
  remotes: {
    container: isEnvProduction
      ? `host@${process.env.REACT_APP_GENERAL_HOST}/general.js`
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
  },
};
