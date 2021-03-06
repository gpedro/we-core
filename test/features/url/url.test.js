var assert = require('assert');
var request = require('supertest');
var helpers = require('we-test-tools').helpers;
var stubs = require('we-test-tools').stubs;
var _ = require('lodash');
var http;
var we;

describe('urlFeature', function() {
  var salvedUser, salvedUserPassword, salvedUrl;

  before(function (done) {

    http = helpers.getHttp();
    we = helpers.getWe();

    var userStub = stubs.userStub();
    helpers.createUser(userStub, function(err, user) {
      if (err) throw new Error(err);

      salvedUser = user;
      salvedUserPassword = userStub.password;

      we.db.models.url.create({
        url: '/about/me',
        modelName: 'user',
        modelId: user.id
      }).then(function(url) {
        salvedUrl = url;
        done();
      })
    })
  });

  describe('API', function() {
    it('get /about/me should url related record');
    // it('get /about/me should url related record', function(done) {

    //   request(http)
    //   .get( salvedUrl.url )
    //   .set('Accept', 'application/json')
    //   .expect(200)
    //   .end(function (err, res) {
    //     if (err) return done(err);

    //     assert( res.body.user );
    //     assert.equal( res.body.user[0].id, salvedUser.id);
    //     assert.equal( res.body.user[0].username, salvedUser.username);

    //     done();
    //   });
    // });

     it('get /about/me should render url related record');
    // it('get /about/me should render url related record', function(done) {
    //   request(http)
    //   .get( salvedUrl.url )
    //   .expect(200)
    //   .end(function (err, res) {
    //     if (err) return done(err);
    //     assert(res.text);
    //     done();
    //   });

    // });

  })
})