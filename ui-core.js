const { createServer } = require('./server/server.js')
const build = require('./tooling/build.js')
const watch = require('./tooling/watch.js')
const watchInlines = require('./tooling/watch-inlines.js')
const defaultConfig = require('./config/config.js')
const generateBuildConfig = require('./tooling/generateBuildConfig.js')

module.exports = {
    createServer,
    build,
    watch,
    watchInlines,
    generateBuildConfig,
    defaultConfig
}
