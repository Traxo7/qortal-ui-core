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
                let port = request.info.host.split(':')[1]
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
                // pluginLoader.loadPlugins()
                // console.log(plugins)
                return { plugins: myPlugins.map(p => p.name) }
            }
        },
        {
            method: 'GET',
            path: '/build/{param*}',
            handler: {
                directory: {
                    // path: path.join(__dirname, '../../build'),
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
                    // path: path.join(__dirname, '../../build'),
                    path: path.join(__dirname, '../../src'),
                    redirectToSlash: true,
                    index: true
                }
            }
        },
        // {
        //     method: 'GET',
        //     path: '/getDir',
        //     handler: (request, h) => {
        //         return process.env['APP_PATH']
        //     }
        // }
        // {
        //     method: '*',
        //     path: '/proxy/{url*}',
        //     handler: {
        //         proxy: {
        //             mapUri: (request) => {
        //                 // console.log(request)
        //                 // http://127.0.0.1:3000/proxy/explorer/addr=Qewuihwefuiehwfiuwe
        //                 // protocol :// path:port / blockexplorer.json?addr=Qwqfdweqfdwefwef
        //                 // const url = request.url.href.slice(7)// Chop out "/proxy/"
        //                 const url = request.url.pathname.slice(7) + request.url.search// Chop out "/proxy/"
        //                 // if (url.includes('/admin/') && !config.user.enableManagement) return { uri: '' } // Not matter not proxying anymore
        //                 // let url = remote.url + "/" + request.url.href.replace('/' + remote.path + '/', '')
        //                 // console.log(url)
        //                 // console.log(request)
        //                 return {
        //                     uri: url
        //                 }
        //             },
        //             passThrough: true,
        //             xforward: true
        //         }
        //     }
        // }
        {
            method: 'GET',
            path: '/plugin/{path*}',
            handler: (request, h) => {

                let port = request.info.host.split(':')[1]
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
                let port = request.info.host.split(':')[1]
                const response = h.file(path.join(config.server.primary.page404))
                response.header('Access-Control-Allow-Origin', request.info.host)
                return response
            }
        },
        {
            method: 'GET',
            path: '/qortal-components/plugin-mainjs-loader.html',
            handler: (request, h) => {
                let port = request.info.host.split(':')[1]
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
                let port = request.info.host.split(':')[1]
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
