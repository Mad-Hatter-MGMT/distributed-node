#!/usr/bin/env node
import fastify from 'fastify';
import { readFile } from 'fs';

const server = fastify({
    https: {
        key: await readFile('./tls/basic-private-key.key', (err, data) => {
            if (err) throw err;
            console.log(data);
        }),
        cert: await readFile('../shared/tls/basic-certificate.cert', (err, data) => {
            if (err) throw err;
            console.log(data);
        })
    }
});
const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || 4000;

console.log(`worker pid=${process.pid}`);

server.get('/recipes/:id', async (req, reply) => {
    console.log(`worker request pid=${process.pid}`);
    const id = Number(req.params.id);
    if (id !== 42) {
        reply.statusCode = 404;
        return { error: 'not_found' };
    }
    return {
        producer_pid: process.pid,
        recipe: {
            id, name: "Chicken Tikka Masala",
            steps: "Throw it in a pot...",
            ingredients: [
                { id: 1, name: "Chicken", quantity: "1 lb", },
                { id: 2, name: "Sauce", quantity: "2 cups", }
            ]
        }
    };
});

server.listen(PORT, HOST, () => {
    console.log(`Producer running at https://${HOST}:${PORT}`);
});
