var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var app = require('../app');

chai.use(chaiHttp);

describe('Notifications', () => {
  it('should return notifications correctly', function (done) {
    chai.request(app)
      .get('/get_notifications')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).not.to.be.null;
        done();
      });
  });
});
