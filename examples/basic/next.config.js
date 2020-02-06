const createStyledComponentsTransformer = require('typescript-plugin-styled-components').default;

const styledComponentsTransformer = createStyledComponentsTransformer();

module.exports = {
  pageExtensions: ['tsx'],
  webpack(cfg) {
    cfg.module.rules.push({
      test: /\.ts$/,
      use: {
        loader: 'ts-loader',
        options: {
          allowTsInNodeModules: true,
        },
      },
    });
    cfg.module.rules.push({
      test: /\.tsx$/,
      loader: 'ts-loader',
      options: {
        getCustomTransformers: () => ({ before: [styledComponentsTransformer] })
      }
    });
    return cfg;
  }
}