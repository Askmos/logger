const winston = require('winston');

const isDebug = process.env.NODE_ENV === 'development'

const {
  combine,
  timestamp,
  json,
  colorize,
  align,
  printf
} = winston.format;

// Adding context to the log
const addLambdaContextFormat = winston.format(info => (
  Object.assign(info, { stage: process.env.NODE_ENV })
));

// Display log as json for log aggregator for easy search
let loggerFormat = combine(
  timestamp(),
  addLambdaContextFormat(),
  json()
);

// Display nicely in console for debug
if (isDebug) {
  loggerFormat = combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    align(),
    colorize({ all: true }),
    printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
  );
}

module.exports = winston.createLogger({
  level: isDebug ? 'silly' : 'info',
  format: loggerFormat,
  transports: [new winston.transports.Console()]
});
