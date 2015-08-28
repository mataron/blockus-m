var Log = require('winston');
var express = require('express');
var bodyParser = require('body-parser');
var q = require('promise');
var http = require('http');
var cookieParser = require('cookie-parser');
var path = require('path');

var Router = function (Server) {
    var self = this;
    this.app = null;
    this.http = null;

    this.initializeRouter = function () {
        return new q(function (resolve) {
            Log.info('setting up the request router');
            self.app = express();

            self.app.use(bodyParser.urlencoded({extended: true}));
            self.app.use(bodyParser.json({limit: '2mb'}));
            self.app.use(cookieParser());
            self.app.use(function (err, req, res, next) {
                if (err) Log.error(err);
                next();
            });

            self.app.use(express.static(path.join(Server.root, Server.Configuration.root)));

            self.app.all('/api/*', function (req, res, next) {
                res.header("Access-Control-Allow-Origin", req.header('Origin'));
                res.header("Access-Control-Allow-Credentials", "true");
                res.header("Access-Control-Allow-Headers", "Content-Type, *");
                res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS,HEAD");
                res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
                res.header('Expires', '-1');
                res.header('Pragma', 'no-cache');
                next();
            });

            resolve();
        });
    };

    this.beginListeners = function() {
        return new q(function (resolve) {
            Log.info('starting HTTP service at port:', Server.Configuration.port);
            self.http = http.createServer(self.app);
            self.http.listen(Server.Configuration.port);

            resolve();
        });
    };
};

module.exports.Router = Router;