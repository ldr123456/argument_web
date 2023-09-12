const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')
const ElementPlus = require('unplugin-element-plus/webpack')
const Icons =require('unplugin-icons/webpack')
const IconsResolver =require('unplugin-icons/resolver')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
  lintOnSave: false, // 关闭语法检查
  configureWebpack: {
    plugins: [
      AutoImport({
        resolvers: [
          ElementPlusResolver(),
          IconsResolver({
            prefix: 'Icon',
          }),
        ],
      }),
      Components({
        resolvers: [
          ElementPlusResolver(),
          IconsResolver({
            enabledCollections: ['ep'],
          }),
        ],
      }),
      ElementPlus(),
      Icons({
        autoInstall: true,
      }),
      new NodePolyfillPlugin()
    ],
  },
  devServer: {
    proxy: {
      '/api': {
          target: 'http://172.22.93.27:5000', //要代理的域名
          changeOrigin: true,//允许跨域
          pathRewrite: {
            '^/api': ''  // 这个是定义要访问的路径，名字随便写
          }
      }
    }
  },
}
