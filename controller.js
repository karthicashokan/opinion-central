const Boom = require('@hapi/boom');
const { query } = require('./database');

async function getUsers(request, h) {
    request.params.tableName = 'User';
    return getTableContent(request, h);
}
async function getComments(request, h) {
    request.params.tableName = 'Comment';
    return getTableContent(request, h);
}
async function getUpvotes(request, h) {
    request.params.tableName = 'Upvote';
    return getTableContent(request, h);
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

async function addComment(request, h) {
    try {
        // Check if userId and text are present
        const { userId, text, parentCommentId = null } = JSON.parse(request.payload);
        const canAddComment = await (async () => {
            if (!userId || !text || text.length === 0) {
                return false;
            }
            if (parentCommentId) {
                // If parentCommentId is present, check if it's valid
                const parentComment = await query(`SELECT * FROM Comment WHERE id=${parentCommentId}`);
                if (parentComment && parentComment.id) {
                    return true
                } else {
                    return false
                }
            }
            return true;
        })();
        // canAddComment === false
        if (!canAddComment) {
            Boom.badRequest();
        }
        // canAddComment === true
        const { insertId } = await query(`INSERT INTO Comment (userId, text, parentCommentId) VALUES (${userId}, '${text}', ${parentCommentId})`);
        const comment = await query(`SELECT * FROM COMMENT WHERE ID=${insertId}`);
        return h.response(comment);
    } catch (error) {
        Boom.badRequest();
    }
}

async function addVote(request, h) {
    try {
        // Step 1: Check if userId and commentId are present
        const { userId, commentId  } = JSON.parse(request.payload);
        const canUpvote = !userId || !commentId;
        if (!canUpvote) {
            Boom.badRequest();
        }
        // Step 2: Check if commentId is valid
        const comment = JSON.parse(JSON.stringify(await query(`SELECT * FROM Comment WHERE ID=${commentId}`))).pop();
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
    getUpvotes,
    // Add
    addComment,
    addVote
}