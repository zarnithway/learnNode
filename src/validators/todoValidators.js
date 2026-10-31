const AppError = require('../utils/AppError');

function validateTitle(title) {
    if (typeof title !== "string" || title.trim() === "") {
        throw new AppError("Title must be a non-empty string", 400);
    }

    return title.trim();
}

function validateIsDone(is_done) {
    if(typeof is_done !== "boolean") {
        throw new AppError("is_done must be a boolean", 400);
    }
    
    return is_done;
}

function validateCreate(body = {}) {
    return {
        title: validateTitle(body.title),
        is_done: validateIsDone(body.is_done),
    }
}

function validateUpdate(body = {}) {
    const changes = {};

    if(body.title !== undefined) changes.title = validateTitle(body.title);
    if(body.is_done !== undefined) changes.is_done = validateIsDone(body.is_done);

    return changes;
}

function parseId(value) {
    const id = Number(value);

    if(!Number.isInteger(id) || id <= 0) {
        throw new AppError("id must be a positive integer", 400);
    }

    return id;
}

function parseDone(value) {
    if(value === undefined) return undefined;
    if(value !== "true" && value !== "false") {
        throw new AppError("done must be 'true' of 'false'", 400);
    }

    return value === "true";
} 

module.exports = { validateCreate, validateUpdate, parseId, parseDone };