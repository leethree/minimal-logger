/* @flow */

declare var __DEV__: ?boolean;

const isDev = () => {
  if (typeof __DEV__ !== 'undefined') {
    return !!__DEV__;
  } else if (process.env.NODE_ENV) {
    return process.env.NODE_ENV === 'dev';
  }
  return true;
};

const enableByDefault = isDev();

type LogFn = (...data: Array<any>) => void;

type Logger = {
  debug: LogFn,
  error: LogFn,
  info: LogFn,
  log: LogFn,
  trace: LogFn,
  warn: LogFn,
  group: LogFn,
  groupCollapsed: LogFn,
  groupEnd: () => void,
  setEnabled: (enabled: boolean) => Logger;
};

const noopFn: LogFn = () => {};

const noopLogger = {
  debug: noopFn,
  error: noopFn,
  info: noopFn,
  log: noopFn,
  trace: noopFn,
  warn: noopFn,
  group: noopFn,
  groupCollapsed: noopFn,
  groupEnd: noopFn,
};

const createLogger = (prefix: ?string): Logger => {
  const logFnWrapper = (func: Function): LogFn => (
    prefix ? func.bind(console, prefix) : func.bind(console)
  );

  const enabledLogger = {
    debug: logFnWrapper(console.debug || console.log),
    error: logFnWrapper(console.error),
    info: logFnWrapper(console.info),
    log: logFnWrapper(console.log),
    trace: logFnWrapper(console.trace),
    warn: logFnWrapper(console.warn),
    group: logFnWrapper(console.group || console.log),
    groupCollapsed: logFnWrapper(console.groupCollapsed || console.log),
    groupEnd: logFnWrapper(console.groupEnd || noopFn),
  };

  return {
    ...enableByDefault ? enabledLogger : noopLogger,
    setEnabled(enabled: boolean) {
      Object.assign(this, enabled ? enabledLogger : noopLogger);
      return this;
    },
  };
};

const loggerMap: Map<string, Logger> = new Map();
const defaultLogger = createLogger();

export const getLogger = (name: ?string = null, prefix: ?string): Logger => {
  if (!name) {
    return defaultLogger;
  }
  let logger = loggerMap.get(name);
  if (!logger) {
    logger = createLogger(prefix !== undefined ? prefix : `[${name}]`);
    loggerMap.set(name, logger);
  }
  return logger;
};

export default defaultLogger;
