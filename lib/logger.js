const winston = require('winston');
const { vsprintf } = require('sprintf-js');

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

const sprintf = winston.format((info, opts) => {
  const symbol = Object.getOwnPropertySymbols(info)[1];
  info.message = vsprintf(info.message, info[symbol]);
  return info;
});

// Display log as json for log aggregator for easy search
let loggerFormat = combine(
  timestamp(),
  addLambdaContextFormat(),
  sprintf(),
  json()
);


// Display nicely in console for debug
if (isDebug) {
  loggerFormat = combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    colorize({ all: true }),
    align(),
    sprintf(),
    printf((info) => {
      return `[${info.timestamp}] ${info.level}: ${info.message}}`;
    })
  );
}

module.exports = winston.createLogger({
  level: isDebug ? 'silly' : 'info',
  format: loggerFormat,
  transports: [new winston.transports.Console()]
});
