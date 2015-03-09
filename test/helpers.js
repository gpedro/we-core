var helpers = {};

helpers.getHttp = function getHttp() {
  return  require('../lib').http;
}

helpers.getDB = function getDB() {
  return require('../lib/database');
}

helpers.capitalize = function capitalize(s){
  return s[0].toUpperCase() + s.slice(1);
}

module.exports = helpers;