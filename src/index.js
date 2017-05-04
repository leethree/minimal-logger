/* @flow */

declare var __DEV__: boolean;

const isDebugEnabled = !!__DEV__;

type LogFn = (...data: Array<any>) => void;

type Logger = {
  debug: LogFn,
  error: LogFn,
  info: LogFn,
  log: LogFn,
  trace: LogFn,
  warn: LogFn,
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
};

const createLogger = (name: ?string): Logger => {
  const logFnWrapper = (func: Function): LogFn => (
    name ? func.bind(console, name) : func.bind(console)
  );

  const enabledLogger = {
    debug: logFnWrapper(console.debug),
    error: logFnWrapper(console.error),
    info: logFnWrapper(console.info),
    log: logFnWrapper(console.log),
    trace: logFnWrapper(console.trace),
    warn: logFnWrapper(console.warn),
  };

  return {
    ...isDebugEnabled ? enabledLogger : noopLogger,
    setEnabled(enabled: boolean) {
      Object.assign(this, enabled ? enabledLogger : noopLogger);
      return this;
    },
  };
};

const loggerMap: Map<string, Logger> = new Map();
const defaultLogger = createLogger();

export const getLogger = (name: ?string = null): Logger => {
  if (!name) {
    return defaultLogger;
  }
  let logger = loggerMap.get(name);
  if (!logger) {
    logger = createLogger(name);
    loggerMap.set(name, logger);
  }
  return logger;
};

export default defaultLogger;
