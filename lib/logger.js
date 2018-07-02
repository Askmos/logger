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

const getContextFromSplat = (info, splat) => {
  if (!splat) return info;
  splat.map(item => {
    if (typeof item === 'object') Object.assign(info, item);
  });
  return info;
};

const sprintf = winston.format((info) => {
  const symbolSplat = Object.getOwnPropertySymbols(info)[1];
  info.message = vsprintf(info.message, info[symbolSplat]);
  return getContextFromSplat(info, info[symbolSplat]);
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
    sprintf(),
    printf((info) => {
      const context = Object.assign({}, info);
      delete context.message;
      delete context.timestamp;
      delete context.level;
      return `[${info.timestamp}] ${info.level}: ${info.message}\ncontext: ${JSON.stringify(context,null,'  ')}`;
    })
  )
}

module.exports = winston.createLogger({
  level: isDebug ? 'silly' : 'info',
  format: loggerFormat,
  transports: [new winston.transports.Console()]
});
