import fastify from 'fastify';
import fetch from 'node-fetch';
import { readFileSync } from 'fs';
import * as http from 'http';

const server = fastify();
const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || 3000;
const TARGET = process.env.TARGET || 'localhost:4000';

const options = {
    agent: new http.Agent({
        ca: readFileSync(`../shared/tls/basic-certificate.cert`, (err, data) => {
            if (err) throw err;
            console.log(data);
        })
    })
};

server.get('/', async () => {
    const req = await fetch(`https://${TARGET}/recipes/42`, options);
    const payload = await req.json();
    
    return { consumer_pid: process.pid, producer_data: payload };
});
server.listen(PORT, HOST, () => {
    console.log(`Consumer running at http://${HOST}:${PORT}/`);
});
