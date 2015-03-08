/**
 * Default controller
 */

module.exports = {
  // default crud actions
  find: function(req, res, next) { 
    req.context.Model.findAndCountAll()
    .done(function(err, record) {
      if (err) return res.status(500).send(err);

      var response = {};
      response[req.context.model] = record.rows;
      response.meta = {
        count: record.count
      };

      return res.status(200).send(response);
    });
  },
  create: function(req, res, next) { 

    req.context.Model.create(req.body)
    .done(function(err, record) {
      if (err) return res.send(err);
      var response = {};
      response[req.context.model] = record;
      return res.status(201).send(response);
    });
  },  
  findOne: function(req, res, next) { 
    var id = req.params.id;

    req.context.Model.find(id)
    .done(function(err, record) {
      if (err) return res.status(500).send(err);

      var response = {};
      response[req.context.model] = record;
      return res.status(200).send(response);
    });
  },
  update: function(req, res, next) { 
    var id = req.params.id;

    req.context.Model.find(id)
    .done(function(err, record) {
      if (err) return res.status(500).send(err);
      if (!record) return res.status(404).send();

      record.updateAttributes(req.body)
      .done(function(err) {
        if (err) return res.status(500).send(err);

        var response = {};
        response[req.context.model] = record;
        return res.status(200).send(response);
      });
    });
  },
  destroy: function(req, res, next) { 
    var id = req.params.id;

    req.context.Model.find(id)
    .done(function(err, record) {
      if (err) return res.status(500).send(err);
      if (!record) return res.status(404).send();

      record.destroy(req.body)
      .done(function(err) {
        if (err) return res.status(500).send(err);
        return res.status(204).send();
      });
    });
  },
  // pages actions
  editPage: function(req, res, next) { 
    console.log('TODO');
  },
  // atribute actions
  getAttribute: function(req, res, next) { 
    console.log('TODO');
  },
  updateAttribute: function(req, res, next) { 
    console.log('TODO');
  },
  deleteAttribute: function(req, res, next) { 
    console.log('TODO');
  },
  // association actions
  addRecord: function(req, res, next) { 
    console.log('TODO');
  },
  removeRecord: function(req, res, next) { 
    console.log('TODO');
  },
  getRecord: function(req, res, next) { 
    console.log('TODO');
  }
}

function parseValues(req) {
  var modelAtributes = Object.keys( we.modelsConfigs[req.context.model].definition );

}