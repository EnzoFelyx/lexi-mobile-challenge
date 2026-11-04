import { act, renderHook } from '@testing-library/react-native';

import { PLAYER_LOAD_TIMEOUT_MS } from '@/constants/audio';
import { container } from '@/core/di/container';
import { TOKENS } from '@/core/di/tokens';

import type {
  AudioPlaybackStatus,
  PronunciationAudio,
  PronunciationAudioCache,
  PronunciationAudioFactory,
  SpeechService,
} from '../../domain/PronunciationAudio';
import { usePronunciation } from '../usePronunciation';

const UK_AUDIO = 'https://audio/hello-uk.mp3';
const LOCAL_FILE = 'file:///cache/pronunciations/hello-uk.mp3';

const fakeAudio = () => {
  let listener: (status: AudioPlaybackStatus) => void = () => undefined;
  const audio: PronunciationAudio = {
    play: jest.fn(),
    pause: jest.fn(),
    seekToStart: jest.fn().mockResolvedValue(undefined),
    subscribe: jest.fn((next) => {
      listener = next;
      return jest.fn();
    }),
    release: jest.fn(),
  };
  const emit = (status: Partial<AudioPlaybackStatus>) =>
    act(() =>
      listener({
        isLoaded: true,
        playing: false,
        currentTime: 0,
        duration: 2,
        didJustFinish: false,
        ...status,
      }),
    );
  return { audio, emit };
};

const register = (audio: PronunciationAudio, resolve: PronunciationAudioCache['resolve']) => {
  const speech: SpeechService & { finish: () => void } = {
    finish: () => undefined,
    speak: jest.fn((_text: string, onFinish: () => void) => {
      speech.finish = onFinish;
    }),
    stop: jest.fn(),
  };
  const factory: PronunciationAudioFactory = { create: jest.fn(() => audio) };
  const cache: PronunciationAudioCache = { resolve: jest.fn(resolve) };
  container.registerInstance<PronunciationAudioFactory>(TOKENS.PronunciationAudioFactory, factory);
  container.registerInstance<PronunciationAudioCache>(TOKENS.PronunciationAudioCache, cache);
  container.registerInstance<SpeechService>(TOKENS.SpeechService, speech);
  return { factory, speech, cache };
};

// Deixa a promessa do cache resolver dentro do act.
const flush = () => act(async () => undefined);

const renderLoaded = async (audio: PronunciationAudio) => {
  const rendered = await renderHook(() => usePronunciation('hello', [UK_AUDIO]));
  await flush();
  return rendered;
};

describe('usePronunciation', () => {
  let debug: jest.SpyInstance;

  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    debug = jest.spyOn(console, 'debug').mockImplementation(() => undefined);
  });

  afterEach(() => jest.restoreAllMocks());

  it('plays the mp3 from the device cache, with its accent and duration', async () => {
    const { audio, emit } = fakeAudio();
    const { factory, cache } = register(audio, async () => LOCAL_FILE);

    const { result } = await renderLoaded(audio);
    expect(result.current.status).toBe('loading');
    await emit({});

    expect(cache.resolve).toHaveBeenCalledWith(UK_AUDIO);
    expect(factory.create).toHaveBeenCalledWith(LOCAL_FILE);
    expect(result.current).toMatchObject({
      kind: 'audio',
      accent: 'uk',
      status: 'ready',
      duration: 2,
    });
  });

  it('plays, reports the progress and rewinds when it finishes', async () => {
    const { audio, emit } = fakeAudio();
    register(audio, async () => LOCAL_FILE);
    const { result } = await renderLoaded(audio);
    await emit({});

    await act(async () => result.current.toggle());
    await emit({ playing: true, currentTime: 1 });

    expect(audio.play).toHaveBeenCalled();
    expect(result.current.status).toBe('playing');
    expect(result.current.progress).toBe(0.5);

    await emit({ didJustFinish: true, currentTime: 2 });

    expect(result.current.status).toBe('ready');
    expect(result.current.progress).toBe(0);
    expect(audio.seekToStart).toHaveBeenCalled();
  });

  it('pauses while playing', async () => {
    const { audio, emit } = fakeAudio();
    register(audio, async () => LOCAL_FILE);
    const { result } = await renderLoaded(audio);
    await emit({ playing: true });

    await act(async () => result.current.toggle());

    expect(audio.pause).toHaveBeenCalled();
  });

  it('uses the device voice when there is no audio', async () => {
    const { audio } = fakeAudio();
    const { speech, factory } = register(audio, async () => LOCAL_FILE);
    const { result } = await renderHook(() => usePronunciation('qi', []));

    await act(async () => result.current.toggle());

    expect(factory.create).not.toHaveBeenCalled();
    expect(speech.speak).toHaveBeenCalledWith('qi', expect.any(Function));
    expect(result.current).toMatchObject({ kind: 'voice', status: 'playing', progress: 1 });

    await act(async () => speech.finish());

    expect(result.current).toMatchObject({ status: 'ready', progress: 0, duration: null });
  });

  it('switches to the device voice right away when the download fails', async () => {
    const { audio } = fakeAudio();
    const { factory } = register(audio, async () => {
      throw new Error('response has status 502');
    });

    const { result } = await renderLoaded(audio);

    expect(factory.create).not.toHaveBeenCalled();
    expect(result.current).toMatchObject({ kind: 'voice', status: 'ready' });
  });

  it('falls back to the voice once, without a second notice when the timeout comes later', async () => {
    jest.useFakeTimers();
    const { audio } = fakeAudio();
    register(audio, async () => {
      throw new Error('response has status 502');
    });
    await renderLoaded(audio);

    await act(async () => jest.advanceTimersByTime(PLAYER_LOAD_TIMEOUT_MS));

    expect(debug).toHaveBeenCalledTimes(1);
    expect(console.warn).not.toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('ignores the mp3 if it arrives after the voice has taken over', async () => {
    jest.useFakeTimers();
    const { audio } = fakeAudio();
    let deliver: (uri: string) => void = () => undefined;
    const { factory } = register(
      audio,
      () => new Promise<string>((resolve) => (deliver = resolve)),
    );
    const { result } = await renderHook(() => usePronunciation('hello', [UK_AUDIO]));
    await act(async () => jest.advanceTimersByTime(PLAYER_LOAD_TIMEOUT_MS));

    await act(async () => deliver(LOCAL_FILE));

    expect(factory.create).not.toHaveBeenCalled();
    expect(result.current.kind).toBe('voice');
    jest.useRealTimers();
  });

  it('switches to the device voice when the audio is not ready in time', async () => {
    jest.useFakeTimers();
    const { audio } = fakeAudio();
    register(audio, () => new Promise<string>(() => undefined));
    const { result } = await renderHook(() => usePronunciation('hello', [UK_AUDIO]));

    await act(async () => jest.advanceTimersByTime(PLAYER_LOAD_TIMEOUT_MS));

    expect(result.current).toMatchObject({ kind: 'voice', status: 'ready' });
    jest.useRealTimers();
  });

  it('releases the audio when the detail closes', async () => {
    const { audio } = fakeAudio();
    register(audio, async () => LOCAL_FILE);
    const { unmount } = await renderLoaded(audio);

    await unmount();

    expect(audio.release).toHaveBeenCalled();
  });
});
