import { ModuleFederationPlugin } from "@module-federation/enhanced/rspack";
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSass } from "@rsbuild/plugin-sass";
import Dotenv from "dotenv-webpack";
//@ts-ignore
import mfConfig from "./modulefederation.config";

const ENV_PATTERN = /REACT_APP_/;
const stringifiedEnvVars = JSON.stringify(
  Object.keys(process.env)
    .filter((key) => ENV_PATTERN.test(key))
    .reduce((acc, curr) => {
      acc[curr] = process.env[curr];
      return acc;
    }, {}),
);

export default defineConfig({
  server: {
    port: 3002,
  },
  tools: {
    rspack: (config, { appendPlugins, rspack, isProd }) => {
      config.output.publicPath = "auto";
      appendPlugins([
        new ModuleFederationPlugin(mfConfig),
        new rspack.DefinePlugin(stringifiedEnvVars),
        new Dotenv({
          path: "./.env.local", // Path to .env file (this is the default)
          safe: true, // load .env.example (defaults to "false" which does not use dotenv-safe)
        }),
      ]);
    },
  },
  plugins: [
    pluginReact({
      splitChunks: {
        router: false,
        react: false,
      },
    }),
    pluginSass(),
  ],
});
