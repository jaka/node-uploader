const process = require('process');

var config = {
    filelimit: 512 * 1024,   /* size in bytes */
    public: 'public/',
    redis: process.env.REDIS_URL ? process.env.REDIS_URL : null,
    ttl: 3600 * 24
};

module.exports = config;
