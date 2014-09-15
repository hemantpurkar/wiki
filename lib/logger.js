/**
 * New node file
 */
 
var log4js = require('log4js');
log4js.clearAppenders();
log4js.configure({
  appenders: [
    //{ type: 'console' },
    { type: 'file', filename: 'logs/log_file.log', "maxLogSize": 20480,
        "backups": 3, category: 'wiki' }
  ]
});
var logger = log4js.getLogger('wiki');
logger.setLevel('ERROR');

exports.logger = logger;
