import { createAvailabilityLog } from '../availabilityLog';

const MESSAGES = { unavailable: 'Audio is unavailable.', available: 'Audio is back.' };

describe('createAvailabilityLog', () => {
  let debug: jest.SpyInstance;

  beforeEach(() => {
    debug = jest.spyOn(console, 'debug').mockImplementation(() => undefined);
  });

  afterEach(() => jest.restoreAllMocks());

  it('logs the first failure once, not every failure after it', () => {
    const log = createAvailabilityLog('words', MESSAGES);

    log.markUnavailable('502');
    log.markUnavailable('502');
    log.markUnavailable('502');

    expect(debug).toHaveBeenCalledTimes(1);
    expect(debug).toHaveBeenCalledWith('[words] Audio is unavailable.', '502');
  });

  it('logs once when the service comes back, and again if it fails later', () => {
    const log = createAvailabilityLog('words', MESSAGES);

    log.markUnavailable('502');
    log.markAvailable();
    log.markAvailable();
    log.markUnavailable('502');

    expect(debug.mock.calls.map(([message]) => message)).toEqual([
      '[words] Audio is unavailable.',
      '[words] Audio is back.',
      '[words] Audio is unavailable.',
    ]);
  });

  it('says nothing while the service keeps working', () => {
    const log = createAvailabilityLog('words', MESSAGES);

    log.markAvailable();
    log.markAvailable();

    expect(debug).not.toHaveBeenCalled();
  });
});
