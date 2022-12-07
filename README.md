# proxy-auto-plugin

## Feature

Auto switch proxy path by listen Proxy change

## How to use ?

```
npm install -D proxy-auto-plugin
```

```
// vue.config.js
const path = require('path')
const ProxyAutoPlugin = require('proxy-auto-plugin')
module.exports = {
  configureWebpack: {
    plugins: [
      new ProxyAutoPlugin(
        {
          // Listen config file change
          watchPath: path.join(__dirname, "vue.config.js"),
        }
      )
    ]
  }
}
```

## Example

```
// vue.config.js
const path = require('path')
const ProxyAutoPlugin = require('proxy-auto-plugin')
module.exports = {
  configureWebpack: {
    plugins: [
      new ProxyAutoPlugin(
        {
          // Listen config file change
          watchPath: path.join(__dirname, "vue.config.js"),
        }
      )
    ]
  },
  devServer: {
    https: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3101', // auto restart server when target change
        changeOrigin: true,
        secure: false, // Wepback 中的 http-porxy 插件，默认情况下，不接受运行在HTTPS上，并且使用了无效证书的后端服务。
      }
    },
  }
}
```
