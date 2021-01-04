const path = require("path");

module.exports = {
  webpack: function (config, env) {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          react: path.join(__dirname, "node_modules/react"),
        },
      },
    };
  },
};
