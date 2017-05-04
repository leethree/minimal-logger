# react-native-log

A minimal logger for React Native

### Features:

* Provides a default logger and a way to get named loggers.
* Works the same way as `console.<debug | error | info | log | trace | warn>`.
* Supports turning individual logger on or off.
* No messing up with line numbers.
* No dependencies.

### Usage

Install:
```
yarn add react-native-log
```

Default logger:
```js
import logger from 'react-native-log';

logger.warn('something went wrong.');
```

Named logger:
```js
import { getLogger } from 'react-native-log';

getLogger('foo').warn('something went wrong.');
```

Enable and disable logger:
```js
import { getLogger } from 'react-native-log';

logger = getLogger('foo');
logger.warn('something went wrong.');
logger.setEnabled(false);
logger.warn('this line will be muted.');
```

*Note*: loggers will be disabled by default if `__DEV__` is `true`.
