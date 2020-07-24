const path = require('path')

const createRoutes = config => [

    {
        method: 'GET',
        path: '/img/{param*}',
        handler: {
            directory: {
                path: config.build.options.imgDir,
                redirectToSlash: true,
                index: true
            }
        }
    },
    {
        method: 'GET',
        path: '/font/{param*}',
        handler: {
            directory: {
                path: path.join(__dirname, '../../font'),
                redirectToSlash: true,
                index: true
            }
        }
    },
    {
        method: 'GET',
        path: '/sound/{param*}',
        handler: {
            directory: {
                path: path.join(__dirname, '../../sound/'),
                redirectToSlash: true,
                index: true
            }
        }
    },
    {
        method: 'GET',
        path: '/memory-pow/{param*}',
        handler: {
            directory: {
                path: path.join(__dirname, '../../memory-pow/'),
                redirectToSlash: true,
                index: true
            }
        }
    },
    {
        method: 'GET',
        path: '/getConfig',
        handler: (request, h) => {
            const response = {
                config: {
                    ...config
                }
            }

            delete response.config.user.tls
            delete response.config.build
            return JSON.stringify(response)
        }
    }
]

module.exports = createRoutes
