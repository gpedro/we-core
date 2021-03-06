/**
 * We.js controller class
 */
var _ = require('lodash');

/**
 * Constructor
 */
function Controller(attrs) {
  for(var attr in attrs) {
    if (attrs[attr].bind) {
      this[attr] = attrs[attr].bind(this);
    } else {
      this[attr] = attrs[attr];
    }
  }
}

/**
 * Default crud actions
 */
Controller.prototype.find = function findAll(req, res, next) {
  return res.locals.Model.findAndCountAll(res.locals.query)
  .then(function (record) {
    if (!record) return next();

    res.locals.metadata.count = record.count;
    res.locals.data = record.rows;

    return res.ok();
  });
}

/**
 * Default findOne action
 *
 * Record is preloaded in context by default
 */
Controller.prototype.findOne = function findOne(req, res, next) {
  if (!res.locals.data) return next();

  req.we.hooks.trigger('we:after:send:ok:response', {
    res: res, req: req
  }, function (err) {
    if (err) return res.serverError(err);
    return res.ok();
  });
};

Controller.prototype.create = function create(req, res) {
  if (!res.locals.template) res.locals.template = res.locals.model + '/' + 'create';

  if (!res.locals.data) res.locals.data = {};

   _.merge(res.locals.data, req.query);

  if (req.method === 'POST') {
    if (req.isAuthenticated()) req.body.creatorId = req.user.id;

    // set temp record for use in validation errors
    res.locals.data = req.query;
    _.merge(res.locals.data, req.body);

    return res.locals.Model.create(req.body)
    .then(function (record) {
      res.locals.data = record;
      res.created();
    }).catch(res.queryError);
  } else {
    res.locals.data = req.query;
    res.ok();
  }
};

// edit and update route
Controller.prototype.edit = function edit(req, res) {
  if (!res.locals.template) res.locals.template = res.local.model + '/' + 'edit';

  var record = res.locals.data;

  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    if (!record) return res.notFound();

    record.updateAttributes(req.body)
    .then(function() {
      res.locals.data = record;
      return res.updated();
    }).catch(res.queryError);
  } else {
    res.ok();
  }
};

// delete route
Controller.prototype.delete = function deletePage(req, res) {
  if (!res.locals.template)
    res.locals.template = res.local.model + '/' + 'delete';

  var record = res.locals.data;
  if (!record) return res.notFound();

  res.locals.deleteMsg = res.locals.model+'.delete.confirm.msg';

  if (req.method === 'POST' || req.method === 'DELETE') {
    record.destroy().then(function() {
      res.locals.deleted = true;
      return res.deleted();
    }).catch(res.queryError);
  } else {
    return res.ok();
  }
}

Controller.prototype.getAttribute = function getAttribute(req, res, next) {
  console.log('TODO');  next();
};

Controller.prototype.updateAttribute = function(req, res, next) {
  console.log('TODO');  next();
};

Controller.prototype.deleteAttribute = function(req, res, next) {
  console.log('TODO');  next();
};

Controller.prototype.addRecord = function(req, res, next) {
  console.log('TODO');  next();
};

Controller.prototype.removeRecord = function(req, res, next) {
  console.log('TODO');  next();
};

Controller.prototype.getRecord = function(req, res, next) {
  console.log('TODO');  next();
};

module.exports = Controller;
