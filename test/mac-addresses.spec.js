var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var app = require('../app');

chai.use(chaiHttp);

describe('Mac addresses', () => {
  it('should return mac addresses correctly', function (done) {
    chai.request(app)
      .get('/get_macs')
      .end((err, res) => {
        expect(res).to.have.status(200);
        var addresses = res.body;
        expect(addresses).to.be.an('array');
        expect(addresses.length).to.be.above(0);
        addresses.forEach(value => {
          expect(value.address).not.to.be.null;
        });
        done();
      });
  });
});
