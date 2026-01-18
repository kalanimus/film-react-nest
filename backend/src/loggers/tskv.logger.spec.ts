import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new TskvLogger();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should format log message as TSKV', () => {
    const message = 'test message';
    const params = ['param1'];

    logger.log(message, ...params);

    const call = consoleSpy.mock.calls[0][0];
    expect(call).toContain('level=log');
    expect(call).toContain('message=test message');
    expect(call).toContain('params=["param1"]');
    expect(call).toContain('time=');
  });

  it('should format error message as TSKV', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();
    const message = 'error message';

    logger.error(message);

    const call = errorSpy.mock.calls[0][0];
    expect(call).toContain('level=error');
    expect(call).toContain('message=error message');

    errorSpy.mockRestore();
  });

  it('should separate fields with tabs', () => {
    logger.log('test');

    const call = consoleSpy.mock.calls[0][0];
    expect(call).toMatch(/level=log\t.*\t.*\t.*/);
  });
});
