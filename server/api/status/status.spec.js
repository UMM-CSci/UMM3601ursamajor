'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

describe('GET /api/statuss', function() {

//TODO: fix this test, it currently is not passing, and I am unsure why. It could potentially be because I am having trouble logging in even from grunt serve?
// This is fixed as of 11/15. Just an issue with some other areas having code commented out. - JPO

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/statuss')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });

});