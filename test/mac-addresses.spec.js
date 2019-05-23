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
        // var l = JSON.parse(res.text);
        // l.forEach(function (e) {
        //   assert(e.address != undefined);
        // });
        expect(res.text).to.equal('Notification ajoutée avec succès !');
        done();
      });
  });
});
