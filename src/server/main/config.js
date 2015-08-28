var Log = require('winston');
var fs = require('fs');
var path = require('path');
var q = require('promise');

var Configuration = function () {
    var self = this;

    this._config_filename = null;

    this.load = function (filename) {
        self._config_filename = filename;
        return new q(function (resolve, reject) {
            Log.info('Loading configuration from:', filename);

            q.denodeify(fs.readFile)(filename, {encoding: 'utf8'}).then(
                function (configuration_string) {
                    var cfg = JSON.parse(configuration_string);
                    Object.keys(cfg).forEach(function (key) {
                        self[key] = cfg[key];
                    });

                    resolve();
                },
                function (x) {
                    Log.error('config reading failed', x);
                    reject(x);
                }
            );
        });
    };

    this.getSourceFilename = function () {
        return self._config_filename;
    };
};

module.exports.Configuration = Configuration;