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
