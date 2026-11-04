jest.mock('expo-audio', () => ({ setAudioModeAsync: jest.fn() }));

type PlaybackAudioModeModule = typeof import('../playbackAudioMode');
type ExpoAudioModule = typeof import('expo-audio');

interface LoadedModule {
  ensurePlaybackAudioMode: PlaybackAudioModeModule['ensurePlaybackAudioMode'];
  setAudioMode: jest.Mock;
}

// O módulo guarda se já configurou: cada teste carrega uma cópia nova dele (e do mock).
const loadModule = (): LoadedModule => {
  const loaded: Partial<LoadedModule> = {};
  jest.isolateModules(() => {
    loaded.ensurePlaybackAudioMode =
      jest.requireActual<PlaybackAudioModeModule>('../playbackAudioMode').ensurePlaybackAudioMode;
    loaded.setAudioMode = jest.requireMock<ExpoAudioModule>('expo-audio')
      .setAudioModeAsync as unknown as jest.Mock;
  });
  if (!loaded.ensurePlaybackAudioMode || !loaded.setAudioMode) {
    throw new Error('playbackAudioMode did not load');
  }
  return {
    ensurePlaybackAudioMode: loaded.ensurePlaybackAudioMode,
    setAudioMode: loaded.setAudioMode,
  };
};

describe('ensurePlaybackAudioMode', () => {
  it('plays even with the iOS silent switch on, configuring the session only once', async () => {
    const { ensurePlaybackAudioMode, setAudioMode } = loadModule();
    setAudioMode.mockResolvedValue(undefined);

    await ensurePlaybackAudioMode();
    await ensurePlaybackAudioMode();

    expect(setAudioMode).toHaveBeenCalledTimes(1);
    expect(setAudioMode).toHaveBeenCalledWith({
      playsInSilentMode: true,
      interruptionMode: 'duckOthers',
    });
  });

  it('tries again next time when configuring fails', async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { ensurePlaybackAudioMode, setAudioMode } = loadModule();
    setAudioMode.mockRejectedValueOnce(new Error('session busy')).mockResolvedValue(undefined);

    await ensurePlaybackAudioMode();
    await ensurePlaybackAudioMode();

    expect(setAudioMode).toHaveBeenCalledTimes(2);
  });
});
