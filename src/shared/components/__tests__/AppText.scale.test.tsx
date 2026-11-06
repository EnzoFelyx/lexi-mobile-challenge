import { render, screen } from '@testing-library/react-native';

import { MAX_COMPACT_FONT_SCALE, MAX_FONT_SCALE } from '@/constants/accessibility';

import { AppText } from '../AppText';

describe('AppText font scaling', () => {
  it('follows the system font up to 200%', async () => {
    await render(<AppText>hello</AppText>);

    expect(screen.getByText('hello').props.maxFontSizeMultiplier).toBe(MAX_FONT_SCALE);
  });

  it('accepts a lower limit where the space is fixed', async () => {
    await render(<AppText maxFontSizeMultiplier={MAX_COMPACT_FONT_SCALE}>hello</AppText>);

    expect(screen.getByText('hello').props.maxFontSizeMultiplier).toBe(MAX_COMPACT_FONT_SCALE);
  });
});
