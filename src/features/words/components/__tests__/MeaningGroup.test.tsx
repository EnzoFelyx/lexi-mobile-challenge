import { fireEvent, render, screen } from '@testing-library/react-native';

import { MEANING_PREVIEW_COUNT } from '@/constants/words';
import { en } from '@/i18n/en';

import type { Meaning } from '../../domain/WordDetail';
import { MeaningGroup } from '../MeaningGroup';

const meaningWith = (count: number): Meaning => ({
  partOfSpeech: 'verb',
  definitions: Array.from({ length: count }, (_, index) => ({
    definition: `Definition ${index + 1}`,
    example: index === 0 ? 'An example.' : null,
  })),
});

describe('MeaningGroup', () => {
  it('shows the part of speech, the definitions and the quoted example', async () => {
    await render(<MeaningGroup meaning={meaningWith(2)} />);

    expect(screen.getByText('verb')).toBeOnTheScreen();
    expect(screen.getByText('Definition 2')).toBeOnTheScreen();
    expect(screen.getByText('“An example.”')).toBeOnTheScreen();
    expect(screen.queryByRole('button')).not.toBeOnTheScreen();
  });

  it('shows only the first definitions until "Show more" is pressed', async () => {
    const total = MEANING_PREVIEW_COUNT + 2;
    await render(<MeaningGroup meaning={meaningWith(total)} />);

    expect(screen.queryByText(`Definition ${total}`)).not.toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: en.wordDetail.showMore(2) }));

    expect(screen.getByText(`Definition ${total}`)).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: en.wordDetail.showLess })).toBeOnTheScreen();
  });
});
