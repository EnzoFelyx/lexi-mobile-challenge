import { render, screen } from '@testing-library/react-native';

import { FormError } from '../FormError';

describe('FormError', () => {
  it('announces the message as an alert', async () => {
    await render(<FormError message="Wrong email or password" />);

    expect(screen.getByRole('alert')).toHaveTextContent('Wrong email or password');
  });
});
