const path = require("path");

module.exports = {
  future: {
    webpack5: true,
  },
  webpack: (config) => {
    config.resolve.alias.react = path.join(__dirname, "node_modules/react");
    return config
  },
}