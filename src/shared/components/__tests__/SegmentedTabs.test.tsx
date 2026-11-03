import { fireEvent, render, screen } from '@testing-library/react-native';

import { SegmentedTabs } from '../SegmentedTabs';

const tabs = [
  { key: 'words', label: 'Word list' },
  { key: 'history', label: 'History' },
  { key: 'favorites', label: 'Favorites' },
];

describe('SegmentedTabs', () => {
  it('marks only the active tab as selected', async () => {
    await render(<SegmentedTabs tabs={tabs} activeKey="history" onTabPress={jest.fn()} />);

    expect(screen.getByRole('tab', { name: 'History' })).toBeSelected();
    expect(screen.getByRole('tab', { name: 'Word list' })).not.toBeSelected();
    expect(screen.getByRole('tab', { name: 'Favorites' })).not.toBeSelected();
  });

  it('reports the key of the pressed tab', async () => {
    const onTabPress = jest.fn();
    await render(<SegmentedTabs tabs={tabs} activeKey="words" onTabPress={onTabPress} />);

    await fireEvent.press(screen.getByRole('tab', { name: 'Favorites' }));

    expect(onTabPress).toHaveBeenCalledWith('favorites');
  });
});
