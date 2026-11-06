import { fireEvent, render, screen } from '@testing-library/react-native';
import { Animated } from 'react-native';

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

  it('keeps the tabs working with the highlight that follows the pages', async () => {
    const onTabPress = jest.fn();
    await render(
      <SegmentedTabs
        tabs={tabs}
        activeKey="history"
        onTabPress={onTabPress}
        position={new Animated.Value(1)}
      />,
    );

    await fireEvent(screen.getByRole('tab', { name: 'History' }), 'layout', {
      nativeEvent: { layout: { width: 342, height: 52, x: 0, y: 0 } },
    });
    await fireEvent.press(screen.getByRole('tab', { name: 'Favorites' }));

    expect(screen.getByRole('tab', { name: 'History' })).toBeSelected();
    expect(onTabPress).toHaveBeenCalledWith('favorites');
  });

  it('reports the key of the pressed tab', async () => {
    const onTabPress = jest.fn();
    await render(<SegmentedTabs tabs={tabs} activeKey="words" onTabPress={onTabPress} />);

    await fireEvent.press(screen.getByRole('tab', { name: 'Favorites' }));

    expect(onTabPress).toHaveBeenCalledWith('favorites');
  });
});
