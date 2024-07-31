const babelConfig = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: ["> 0.25%", "not dead"],
        modules: false,
        useBuiltIns: "usage",
        corejs: { version: 3.28 },
        debug: false,
      },
    ],
    "@babel/preset-react",
  ],
  plugins: [
    "@babel/plugin-transform-runtime",
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-proposal-class-properties",
  ],
  env: {
    production: {
      only: ["src"],
      plugins: [
        [
          "transform-react-remove-prop-types",
          {
            removeImport: true,
          },
        ],
        "@babel/plugin-transform-react-inline-elements",
        "@babel/plugin-transform-react-constant-elements",
      ],
    },
  },
};

module.exports = (api) => {
  api.cache.using(() => process.env.NODE_ENV);
  babelConfig.plugins = [];
  api.env("development") && babelConfig.plugins.push("react-refresh/babel");
  return babelConfig;
};
