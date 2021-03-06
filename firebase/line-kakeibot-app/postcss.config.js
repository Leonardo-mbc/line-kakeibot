module.exports = {
  plugins: [
    ['postcss-import', {}],
    ['postcss-custom-properties', {}],
    [
      'postcss-preset-env',
      {
        stage: 3,
        browsers: 'last 2 versions',
        features: {
          'nesting-rules': true,
        },
      },
    ],
    [
      'cssnano',
      {
        preset: 'default',
      },
    ],
  ],
};
