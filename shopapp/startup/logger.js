const { transports, createLogger, format } = require("winston");
const { combine, timestamp, prettyPrint } = format;
const config = require("config");
require("winston-mongodb");

const username = config.get("db.username");
const password = config.get("db.password");
const database = config.get("db.name");

const logger = createLogger({
    level: 'error',
    format: combine(
        timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
        prettyPrint()
    ),
    transports: [
        new transports.Console(),
        new transports.File({filename: "logs/logs.log", level: "error", maxFiles:'3d'}),
        new transports.File({filename: "logs/exceptions.log" ,level:"error", handleExceptions: true, handleRejections: true, maxFiles:'3d'}),
        new transports.MongoDB({
            level: 'error',
            db: `mongodb://${config.get("db.username")}:${config.get("db.password")}@${config.get("db.host")}:${config.get("db.port")}/${config.get("db.name")}`,
            options: {
                useUnifiedTopology: true
            },
            collection: "server_logs"
        })
    ]
});

module.exports = logger;