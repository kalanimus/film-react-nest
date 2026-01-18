import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new JsonLogger();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should format log message as JSON', () => {
    const message = 'test message';
    const params = ['param1', 'param2'];

    logger.log(message, ...params);

    expect(consoleSpy).toHaveBeenCalledWith(
      JSON.stringify({ level: 'log', message, optionalParams: params }),
    );
  });

  it('should format error message as JSON', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();
    const message = 'error message';

    logger.error(message);

    expect(errorSpy).toHaveBeenCalledWith(
      JSON.stringify({ level: 'error', message, optionalParams: [] }),
    );

    errorSpy.mockRestore();
  });
});
