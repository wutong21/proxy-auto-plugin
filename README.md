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
  chainWebpack: (config) => {
    config.module.rules.delete('svg')
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.svg$/,
          loader: "vue-svg-loader"
        }
      ]
    },
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
    proxy: {
      '/api': {
        target: 'http://localhost:3101', // auto restart server when target change 
        changeOrigin: true,
      }
    },
  }
}
```
