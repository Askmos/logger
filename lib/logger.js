const winston = require('winston');
const { vsprintf } = require('sprintf-js');

const isDebug = process.env.NODE_ENV === 'development';

const {
  combine,
  timestamp,
  json,
  colorize,
  printf,
} = winston.format;

// Adding context to the log
const addLambdaContextFormat = winston.format(info => (
  Object.assign(info, { stage: process.env.NODE_ENV })
));

const addArgsContext = winston.format(info => {
  const context = Object.assign({}, info);
  ['message', 'timestamp', 'level'].forEach(key => delete context[key]);
  info.message = `${info.message}\n context: ${JSON.stringify(context,null,'  ')}`;
  return info
});

const sprintf = winston.format((info) => {
  const symbolSplat = Object.getOwnPropertySymbols(info)[1];
  info.message = vsprintf(info.message, info[symbolSplat]);
  return getContextFromSplat(info, info[symbolSplat]);
});

const getContextFromSplat = (info, splat) => {
  if (!splat) return info;
  splat.filter(item => typeof item === 'object').forEach(item => Object.assign(info, item));
  return info;
};

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
    sprintf(),
    addArgsContext(),
    printf((info) => {
      return `[${info.timestamp}] ${info.level}: ${info.message}`;
    })
  )
}

module.exports = winston.createLogger({
  level: isDebug ? 'silly' : 'info',
  format: loggerFormat,
  transports: [new winston.transports.Console()]
});
