const chalk = require("chalk");

function notFound(req, res, next) {
    res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

function errorHandler(err, req, res, next) {
    const statusCode = err.statusCode || err.status || 500;

    if (statusCode >= 500) {
        console.error(chalk.red(err.stack));
    }

    res.status(statusCode).json({
        error: statusCode >= 500 ? "Internal Server Error" : err.message,
    });
}

module.exports = { notFound, errorHandler };