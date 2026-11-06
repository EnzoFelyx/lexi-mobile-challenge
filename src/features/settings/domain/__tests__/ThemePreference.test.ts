import { colorSchemeOverrideFor } from '../ThemePreference';

describe('colorSchemeOverrideFor', () => {
  it('fixes the light and dark themes', () => {
    expect(colorSchemeOverrideFor('light')).toBe('light');
    expect(colorSchemeOverrideFor('dark')).toBe('dark');
  });

  it('follows the phone again for the system theme', () => {
    expect(colorSchemeOverrideFor('system')).toBe('auto');
  });
});
