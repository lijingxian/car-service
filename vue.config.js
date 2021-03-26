const devConfig = require('./config/dev-config');
const path = require('path');

module.exports = {
  publicPath: '',
  assetsDir: 'static',
  indexPath: 'index.htm',
  productionSourceMap: false,
  devServer: {
    open: true,
    proxy: {
      '/mock': { target: devConfig.devMockHost },
      '/upload': { target: devConfig.devApiHost },
      '': { target: devConfig.devApiHost }
    },
    port: 3456
  },
  chainWebpack: config => {
    config.plugin('copy').tap(([pathConfigs]) => {
      const conf = [
        {
          from: path.resolve(__dirname, './public'),
          to: path.resolve(__dirname, './dist/static'),
          toType: 'dir',
          ignore: ['index.html', '.DS_Store']
        }
      ];
      pathConfigs = conf;
      return [pathConfigs];
    });
  },
  css: {
    // 去除warning [mini-css-extract-plugin]
    extract: { ignoreOrder: true }
  }
};
