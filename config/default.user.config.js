const path = require('path')
const os = require('os');

// THOUGHTS: Is this really needed... (get different network interface address and do something with it...)
// const getNetworkInterface = () => {

//     let ifaces = os.networkInterfaces();

//     let networkName, networkAddress

//     Object.keys(ifaces).forEach(function (ifname) {
//         let alias = 0;

//         ifaces[ifname].forEach(function (iface) {
//             if ('IPv4' !== iface.family || iface.internal !== false) {
//                 // dont consider internal like 127.0.0.1 and non-ipv4 addresses
//                 return;
//             }

//             if (alias >= 1) {
//                 // interface with multiple ipv4 addresses
//                 console.log(ifname + ':' + alias, iface.address);
//             } else {
//                 // interface with just one ipv4 adress
//                 console.log(ifname, iface.address);
//             }
//             ++alias;
//         });
//     });
// }


const user = {
    // TestNet [0], MainNet [1], other nodes will come in future...
    node: 1,
    knownNodes: [
        {
            protocol: 'http',
            domain: '127.0.0.1',
            port: 62391,
            enableManagement: true
        },
        {
            protocol: 'http',
            domain: '127.0.0.1',
            port: 12391,
            enableManagement: true
        },
        {
            protocol: 'http',
            domain: 'node1.qortal.org',
            port: 62391,
            enableManagement: false
        },
        {
            protocol: 'http',
            domain: 'node1.qortal.org',
            port: 12391,
            enableManagement: false
        },
        {
            protocol: 'http',
            domain: 'node2.qortal.org',
            port: 62391,
            enableManagement: false
        },
        {
            protocol: 'http',
            domain: 'node2.qortal.org',
            port: 12391,
            enableManagement: false
        }
    ],
    nodeSettings: {
        pingInterval: 10 * 1000 // (10 secs)
    },
    // End new
    version: process.env.npm_package_version,
    // user: {
    //     language: 'english', // default...english
    //     theme: 'light' // maybe could become dark
    // },
    language: 'english', // default...english
    theme: 'light', // maybe could become dark
    server: {
        writeHosts: {
            enabled: true
        },
        relativeTo: path.join(__dirname, '../'),
        primary: {
            domain: '0.0.0.0', // used (0.0.0.0) so as to make is available over the network
            address: '0.0.0.0', // used (0.0.0.0) so as to make is available over the network
            port: 12388, // Port to access the UI from
            directory: './src/', // Core Qora-lite code.,
            page404: './src/404.html',
            host: '0.0.0.0' // This probably shouldn't be the default...
        },
        plugin: {
            domain: '0.0.0.0', // '*.domain' is used to host subdomains
            address: '0.0.0.0', // used (0.0.0.0) so as to make is available over the network
            // domain: 'frag.ui'
            port: 12389,
            directory: './plugins', // Where the plugin folders are stored,
            default: 'wallet',
            host: '0.0.0.0' // frag.ui?
        }
    },
    // Might be better increased over a weaker or metered connection, or perhaps lowered when using a local node4
    tls: {
        enabled: false,
        options: {
            key: '',
            cert: ''
        }
    },
    constants: {
        pollingInterval: 3000, // How long between checking for new unconfirmed transactions and new blocks (in milliseconds).
        // proxyURL: '/proxy/', // nope!
        workerURL: '/build/worker.js' // Probably be replaced with something in all the build config
    }
}

module.exports = user
