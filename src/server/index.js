var Log = require('winston');
var q = require('promise');
var path = require('path');
var Server = require('./main/server').Server;

var ConfigurationFilename = process.argv[2] || path.join(__dirname, 'config.json');

new Server(__dirname)
    .start(ConfigurationFilename)
    .then(
        function() {
            Log.info('Server up!');
        },
        function() {
            Log.error('Server failed (parameters:', arguments,')');
            process.exit(1);
        }
    );
