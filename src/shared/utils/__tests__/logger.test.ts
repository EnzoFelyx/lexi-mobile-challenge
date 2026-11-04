import { logger } from '../logger';

describe('logger', () => {
  afterEach(() => jest.restoreAllMocks());

  it('warns with the scope as a prefix, for real failures', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const error = new Error('locked');

    logger.warn('database', 'Could not open.', error);

    expect(warn).toHaveBeenCalledWith('[database] Could not open.', error);
  });

  it('logs expected situations only at debug level, without a warning', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const debug = jest.spyOn(console, 'debug').mockImplementation(() => undefined);

    logger.debug('words', 'Using the voice.');

    expect(debug).toHaveBeenCalledWith('[words] Using the voice.');
    expect(warn).not.toHaveBeenCalled();
  });
});
