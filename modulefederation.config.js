const { dependencies } = require("./package.json");

module.exports = {
	name: "admin_accounts",
	filename: "remoteEntry.js",
	exposes: {
		"./accounts": "./src/accounts.jsx",
	},
	remotes: {
		container: "host@/general.js",
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
