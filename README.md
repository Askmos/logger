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

```javascript
const logger = require('logger');

const context = {};
logger.info('Message', context);
logger.error('Error message', context);
logger.debug('Debug messages', context);
```
