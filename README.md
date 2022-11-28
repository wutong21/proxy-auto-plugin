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
          // 监控配置变化
          watchPath: path.join(__dirname, "vue.config.js"),
        }
      )
    ]
  }
}
```
