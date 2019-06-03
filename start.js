'use strict';

const Hapi = require('hapi');
const fetch = require('node-fetch');

const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function awaitFetch(url) {
  return new Promise((resolve) => {
    fetch(url)
      .then(res => res.json())
      .then(resolve);
  });
}

const init = async () => {

    await server.register(require('inert'));
    server.route([
      {
        method: 'GET',
        path: '/',
        handler: async (request, h) => {
          const {delay, url, failure} = request.query;
          if (delay) {
            await timeout(delay * 1000);
          }
          if (Math.random() < failure) {
            throw new Error();
          }
          if (url) {
            return await awaitFetch(url);
          }
          return {"nothing": "1"};
        }
      }
    ]);

    await server.start();
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
