# minimal-logger

[![CircleCI](https://circleci.com/gh/leethree/minimal-logger.svg?style=shield)](https://circleci.com/gh/leethree/minimal-logger)
[![npm version](https://badge.fury.io/js/minimal-logger.svg)](https://www.npmjs.com/package/minimal-logger)

A minimal logger for Node and React Native

### Features:

* Provides a default logger and a way to get named loggers.
* Works the same way as `console.<debug | error | info | log | trace | warn>`.
* Supports turning individual logger on or off.
* No messing up with line numbers.
* No dependencies.

### Usage

Install:
```
yarn add minimal-logger
```

Default logger:
```js
import logger from 'minimal-logger';

logger.warn('something went wrong.');
```

Named logger:
```js
import { getLogger } from 'minimal-logger';

getLogger('foo').warn('something went wrong.');
```

Enable and disable logger:
```js
import { getLogger } from 'minimal-logger';

logger = getLogger('foo');
logger.warn('something went wrong.');
logger.setEnabled(false);
logger.warn('this line will be muted.');
```

### Notes

- Loggers will be disabled by default if `__DEV__` is `false` or `NODE_ENV` is not `dev` or `development`.
- Multiple calls to `getLogger()` with the same name will always return a reference to the same Logger object. Therefore if you disable it in one file, it will disable all references to the same Logger.
