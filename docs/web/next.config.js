const withNextra = require('nextra')({
  unstable_staticImage: true,
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.js',
});

module.exports = withNextra();
