const expect = require('chai').expect;

const redisAuth = require('../src/redisAuth');
const rA = new redisAuth(null, 10);

const to = (promise) => promise.then(data => [null, data]).catch(err => [err]);

describe('redisAuth', () => {

    it('checkFields', async() => {
        var data = await rA.checkFields({username: 'aaaa', password: 'aaaa'});
        expect(data).to.be.an('undefined');
        var [err, data] = await to(rA.checkFields({username: null}));
        expect(err).to.be.an('error');
        expect(err.message).to.equal('Invalid username format!');
        var [err, data] = await to(rA.checkFields({username: 'null'}));
        expect(err).to.be.an('error');
        expect(err.message).to.equal('Invalid password format!');
    });

});
