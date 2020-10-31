const path = require('path');

module.exports = {
  stories: [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  webpackFinal: async config => {
    config.module.rules.push({
      test: /\.less$/,
      use: [
        {
          loader: 'vue-style-loader',
        },
        {
          loader: 'css-loader',
        },
        {
          loader: 'less-loader',
        },
      ],
    })
    config.module.rules.push({
      test: /\.scss$/,
      use: [
        {
          loader: 'vue-style-loader',
        },
        {
          loader: 'css-loader',
        },
        {
          loader: 'sass-loader',
        },
      ],
    })
    config.module.rules.push({
      test: /\.(gif|jpe?g|png|svg)$/,
      use: {
        loader: 'url-loader',
        options: { name: '[name].[ext]' },
      },
    })
    config.resolve.extensions.push('.ts', '.tsx')
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, '../src')
    }
    return config
  },
}