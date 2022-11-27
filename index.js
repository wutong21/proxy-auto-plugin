let Server;
try {
    Server = require("webpack-dev-server");
} catch (e) {
    console.log(
        'ProxyAutoPlugin Warning: Cannot find module webpack-dev-server, try "npm i webpack-dev-server -D" to solve this problem'
    );
}

class ProxyAutoPlugin {
    constructor(option) {
        this.option = option;
    }
    apply() {
        console.log("ProxyAutoPlugin Started");
        const option = this.option

        const setupMiddlewares = Server.prototype.setupMiddlewares;
        Server.prototype.setupMiddlewares = function (middlewares, devServer) {
            setupMiddlewares.call(this, middlewares, devServer)
            this.pluginOption = option;
            if (this.pluginOption.watchPath) {
                this.watchFiles(this.pluginOption.watchPath);
                const watcher = this.staticWatchers[this.staticWatchers.length - 1];
                watcher.on("change", (file) => {
                    this.stop().then(() => {
                        this.initialize()
                        const { exec } = require("child_process");
                        exec("vue-cli-service serve");
                    })
                    console.log(`${file} change`)
                });
            }
        }
    }
}

module.exports = ProxyAutoPlugin