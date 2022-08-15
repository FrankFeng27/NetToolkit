module.exports = function (api) {
  api.cache(true);

  return {
    "presets": [
      "@babel/preset-react",
      ["@babel/preset-typescript", { "allExtensions": true, "isTSX": true }],
      ["@babel/preset-env",
      {
        "targets": "> 0.25%", "useBuiltIns": "usage", "corejs": "3.24.0",
      }],
    ],
    "plugins": [
      "@babel/plugin-syntax-dynamic-import",
      "@babel/proposal-object-rest-spread",
      ['@babel/plugin-proposal-class-properties', {'loose': true}],
      ['@babel/plugin-proposal-private-methods', {'loose': true}],
      ['@babel/plugin-proposal-private-property-in-object', {'loose': true}],
    ]
  }
};
