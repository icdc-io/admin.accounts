import { ModuleFederationPlugin } from "@module-federation/enhanced/rspack";
import { defineConfig, loadEnv } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSass } from "@rsbuild/plugin-sass";
import Dotenv from "dotenv-webpack";
import mfConfig from "./modulefederation.config";

const { publicVars } = loadEnv({ prefixes: ["REACT_APP_"] });

export default ({ envMode }) => {
	return defineConfig({
		server: {
			port: 8022,
		},
		source: {
			define: publicVars,
		},
		tools: {
			rspack: (config, { appendPlugins }) => {
				config.output.publicPath = "auto";
				const plugins = [new ModuleFederationPlugin(mfConfig)];
				if (envMode === "development")
					plugins.push(
						new Dotenv({
							path: "./.env.local",
							safe: true,
						}),
					);
				appendPlugins(plugins);
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
};
