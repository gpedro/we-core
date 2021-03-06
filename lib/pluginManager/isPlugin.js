var fs = require('fs');
var path = require('path');

var cache = {};
/**
 * Helper to check if a npm module is a plugin
 * The logic is: is plugin if a npm module have the plugin.js file
 *
 * @param  {String}  nodeModulePath
 * @return {Boolean}
 */
module.exports = function isPlugin(nodeModulePath) {
  // first check in cache
  if (typeof cache[nodeModulePath] !== 'undefined')
    return cache[nodeModulePath];
  // then check if the npm module is one plugin
  try {
    if (fs.statSync( path.resolve( nodeModulePath, 'plugin.js' ) )) {
      cache[nodeModulePath] = true;
    } else {
      cache[nodeModulePath] = false;
    }
  } catch(e) {
    cache[nodeModulePath] = false;
  }

  return cache[nodeModulePath]
}