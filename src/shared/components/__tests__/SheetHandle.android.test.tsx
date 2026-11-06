import { render } from '@testing-library/react-native';

import { SheetHandle } from '../SheetHandle.android';

describe('SheetHandle on Android', () => {
  it('draws the handle, which the system does not', async () => {
    const { toJSON } = await render(<SheetHandle />);

    expect(toJSON()).not.toBeNull();
  });
});
