const reader = require('fs');

/** 
 * Read configuration file.
 */

exports.readConfig = function (conf_file) {
  let raw = reader.readFileSync(conf_file);
  return JSON.parse(raw);
}
