const path = require("path");

module.exports = {
  webpack: (config) => {
    config.resolve.alias.react = path.join(__dirname, "node_modules/react");
    return config
  },
}