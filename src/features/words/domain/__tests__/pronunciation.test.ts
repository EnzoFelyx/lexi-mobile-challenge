import { accentOf, pickPronunciation } from '../pronunciation';

describe('pronunciation', () => {
  it('reads the accent from the audio file name', () => {
    expect(accentOf('https://api.dictionaryapi.dev/media/pronunciations/en/hello-uk.mp3')).toBe(
      'uk',
    );
    expect(accentOf('https://audio/hello-US.mp3')).toBe('us');
    expect(accentOf('https://audio/hello.mp3')).toBeNull();
  });

  it('plays the first audio of the API', () => {
    expect(pickPronunciation(['https://audio/hello-au.mp3', 'https://audio/hello-uk.mp3'])).toEqual(
      {
        source: 'audio',
        url: 'https://audio/hello-au.mp3',
        accent: 'au',
      },
    );
  });

  it('falls back to the device voice when there is no audio', () => {
    expect(pickPronunciation([])).toEqual({ source: 'voice' });
  });
});
