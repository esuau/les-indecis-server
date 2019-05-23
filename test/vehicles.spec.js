var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var app = require('../app');

chai.use(chaiHttp);

describe('Vehicles', () => {
  it('should return vehicles correctly', function (done) {
    chai.request(app)
      .get('/get_vehicles')
      .end((err, res) => {
        expect(res).to.have.status(200);
        var result = res.body;
        expect(result).not.to.be.null;
        expect(result.length).to.be.above(0);
        result.forEach(value => {
          expect(value.id).not.to.be.undefined;
          expect(value.name).not.to.be.undefined;
          expect(value.brand).not.to.be.undefined;
          expect(value.model).not.to.be.undefined;
          expect(value.status).not.to.be.undefined;
        });
        done();
      });
  });
});
