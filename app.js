'use strict';

const Hapi = require('@hapi/hapi');
const utils = require('./utils/utils');
const Vision = require('vision');
const hbs = require('hbs');

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    await server.register(Vision);

    server.views({
        engines: {
            html: hbs
        },
        relativeTo: __dirname,
        path: 'templates'
    });

    server.route({
        method: 'POST',
        path: '/transform',
        handler: (request, h) => {
            var inpuData = request.payload;
            var transformedData = utils.transformData(inpuData);
            return transformedData;
        }
    });

    server.route({
        method: 'GET',
        path: '/search',
        handler: async (request, h) => {
            try {
                let result = await utils.searchInRepos();
                return h.view('index', {
                    searchResult: result.data.items,
                });
            } catch (error) {
                return error
            }
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();