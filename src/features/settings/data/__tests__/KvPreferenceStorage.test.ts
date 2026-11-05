import Storage from 'expo-sqlite/kv-store';

import { PREFERENCE_KEYS } from '@/constants/preferences';

import { KvPreferenceStorage } from '../KvPreferenceStorage';

jest.mock('expo-sqlite/kv-store', () => {
  const values = new Map<string, string>();
  return {
    __esModule: true,
    default: {
      getItemSync: (key: string) => values.get(key) ?? null,
      setItem: async (key: string, value: string) => {
        values.set(key, value);
      },
      setItemSync: (key: string, value: string) => {
        values.set(key, value);
      },
    },
  };
});

describe('KvPreferenceStorage', () => {
  it('follows the phone until a theme is saved', () => {
    expect(new KvPreferenceStorage().getTheme()).toBe('system');
  });

  it('reads back the saved theme', async () => {
    const storage = new KvPreferenceStorage();

    await storage.saveTheme('dark');

    expect(storage.getTheme()).toBe('dark');
  });

  it('treats an unknown saved value as the default', () => {
    Storage.setItemSync(PREFERENCE_KEYS.theme, 'sepia');

    expect(new KvPreferenceStorage().getTheme()).toBe('system');
  });

  it('keeps English until a language is saved, then reads it back', async () => {
    const storage = new KvPreferenceStorage();
    expect(storage.getLanguage()).toBe('en');

    await storage.saveLanguage('pt-BR');

    expect(storage.getLanguage()).toBe('pt-BR');
  });

  it('treats an unknown saved language as English', () => {
    Storage.setItemSync(PREFERENCE_KEYS.language, 'fr');

    expect(new KvPreferenceStorage().getLanguage()).toBe('en');
  });
});
