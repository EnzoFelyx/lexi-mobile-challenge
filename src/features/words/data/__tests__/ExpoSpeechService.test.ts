import * as Speech from 'expo-speech';

import { ExpoSpeechService, speechLanguageFor } from '../ExpoSpeechService';

jest.mock('expo-speech', () => ({ speak: jest.fn(), stop: jest.fn() }));
jest.mock('../playbackAudioMode', () => ({
  ensurePlaybackAudioMode: jest.fn(async () => undefined),
}));

describe('speechLanguageFor', () => {
  it('asks Android for the language alone, the only form it accepts', () => {
    expect(speechLanguageFor('android')).toBe('en');
  });

  it('keeps the American voice on iOS', () => {
    expect(speechLanguageFor('ios')).toBe('en-US');
  });
});

describe('ExpoSpeechService', () => {
  it('reads the word in English and tells when it finishes', async () => {
    const onFinish = jest.fn();

    new ExpoSpeechService().speak('hello', onFinish);
    await Promise.resolve();
    await Promise.resolve();

    const [text, options] = jest.mocked(Speech.speak).mock.calls[0] ?? [];
    expect(text).toBe('hello');
    expect(options?.language).toBe(speechLanguageFor('ios'));
    options?.onDone?.();
    expect(onFinish).toHaveBeenCalledTimes(1);
  });
});
