const path = require('path')

const createCommonRoutes = require('./createCommonRoutes.js')

// THOUGHTS: Make all the routes support production and dev

const createPrimaryRoutes = (config, plugins) => {
    const routes = createCommonRoutes(config)

    let myPlugins = plugins

    const pluginFolders = {}

    plugins.reduce((obj, plugin) => {
        obj[plugin.name] = plugin.folder
        return obj
    }, pluginFolders)


    routes.push(
        {
            method: 'GET',
            path: '/',
            handler: (request, reply) => {
                return reply.redirect('/app')
            }
        },
        {
            method: 'GET',
            path: '/{path*}',
            // Make this support production and dev...
            handler: (request, h) => {
                console.log("PARAMS-PRIMARY:  ==> ", request.params);
                const filePath = path.join(__dirname, '../../public/index.html')
                const response = h.file(filePath, {
                    confine: true
                })
                response.header('Access-Control-Allow-Origin', request.info.host)
                return response
            }
        },
        {
            method: 'GET',
            path: '/getPlugins',
            handler: (request, h) => {
                return { plugins: myPlugins.map(p => p.name) }
            }
        },
        {
            method: 'GET',
            path: '/build/{param*}',
            handler: {
                directory: {
                    path: config.build.options.outputDir,
                    redirectToSlash: true,
                    index: true
                }
            }
        },
        {
            method: 'GET',
            path: '/src/{param*}',
            handler: {
                directory: {
                    path: path.join(__dirname, '../../src'),
                    redirectToSlash: true,
                    index: true
                }
            }
        },
        {
            method: 'GET',
            path: '/plugin/{path*}',
            handler: (request, h) => {

                const plugin = request.params.path.split('/')[0]
                console.log("PARAMS-PLUGINS:  ==> ", request.params);
                const filePath = path.join(pluginFolders[plugin], '../', request.params.path)

                const response = h.file(filePath, {
                    confine: false
                })
                response.header('Access-Control-Allow-Origin', request.info.host)
                return response
            }
        },
        {
            method: 'GET',
            path: '/plugin/404',
            handler: (request, h) => {
                const response = h.file(path.join(config.server.primary.page404))
                response.header('Access-Control-Allow-Origin', request.info.host)
                return response
            }
        },
        {
            method: 'GET',
            path: '/qortal-components/plugin-mainjs-loader.html',
            handler: (request, h) => {
                const response = h.file(path.join(__dirname, '../../src/plugins/plugin-mainjs-loader.html'), {
                    confine: false
                })
                response.header('Access-Control-Allow-Origin', request.info.host)
                return response
            }
        },
        {
            method: 'GET',
            path: '/qortal-components/plugin-mainjs-loader.js',
            handler: (request, h) => {
                const file = path.join(config.build.options.outputDir, '/plugins/plugin-mainjs-loader.js')

                const response = h.file(file, {
                    confine: false
                })
                response.header('Access-Control-Allow-Origin', request.info.host)
                return response
            }
        },

    )

    return routes
}

module.exports = createPrimaryRoutes
