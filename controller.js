const Boom = require('@hapi/boom');
const Joi = require('@hapi/joi');
const { query } = require('./database');
const { readableDate, escapeText } = require('./helper');

/**
 * Gets the comment data from DB, for a given commentId
 * @param commentId
 * @returns {Promise<any>}
 */
const getCommentById = async (commentId) => JSON.parse(JSON.stringify(await query(`SELECT * FROM Comment WHERE ID=${commentId}`))).pop()

/**
 * Get all users
 * @param request
 * @param h
 * @returns {Promise<*|undefined>}
 */
async function getUsers(request, h) {
    request.params.tableName = 'User';
    return getTableContent(request, h);
}

async function getComment(request, h) {
    const { commentId } = request.query;
    if (!commentId) {
        Boom.badRequest();
    }
    try {
        const comment = await getCommentById(commentId);
        return h.response(comment);
    } catch (error) {
        Boom.boomify(error, { statusCode: 400 });
    }
}
/**
 * Get all comments
 * @param request
 * @param h
 * @returns {Promise<*|undefined>}
 */
async function getComments(request, h) {
    try {
        const results = await query(`SELECT * FROM Comment ORDER BY date DESC`);
        results.map((comment) => comment.dateFormatted = readableDate(comment.date));
        return h.response(results);
    } catch (error) {
        // Step 4: In case of errors return 400 error
        Boom.boomify(error, { statusCode: 400 });
    }
}
async function getTableContent(request, h) {
    const tableName = request.params.tableName;
    try {
        const results = await query(`SELECT * FROM ${tableName}`);
        return h.response(results);
    } catch (error) {
        // Step 4: In case of errors return 400 error
        Boom.boomify(error, { statusCode: 400 });
    }
}

/**
 * Add a new comment
 * @param request
 * @param h
 * @returns {Promise<*|undefined>}
 */
async function addComment(request, h) {
    try {
        // Check if userId and text are present
        const { userId, text, parentCommentId = null } = request.payload;
        const canAddComment = await (async () => {
            if (!userId || !text || text.length === 0) {
                return false;
            }
            return true;
        })();
        // canAddComment === false
        if (!canAddComment) {
            Boom.badRequest();
        }
        // canAddComment === true
        const queryString = `INSERT INTO Comment (userId, text, parentCommentId) VALUES (${userId}, '${escapeText(text)}', ${parentCommentId})`;
        const { insertId } = await query(queryString);
        const comment = await getCommentById(insertId);
        return h.response(comment);
    } catch (error) {
        Boom.badRequest();
    }
}

/**
 * Marks a vote for a comment
 * @param request
 * @param h
 * @returns {Promise<*|undefined>}
 */
async function addVote(request, h) {
    try {
        // Step 1: Check if userId and commentId are present
        const { userId, commentId  } = request.payload;
        const canUpvote = !userId || !commentId;
        if (!canUpvote) {
            Boom.badRequest();
        }
        // Step 2: Check if commentId is valid
        const comment = await getCommentById(commentId);
        if (!comment && !comment.id) {
            Boom.badRequest();
        }
        // Step 3: Increase vote count for comment
        const updatedVoteCount = comment.voteCount + 1;
        await query(`UPDATE Comment SET voteCount=${comment.voteCount + 1} WHERE id=${commentId}`);
        // Step 4: Return comment with updated voteCount
        return h.response({...comment, voteCount: updatedVoteCount});
    } catch (error) {
        Boom.badRequest();
    }
}

module.exports = {
    // List
    getUsers,
    getComments,
    getComment,
    // Add
    addComment,
    addVote
}