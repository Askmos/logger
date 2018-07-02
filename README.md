# Logger for Mos services

## Installation

```shell
npm install --save Askmos/logger
```

or

```shell
yarn add Askmos/logger
```

## Usage

In your console, set your node environment to development to enable the development formatting:

`export NODE_ENV=development`

Then, inside your projects:

```javascript
const logger = require('logger');

const context = {};
logger.info('Message', context);
logger.error('Error message', context);
logger.debug('Debug messages', context);
```

We use sprintf.js to support formatted string, you can check their [documentation](https://github.com/alexei/sprintf.js).

For example:

```javascript
logger.silly('Sarting test with %j', obj);
logger.info('Test with several objects %2j, and a string %s', obj, myString);`
```

The first log will output the object in a JSON format, inlined.
The second one will add some padding to the first object, and add the string at the end of the log message.