import { render } from '@testing-library/react-native';

import { SheetHandle } from '../SheetHandle';

describe('SheetHandle', () => {
  it('draws nothing where the system already has one', async () => {
    const { toJSON } = await render(<SheetHandle />);

    expect(toJSON()).toBeNull();
  });
});
