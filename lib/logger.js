const winston = require('winston');
const { inspect } = require('util');

const isDebug = process.env.NODE_ENV === 'development';

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
    colorize({ all: true }),
    align(),
    printf((info) => {
      const symbol = Object.getOwnPropertySymbols(info)[1];
      const message = vsprintf(info.message, info[symbol]);
      return `${info.timestamp} ${info.level}: ${message}}`;
    })
  );
}

module.exports = winston.createLogger({
  level: isDebug ? 'silly' : 'info',
  format: loggerFormat,
  transports: [new winston.transports.Console()]
});
