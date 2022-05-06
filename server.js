const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const Path = require('path');

const port = 3001;
const server = Hapi.server({
    port,
    host: '0.0.0.0',
    routes: {
        files: {
            relativeTo: Path.join(__dirname, 'public')
        }
    }
});

// Get routes from routes.js
routes.forEach((route) => {
    server.route(route);
});

server.route({
    method: 'GET',
    path: '/picture.jpg',
    handler: function (request, h) {

        return h.file('picture.jpg');
    }
});

const start = async () => {
    await server.register(require('@hapi/inert'));
    await server.start();
};

// Start HAPI server
start()
    .then(() => {
        console.log('Server started at ', port);
    })
    .catch((error) => {
        console.log('Error encountered with server', error);
    })