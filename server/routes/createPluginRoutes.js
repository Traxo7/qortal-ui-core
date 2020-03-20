const path = require('path')
const createCommonRoutes = require('./createCommonRoutes.js')
// const config = require('../../config/config-loader.js')

const createPluginRoutes = (config, plugins) => {
    const routes = createCommonRoutes(config)

    const pluginFolders = {}

    plugins.reduce((obj, plugin) => {
        obj[plugin.name] = plugin.folder
        return obj
    }, pluginFolders)

    routes.push(
        // {
        //     method: 'GET',
        //     path: '/{path*}',
        //     handler: {
        //         directory: {
        //             path: request => {
        //                 const host = request.info.host
        //                 const domain = config.user.server.plugin.domain
        //                 if (!request.info.host.endsWith(domain)) return // 404?
        //                 const splitHost = host.split('.')
        //                 if (splitHost.length !== domain.split('.').length + 1) return // 404?
        //                 const plugin = splitHost[0]
        //                 // return path.join(__dirname, '../../plugins/' + plugin)
        //                 return path.join(pluginFolders[plugin])
        //             },
        //             redirectToSlash: true,
        //             index: true
        //         }
        //     }
        // handler: (request, h) => {
        //     // Change this to extracting the subdomain from request.info.host and using that rather than this /plugins/{*path} thing
        //     const host = request.info.host
        //     const domain = config.user.server.plugin.domain
        //     if (!request.info.host.endsWith(domain)) return // Return...404?
        //     const splitHost = host.split('.')
        //     if (splitHost.length !== domain.split('.').length + 1) return // 404?
        //     const plugin = splitHost[0]


        //     // const filePath = path.join(__dirname, '../../', config.user.server.plugin.directory, plugin + '/' + request.params.path)
        //     // const response = h.file(filePath)
        //     // Why do we need cors...?
        //     // response.header('Access-Control-Allow-Origin', config.server.plugins.domain + ':' + config.server.plugins.port) // Should be
        //     // return response
        // }
        // },
        {
            method: 'GET',
            path: '/plugin/{path*}',
            handler: (request, h) => {
                let port = request.info.host.split(':')[1]
                const plugin = request.params.path.split('/')[0]
                const filePath = path.join(pluginFolders[plugin], '../', request.params.path)

                const response = h.file(filePath, {
                    confine: false
                })
                response.header('Access-Control-Allow-Origin', request.info.remoteAddress + ':' + port) // Should be
                return response
            }
        },
        {
            method: 'GET',
            path: '/plugin/404',
            handler: (request, h) => {
                let port = request.info.host.split(':')[1]
                const response = h.file(path.join(config.server.primary.page404))
                response.header('Access-Control-Allow-Origin', request.info.remoteAddress + ':' + port)
                return response
            }
        },
        {
            method: 'GET',
            path: '/frag-components/plugin-mainjs-loader.html',
            handler: (request, h) => {
                let port = request.info.host.split(':')[1]
                const response = h.file(path.join(__dirname, '../../src/plugins/plugin-mainjs-loader.html'), {
                    confine: false
                })
                response.header('Access-Control-Allow-Origin', request.info.remoteAddress + ':' + port)
                return response
            }
        },
        {
            method: 'GET',
            path: '/frag-components/plugin-mainjs-loader.js',
            handler: (request, h) => {
                let port = request.info.host.split(':')[1]
                const file = path.join(config.build.options.outputDir, '/plugins/plugin-mainjs-loader.js')

                const response = h.file(file, {
                    confine: false
                })
                response.header('Access-Control-Allow-Origin', request.info.remoteAddress + ':' + port)
                return response
            }
        }
    )

    return routes
}

module.exports = createPluginRoutes
