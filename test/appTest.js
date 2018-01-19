const fs = require('fs');
const expect = require('chai').expect;
const request = require('supertest');

const app = require('../app');

var server;

before(() => {
    server = app.listen();
})

after(() => {
    server.close();
});

describe('API', () => {

    it('GET /', (done) => {
        request(app).get('/').end((err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.be.equal('Uploader ready.');
            done(); 
        });
    });

    it('POST /', (done) => {
        request(app).post('/').send({}).end((err, res) => { 
            expect(res.statusCode).to.equal(404);
            expect(res.body).to.be.an('object');
            expect(res.body).to.be.empty;
            done(); 
        });
    });

    it('POST /a/a/', (done) => {
        request(app).post('/a/a/').send({}).end((err, res) => { 
            expect(res.statusCode).to.equal(400);
            expect(res.body).to.be.an('object');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.be.equal('Invalid username format!');
            done(); 
        });
    });

    it('POST /aaaa/aaaa/', (done) => {
        request(app).post('/aaaa/aaaa/').send({}).end((err, res) => { 
            expect(res.statusCode).to.equal(403);
            expect(res.body).to.be.an('object');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.be.equal('Invalid password!');
            done(); 
        });
    });

    it('POST /user/pass/', (done) => {
        request(app).post('/user/pass/').send({}).end((err, res) => { 
            expect(res.statusCode).to.equal(500);
            expect(res.body).to.be.an('object');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.be.equal('Cannot access file object!');
            done(); 
        });
    });

    describe('File upload', () => {

        before(() => {
            fs.mkdir('public/', '0777', (err) => {});
        });

        after(() => {
            fs.rmdir('public/', (err) => {});
        });

        it('files: empty', (done) => {
            request(app).post('/user/pass/').attach('files', './test/empty.dat').end((err, res) => {
                expect(res.statusCode).to.equal(500);
                expect(res.body).to.be.an('object');
                expect(res.body.message).to.be.a('string');
                expect(res.body.message).to.be.equal('Cannot access file object!');
                done();
            });
        });

        it('img: empty', (done) => {
            request(app).post('/user/pass/').attach('img', './test/empty.dat').end((err, res) => {
                expect(res.statusCode).to.equal(400);
                expect(res.body).to.be.an('object');
                expect(res.body.message).to.be.a('string');
                expect(res.body.message).to.be.equal('Invalid mimetype!');
                done();
            });
        });

        it('img: noise', (done) => {
            request(app).post('/user/pass/').attach('img', './test/noise.png').end((err, res) => {
                expect(res.statusCode).to.equal(400);
                expect(res.body).to.be.an('object');
                expect(res.body.message).to.be.a('string');
                expect(res.body.message).to.be.equal('File object too large!');
                done();
            });
        });

        it('img: image', (done) => {
            request(app).post('/user/pass/').attach('img', './test/image.png').end((err, res) => {
                expect(res.statusCode).to.equal(201);
                expect(res.body).to.be.an('object');
                expect(res.body.filename).to.be.a('string');
                expect(res.body.filename).to.be.equal('public/user.png');
                fs.unlink(res.body.filename, (err) => {
                    done();
                });
            });
        });

    });
});