const Joi = require('@hapi/joi');
const controller = require('./controller');

module.exports = [
    // Serve static files
    {
        method: 'GET',
        path: '/{filename}',
        handler: (request, h) => {
            const filename = request.params.filename;
            return h.file(filename);
        }
    },
    // Get list of...
    {
        method: "GET",
        path: "/getUsers",
        options: {
            cors: {
                origin: ['*'],
            },
        },
        handler: controller.getUsers,
    },
    {
        method: "GET",
        path: "/getComment",
        options: {
            cors: {
                origin: ['*'],
            },
        },
        handler: controller.getComment,
    },
    {
        method: "GET",
        path: "/getComments",
        options: {
            cors: {
                origin: ['*'],
            },
        },
        handler: controller.getComments,
    },
    // Add comment
    {
        method: "POST",
        path: "/comment",
        options: {
            cors: {
                origin: ['*'],
            },
        },
        handler: controller.addComment,
    },
    // Add upvote
    {
        method: "POST",
        path: "/upvote",
        options: {
            cors: {
                origin: ['*'],
            },
        },
        handler: controller.addVote,
    },
];