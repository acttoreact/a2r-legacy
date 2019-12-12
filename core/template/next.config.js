module.exports = {
  webpack(cfg) {
    cfg.module.rules.push({
      test: /\.ts$/,
      use: {
        loader: 'ts-loader',
        options: {
          allowTsInNodeModules: true
        }
      },
    });
    return cfg;
  }
}