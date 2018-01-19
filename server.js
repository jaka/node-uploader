const http = require('http');
const process = require('process');

const app = require('./app');

const server = http.createServer(app);

const port = process.env.PORT || 8000;
server.listen(port, () => {
    console.log('HTTP server listening...');
});