/**
 * @typedef {Object} ProxyItem
 * @property {string} [target]
 * @property {string} [forward]
 * @property {Object} [agent]
 * @property {Object} [ssl]
 * @property {boolean} [ws]
 * @property {boolean} [xfwd]
 * @property {boolean} [secure]
 * @property {boolean} [toProxy]
 * @property {boolean} [prependPath]
 * @property {boolean} [ignorePath]
 * @property {string} [localAddress]
 * @property {boolean} [changeOrigin]
 * @property {boolean} [preserveHeaderKeyCase]
 * @property {string} [auth]
 * @property {Object} [headers]
 * @property {number} [timeout]
 * @property {number} [proxyTimeout]
 * @property {Object|Function} [pathRewrite]
 * @property {Object|Function} [router]
 */

/**
 * @typedef {Object} Option
 * @property {string} [defaultProxy]
 * @property {string} [watchPath]
 */

let Server;
const proxyFactory = (proxyConfig = {}) => {
    const proxyRules = Object.entries(proxyConfig);
    const proxy = proxyRules.map(([match, options]) => {
        return {
            changeOrigin: true,
            onProxyRes: (proxyRes, req) => {
                proxyRes.headers["x-real-url"] =
                    options.target.replace(/\/$/, "") + req.url;
            },
            ...options,
            context: match,
        };
    });
    return proxy;
};

try {
    Server = require("webpack-dev-server");
} catch (e) {
    console.log("ProxyAutoPlugin Warning: Cannot find module webpack-dev-server, try deliver it via parameter");
}

class ProxyAutoPlugin {
    /** @type {Option} */
    option;
    /** @type {number} */
    baseRouteStackLength;

    /**
     * @param {Option} option
     * @param {*} [DevServer]
     */
    constructor(option, DevServer) {
        if (!option) {
            throw new Error(
                "ProxyAutoPlugin Error: It seems that you forget to deliver the option parameter, please deliver it and try again"

            );
        }
        if (typeof option !== "object") {
            throw new Error(
                "ProxyAutoPlugin Error: The option parameter should be an object, see https://github.com/wutong21/proxy-auto-plugin"

            );
        }
        this.option = option;
        if (DevServer) {
            Server = DevServer;
        }
        if (!Server) {
            throw new Error(
                'ProxyAutoPlugin Error: Cannot find Server from parameter, try "npm i webpack-dev-server -D" to solve this problem'

            );
        }
    }

    apply() {
        console.log("ProxyAutoPlugin Started");

        const option = this.option;

        // version 3
        if (typeof Server.prototype.setupFeatures === "function") {
            const setupFeatures = Server.prototype.setupFeatures;

            Server.prototype.setupFeatures = async function () {
                this.pluginOption = option;

                delete require.cache[require.resolve(this.pluginOption.watchPath)]
                let content = require(this.pluginOption.watchPath)
                this.options.proxy = proxyFactory(content.devServer.proxy)

                this.baseRouteStackLength = this.app._router.stack.length;

                setupFeatures.call(this);

                if (this.pluginOption.watchPath) {
                    this._watch(this.pluginOption.watchPath);
                    const watcher =
                        this.contentBaseWatchers[this.contentBaseWatchers.length - 1];
                    watcher.on("change", () => {
                        delete require.cache[require.resolve(this.pluginOption.watchPath)]
                        let content = require(this.pluginOption.watchPath)
                        this.options.proxy = proxyFactory(content.devServer.proxy);
                        this.app._router.stack = this.app._router.stack.slice(
                            0,
                            this.baseRouteStackLength
                        );
                        setupFeatures.call(this);
                        console.log(
                            `ProxyAutoPlugin: Successfully switch proxy to '${JSON.stringify(content.devServer.proxy)}'`
                        );
                    });
                }
            };
        } else {

            //version 4
            const setupMiddlewares = Server.prototype.setupMiddlewares;
            const normalizeOptions = Server.prototype.normalizeOptions;

            Server.prototype.normalizeOptions = async function () {
                this.pluginOption = option;
                delete require.cache[require.resolve(this.pluginOption.watchPath)]
                let content = require(this.pluginOption.watchPath)
                this.options.proxy = proxyFactory(content.devServer.proxy)
                await normalizeOptions.call(this);
            };

            Server.prototype.setupMiddlewares = function (middlewares, devServer) {

                this.baseRouteStackLength = this.app._router.stack.length;

                setupMiddlewares.call(this, middlewares, devServer);

                if (this.pluginOption.watchPath) {
                    this.watchFiles(this.pluginOption.watchPath);
                    const watcher = this.staticWatchers[this.staticWatchers.length - 1];
                    watcher.on("change", async () => {
                        delete require.cache[require.resolve(this.pluginOption.watchPath)]
                        let content = require(this.pluginOption.watchPath)
                        this.options.proxy = proxyFactory(content.devServer.proxy);
                        await normalizeOptions.call(this);
                        this.app._router.stack = this.app._router.stack.slice(
                            0,
                            this.baseRouteStackLength
                        );
                        setupMiddlewares.call(this, middlewares, devServer);

                        console.log(
                            `ProxyAutoPlugin: Successfully switch proxy to '${JSON.stringify(content.devServer.proxy)}'`
                        );
                    });
                }
            };
        }

    }
}

module.exports = ProxyAutoPlugin;
