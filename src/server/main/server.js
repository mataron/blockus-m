var Log = require('winston');
var q = require('promise');
var fs = require('fs');

var Configuration = require('./config').Configuration;
var Router = require('./router').Router;

var Server = function (root) {
    var self = this;

    this.root = root;
    this.Configuration = null;
    this.Router = null;

    this.start = function (configurationFilename) {
        return new q(function (resolve, reject) {
            var _init_reject = function () {
                Log.error("Server startup failed...");
                reject();
            };

            self._loadConfiguration(configurationFilename).then(
                function () {
                    return self._setupLogging();
                },
                _init_reject
            ).then(
                function () {
                    self.Router = new Router(self);
                    return self.Router.initializeRouter();
                },
                _init_reject
            ).then(
                function () {
                    return self.Router.beginListeners();
                },
                _init_reject
            ).then(
                function () {
                    Log.info('Server started');
                    resolve();
                },
                _init_reject
            );
        });
    };

    this._loadConfiguration = function (filename) {
        self.Configuration = new Configuration(root);
        return self.Configuration.load(filename);
    };

    this._setupLogging = function () {
        return new q(function (resolve) {
            Log.level = self.Configuration.logLevel;
            resolve();
        });
    };
};

module.exports.Server = Server;