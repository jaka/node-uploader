const mime = require('mime/lite');
const path = require('path');

mime.define({'image/jpeg': ['jpg', 'jpeg']}, force = true);

class imageUtils {

    constructor() {
    }

    getExtensionFromMimeType(mimeType) {
        return new Promise((resolve, reject) => {
            const ext = mime.getExtension(mimeType);
            if (!ext)
                return reject(new Error('Invalid mimetype!'));
            return resolve(ext);
        });
    }

    getExtensionFromFileName(fileName) {
        return new Promise((resolve, reject) => {
            const ext = path.extname(fileName);
            if (ext === '')
                return reject(new Error('Invalid extension!'));
            if (ext[0] === '.')
                return resolve(ext.substr(1));
            return resolve(ext);
        });
    }

    isImageMime(mimeType) {
        const mimerx = /^image\/.+$/i;
        if (!mimeType || !mimerx.test(mimeType))
            return false;
        return true;
    }

    isImageExtension(ext) {
        const mimeType = mime.getType(ext);
        return this.isImageMime(mimeType);
    }

}

module.exports = imageUtils;