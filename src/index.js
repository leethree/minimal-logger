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

type Console = {
  debug: LogFn,
  error: LogFn,
  info: LogFn,
  log: LogFn,
  trace: LogFn,
  warn: LogFn,
  group: LogFn,
  groupCollapsed: LogFn,
  groupEnd: () => void,
};

type Logger = {
  ...$Exact<Console>,
  setEnabled: (enabled: boolean) => Logger,
};

const noopFn: LogFn = () => {};

const noopLogger: Console = {
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
  const bindPrefix = (func: LogFn): LogFn =>
    prefix ? func.bind(null, prefix) : func;

  const enabledLogger: Console = {
    debug: bindPrefix(console.debug || console.log),
    error: bindPrefix(console.error),
    info: bindPrefix(console.info),
    log: bindPrefix(console.log),
    trace: bindPrefix(console.trace),
    warn: bindPrefix(console.warn),
    group: bindPrefix(console.group || console.log),
    groupCollapsed: bindPrefix(console.groupCollapsed || console.log),
    groupEnd: bindPrefix(console.groupEnd || noopFn),
  };

  return {
    ...(enableByDefault ? enabledLogger : noopLogger),
    setEnabled(enabled: boolean) {
      Object.assign(this, enabled ? enabledLogger : noopLogger);
      return this;
    },
  };
};

const loggerMap: Map<string, Logger> = new Map();
const defaultLogger: Logger = createLogger();

export const getLogger = (name: ?string = null, prefix?: ?string): Logger => {
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
