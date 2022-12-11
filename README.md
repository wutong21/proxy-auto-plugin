# proxy-auto-plugin

## Tips
Should use in Vue.js project and now only supoort webpack-dev-server@3.x.x and webpack-dev-server@4.x.x

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
    https: true, // use https start service need config secure equal false
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // auto restart server when target change
        changeOrigin: true,
        secure: false, // Wepback http-porxy plugin，In default situation, don't accept run in HTTPS , Or need back-end use correct license
      }
    },
  }
}
```
