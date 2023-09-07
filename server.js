var express = require('express');
var path = require('path');
var fs=require('fs')
var config={
    CrossDomain:'*',
    port:8668
}
var main=function()
{
        var app = express();
        app.use(express.static(path.join(__dirname,'dist/pwa/')));
    app.use(function (req, res, next) {
                if ('OPTIONS' == req.method) {
                        if(config.CrossDomain=='*')
                                res.header('Access-Control-Allow-Origin', req.headers.origin);
                        else
                                res.header('Access-Control-Allow-Origin', config.CrossDomain);
                        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
                        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
                        res.setHeader('Access-Control-Allow-Credentials', true);
                        res.status(200).send('OK');
                }
                else
                {
                        if(config.CrossDomain=='*')
                                res.header('Access-Control-Allow-Origin', req.headers.origin);
                        else
                                res.header('Access-Control-Allow-Origin', config.CrossDomain);
                                res.setHeader('Access-Control-Allow-Credentials', true);
                        next()

                }
        });
    app.use(async(req, res, next)=> {

        fs.readFile('dist/pwa/index.html', 'utf-8', (err, content) => {
            if (err) {
            console.log('We cannot open "index.html" file.')
            }

            res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8'
            })

            res.end(content)
            next()
        })
    });
        var http = require('http');
        var server = http.createServer(app);
        server.listen(config.port);
        console.log('http run at port '+ config.port)
        this.server=server
}

main()
