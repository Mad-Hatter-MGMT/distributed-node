#!/usr/bin/env node

import fastify from 'fastify';
import fastifyGQL from 'fastify-gql';
import { readFileSync } from 'fs';

const server = fastify();
const graphql = fastifyGQL({
    schema: readFileSync(`../shared/graphql-schema.gql`, (err, data) => {
        if (err) throw err;
        console.log(data);
    }),
    graphiql: true
});
const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || 4000;

const resolvers = {
    Query: {
        recipe: async (_, { id }) => {
            if (id !== 42) {
                return null;
            }
            return {
                id, name: "Chicken Tikka Masala",
                steps: "Throw it in a pot...",
                ingredients: [
                    { id: 1, name: "Chicken", quantity: "1 lb", },
                    { id: 2, name: "Sauce", quantity: "2 cups", }
                ]
            };
        }
    }
};

server.register(graphql);
server.listen(PORT, HOST, () => {
    console.log(`Producer running at http://${HOST}:${PORT}`);
});