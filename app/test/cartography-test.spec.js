var assert = require('chai').assert
const sinon = require('sinon');
var chai = require('chai');
var chaiHttp = require('chai-http');
var request = require('supertest');
chai.use(chaiHttp);


// First test to see how to use Mocha
describe('Parameter  : Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1,2,3].indexOf(4), -1);
    });
  });
});



describe('API Cartography', function() {
  describe('loading express', function () {
    var app;
    beforeEach(function () {
      app = require('../index');
    });
    afterEach(function (){
      process.exit();
    })


    it('responds to /get_spots', function testGetSpots(done) {
      this.timeout(15000);
    request(app)
      .get('/get_spots')
      .expect(200, done);
      return done();
    });
  });
});

