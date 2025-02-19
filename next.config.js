const webpack = require("webpack");

module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        oracledb: false, // Define fallback para o módulo oracledb
      };
    }
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^oracledb$/,
      })
    );
    return config;
  },
};
