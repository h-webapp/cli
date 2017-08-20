var server = require('nm-web-server');
const path = require('path');
var dir = path.resolve(__dirname,'../src');
var nodeResource = path.resolve(__dirname,'../node_modules');
var apiDir = path.resolve(__dirname,'../mock');
var config = {
    contexts:[
        {
            serverName:'web server',
            multiCpuSupport:false,
            zipResponse:false,
            sessionCookieName:'x3_session',
            sessionCookiePath:null,
            disabledAgentCache:true,
            port:8080,
            docBase:[
                {
                    path:'/',
                    dir:dir
                },
                {
                    path:'/node_modules',
                    dir:nodeResource
                },
                {
                    path:'/api',
                    dir:apiDir
                }
            ]
        }
    ]
};
process.on('exitProcess', function () {
    process.exit();
})
server.startServer(config);