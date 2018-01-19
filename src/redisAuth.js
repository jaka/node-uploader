const redis = require('redis');

class redisAuth {

    constructor(url, ttl) {
        this.ttl = ttl;
        this.db = url ? redis.createClient(6379, url) : null;
    }
	
	disconnect() {
        if (this.db)
            this.db.quit();
    }

    checkFields(fields) {
        const idrx = /^[0-9a-z_]{4,16}$/i;
        return new Promise((resolve, reject) => {
            if (!fields.username || !idrx.test(fields.username))
                return reject(new Error('Invalid username format!'));
            if (!fields.password || !idrx.test(fields.password))
                return reject(new Error('Invalid password format!'));
            return resolve();
        });
    }

    verify(fields) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                if (fields.username === 'user' && fields.password === 'pass')
                    return resolve();
                return reject(new Error('Invalid password!'));
            }
            this.db.setnx(fields.username, fields.password, (err, set) => {
                if (set) {
                    this.db.expire(fields.username, this.ttl);
                    return resolve();
                }
                else {
                    this.db.get(fields.username, (err, pass) => {
                        if (!err && fields.password === pass) {
                            this.db.expire(fields.username, this.ttl);
                            return resolve();
                        }
                        else
                            return reject(new Error('Invalid password!'));
                    });
                }
            });
        });
    }

}

module.exports = redisAuth;