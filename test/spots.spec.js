var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var app = require('../app');

chai.use(chaiHttp);

describe('Parking spots', () => {
  it('should return spots correctly', function (done) {
    chai.request(app)
      .get('/get_spots')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).not.to.be.null;
        done();
      });
  });
});
