const winston = require('winston');

const {
  combine,
  timestamp,
  json,
  colorize,
  simple
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
if (process.env.NODE_ENV === 'development') {
  loggerFormat = combine(
    colorize(),
    simple()
  );
}

module.exports = winston.createLogger({
  format: loggerFormat,
  transports: [new winston.transports.Console()]
});
