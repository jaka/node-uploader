const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

const config = require('./config');
const imageUtils = require('./src/imageUtils');
const redisAuth = require('./src/redisAuth');

const rA = new redisAuth(config.redis, config.ttl);
const iU = new imageUtils();

const app = express();
const uploadFile = multer({dest: 'uploads/', limits: {fileSize: config.filelimit, fields: 0}}).single('img');

/**************/

const checkAuth = async(req, res, next) => {

    try {
        var errorCode = 400;
        await rA.checkFields(req.params);
        var errorCode = 403;
        await rA.verify(req.params);
    }
    catch (err) {
        err.status = errorCode;
        next(err);
    }
    next();
};

const checkLength = (req, res, next) => {

    try {
        var errorCode = 500;
        if (!req.headers || !req.headers.hasOwnProperty('content-length'))
            throw new Error('Missing header!');

        const content_length = parseInt(req.headers['content-length']);
        if (!content_length || isNaN(content_length))
            throw new Error('Missing header!');

        var errorCode = 400;
        if (content_length > config.filelimit)
            throw new Error('File object too large!');
    }
    catch (err) {
        err.status = errorCode;
        next(err);
    }
    next();
};

const upload = (req, res, next) => {

    uploadFile(req, res, async(err) => {

        if (err && err.code === 'LIMIT_FILE_SIZE') {
            var error = new Error('File object too large!');
            error.status = 400;
            return next(error);
        }

        if (err || !req.file)
            return next(new Error('Cannot access file object!'));

        try {

            if (!iU.isImageMime(req.file.mimetype))
                throw(new Error('Invalid mimetype!'));

            const ext = await iU.getExtensionFromMimeType(req.file.mimetype);
            const dest = path.join(config.public, req.params.username + '.' + ext);

            fs.copyFile(req.file.path, dest, (err) => {
                fs.unlinkSync(req.file.path);
                if (err) {
                    return res.status(500).json({message: 'Cannot move file object!'});
                }
                return res.status(201).json({filename: dest});
            });

        }
        catch (err) {
            err.status = 400;
            fs.unlink(req.file.path, () => {
                next(err);
            });
        }

    });

};

const ready = (req, res) => {
    return res.status(200).json({message: 'Uploader ready.'});
};

/**************/

app.use((req, res, next) => {
    res.header('X-powered-by', 'Perpro');
    return next();
})

app.get('/', ready);
app.post('/:username/:password', checkLength, checkAuth, upload);

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.json({message: error.message || 'Internal server error!'});
})

module.exports = app;
