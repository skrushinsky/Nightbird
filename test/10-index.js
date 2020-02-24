process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../app');
const should = chai.should();

chai.use(chaiHttp);

describe('index', () => {
    it('Server responds', (done) => {
        chai.request(server)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});
