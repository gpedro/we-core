var _ = require('lodash');

module.exports = {
  html: function htmlFormater(data, req, res) {
    return res.renderPage(req, res, data);
  },
  /**
   * Response type for send html for we.js modals, only render template
   *
   * @return {String}
   */
  modal: function modalFormater(data, req, res) {
    return req.we.view.renderTemplate(res.locals.template, res.locals.theme, res.locals);
  },
  json: function jsonFormater(data, req, res) {
    if (!res.locals.model) {
      // set messages
      data.messages = res.locals.messages;
      return data;
    }

    var response = parseResponse(req, res, data);

    response.meta = res.locals.metadata;

    if (!_.isEmpty( res.locals.messages) ) {
      // set messages
      response.messages = res.locals.messages;
    }
    return response;
  },
  datatable: function(data, req, res) {
    var response =  { data: data };

    if (res.locals.metadata.count) {
      response.recordsTotal = res.locals.metadata.count;
      response.recordsFiltered = res.locals.metadata.count;
    }

    if (req.query.draw && Number(req.query.draw))
      response.draw = 1 + Number(req.query.draw) ;

    if (!_.isEmpty( res.locals.messages) ) {
      // set messages
      response.messages = res.locals.messages;
    }

    return response;
  }
};

function parseResponse(req, res, record) {
  var response = {};

  if ( !_.isEmpty( record ) ) {
    if ( _.isArray(record)) {

      response[res.locals.model] = [];

      for (var i = record.length - 1; i >= 0; i--) {
        response[res.locals.model][i] = parseRecord( req, res, record[i]);
      }
    } else {
      response[res.locals.model] = [ parseRecord( req, res, record ) ];
    }
  } else {
    response[res.locals.model] = [];
  }

  return response;
}
var singleAssociations = ['belongsTo', 'hasOne'];

function parseRecord( req, res, record) {

  for (var associationName in res.locals.Model.associations) {
    if (!record[associationName]) {
      if ( record.dataValues[ associationName + 'Id' ] ) {
        record.dataValues[ associationName ] = record[ associationName + 'Id' ];
      }
    } else {
      if (record.dataValues[ associationName + 'Id' ]) {
        record.dataValues[ associationName ] = record[ associationName + 'Id' ];
      } else if ( _.isObject(record[ associationName ] && record[ associationName ].id) ) {
        record.dataValues[ associationName ] = record[ associationName ].id;
      } else if( isNNAssoc ( record[ associationName ] ) ) {
        record.dataValues[ associationName ] = record[ associationName ].id;
      } else {
        for (var i = record.dataValues[ associationName ].length - 1; i >= 0; i--) {
          record.dataValues[ associationName ][i] = record.dataValues[ associationName ][i].id;
        }
      }
    }
  }
  return record;
}

function isNNAssoc(association) {
  if ( singleAssociations.indexOf( association.associationType ) > -1 ) {
    return true;
  }

  return false;
}