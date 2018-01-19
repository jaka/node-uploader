const expect = require('chai').expect;

const imageUtils = require('../src/imageUtils');
const iU = new imageUtils();

const to = (promise) => promise.then(data => [null, data]).catch(err => [err]);

describe('imageUtils', () => { 

    it('getExtensionFromMimeType', async() => {
        var data = await iU.getExtensionFromMimeType('image/jpeg');
        expect(data).to.equal('jpg');
        var data = await iU.getExtensionFromMimeType('image/png');
        expect(data).to.equal('png');
        var [err, data] = await to(iU.getExtensionFromMimeType('imagepng'));
        expect(err).to.be.an('error');
        expect(err.message).to.equal('Invalid mimetype!');
    });

    it('getExtensionFromFileName', async() => {
        var data = await iU.getExtensionFromFileName('image.png');
        expect(data).to.equal('png');
        var data = await iU.getExtensionFromFileName('dir/text.txt');
        expect(data).to.equal('txt');
        var [err, data] = await to(iU.getExtensionFromFileName('image'));
        expect(err).to.be.an('error');
        expect(err.message).to.equal('Invalid extension!');
    });

    it('isImageMime', () => {
        var bool = iU.isImageMime('image/png');
        expect(bool).to.equal(true);
        var bool = iU.isImageMime('text/txt');
        expect(bool).to.equal(false);
    });

    it('isImageExtension', () => {
        var bool = iU.isImageExtension('png');
        expect(bool).to.equal(true);
        var bool = iU.isImageExtension('html');
        expect(bool).to.equal(false);
    });

});