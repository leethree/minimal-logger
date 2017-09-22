const consoleLog = jest.spyOn(global.console, 'log');

afterEach(() => {
  consoleLog.mockReset();
});

afterAll(() => {
  consoleLog.mockRestore();
});

describe('Test main logger', () => {
  const logger = require('../src/index.js').default;

  test('Main logger', () => {
    logger.log('foo');
    expect(consoleLog).toHaveBeenCalledWith('foo');
    logger.log('foo', 'bar');
    expect(consoleLog).toHaveBeenCalledWith('foo', 'bar');
  });

  test('Main logger disable', () => {
    const ret = logger.setEnabled(false);
    expect(ret).toBe(logger);
    logger.log('foo', 'bar');
    expect(consoleLog).not.toHaveBeenCalled();
  });

  test('Main logger enable', () => {
    const ret = logger.setEnabled(true);
    expect(ret).toBe(logger);
    logger.log('foo', 'bar');
    expect(consoleLog).toHaveBeenCalledWith('foo', 'bar');
  });

  test('Default logger is main logger', () => {
    const mainLogger = require('../src/index.js').getLogger();
    expect(mainLogger).toBe(logger);
  });
});

describe('Test getLogger', () => {
  const getLogger = require('../src/index.js').getLogger;
  const logger = getLogger('test');

  test('Named logger', () => {
    logger.log('foo');
    expect(consoleLog).toHaveBeenCalledWith('[test]', 'foo');
    logger.log('foo', 'bar');
    expect(consoleLog).toHaveBeenCalledWith('[test]', 'foo', 'bar');
  });

  test('Named logger disable', () => {
    const ret = logger.setEnabled(false);
    expect(ret).toBe(logger);
    logger.log('foo', 'bar');
    expect(consoleLog).not.toHaveBeenCalled();
  });

  test('Named logger enable', () => {
    const ret = logger.setEnabled(true);
    expect(ret).toBe(logger);
    logger.log('foo', 'bar');
    expect(consoleLog).toHaveBeenCalledWith('[test]', 'foo', 'bar');
  });

  test('Logger with same name is identical', () => {
    const ret = getLogger('test');
    expect(ret).toBe(logger);
  });
});

describe('Test custom prefix', () => {
  const getLogger = require('../src/index.js').getLogger;

  test('Null prefix', () => {
    const logger = getLogger('test1', null);
    logger.log('foo');
    expect(consoleLog).toHaveBeenCalledWith('foo');
    logger.log('foo', 'bar');
    expect(consoleLog).toHaveBeenCalledWith('foo', 'bar');
  });

  test('Custom prefix', () => {
    const logger = getLogger('test2', 'prefix');
    logger.log('foo');
    expect(consoleLog).toHaveBeenCalledWith('prefix', 'foo');
    logger.log('foo', 'bar');
    expect(consoleLog).toHaveBeenCalledWith('prefix', 'foo', 'bar');
  });

  test('New prefix to existing logger', () => {
    // TODO new prefix doesn't work on existing loggers
    // this behavior is not ideal
    const logger = getLogger('test1', 'prefix');
    logger.log('foo');
    expect(consoleLog).toHaveBeenCalledWith('foo');
    logger.log('foo', 'bar');
    expect(consoleLog).toHaveBeenCalledWith('foo', 'bar');
  });
});
