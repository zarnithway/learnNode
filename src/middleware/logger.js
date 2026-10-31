const chalk = require("chalk");

function logger(req, res, next) {
    const start = Date.now();

    res.on("finish", () => {
        const ms = Date.now() - start;
        const message = `${req.method} ${req.originalUrl} ${res.statusCode} - ${ms}ms`;

        if (res.statusCode >= 500) console.log(chalk.red(message));
        else if (res.statusCode >= 400) console.log(chalk.yellow(message));
        else console.log(chalk.green(message));
    });

    next();
}

module.exports = logger;