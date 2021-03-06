var i18n = require('i18n');
var moment = require('moment');

var localization = function init(we) {
  i18n.configure (we.config.i18n);
  // set i18n middleware
  we.express.use(i18n.init);

  we.i18n = i18n;

  // set default moment locale
  moment.locale(we.config.i18n.defaultLocale);

  we.express.use(function setCurrentUserLocale(req, res, next) {
    if (req.user && req.user.language) {
      if (we.config.i18n.locales.indexOf(req.user.language) > -1) {
        req.setLocale(req.user.language);
      }
    }
    next();
  })

};

module.exports = localization;