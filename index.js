const server=require('node-http-server');
 
 server.deploy(
    {
        port:8000,
        root: __dirname + '/public'
    }
)