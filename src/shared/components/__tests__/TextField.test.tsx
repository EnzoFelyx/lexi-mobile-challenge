import { fireEvent, render, screen } from '@testing-library/react-native';

import { en } from '@/i18n/en';

import { EmailField } from '../EmailField';
import { PasswordField } from '../PasswordField';
import { TextField } from '../TextField';

describe('TextField', () => {
  it('reports what the user types', async () => {
    const onChangeText = jest.fn();
    await render(<TextField label="Name" value="" onChangeText={onChangeText} />);

    await fireEvent.changeText(screen.getByLabelText('Name'), 'Alex');

    expect(onChangeText).toHaveBeenCalledWith('Alex');
  });

  it('shows the error below the field', async () => {
    await render(<TextField label="Name" error="Enter your name." />);

    expect(screen.getByText('Enter your name.')).toBeOnTheScreen();
  });

  it('blocks typing and hides the error when disabled', async () => {
    await render(<TextField label="Name" error="Enter your name." disabled />);

    expect(screen.getByLabelText('Name').props.editable).toBe(false);
    expect(screen.queryByText('Enter your name.')).toBeNull();
  });
});

describe('EmailField', () => {
  it('opens the email keyboard without changing what is typed', async () => {
    await render(<EmailField label="Email" />);

    const input = screen.getByLabelText('Email');
    expect(input.props.keyboardType).toBe('email-address');
    expect(input.props.autoCapitalize).toBe('none');
    expect(input.props.autoCorrect).toBe(false);
  });
});

describe('PasswordField', () => {
  it('hides the password until the reveal button is pressed', async () => {
    await render(<PasswordField label="Password" />);
    expect(screen.getByLabelText('Password').props.secureTextEntry).toBe(true);

    await fireEvent.press(screen.getByRole('button', { name: en.field.showPassword }));

    expect(screen.getByLabelText('Password').props.secureTextEntry).toBe(false);
    expect(screen.getByRole('button', { name: en.field.hidePassword })).toBeOnTheScreen();
  });

  it('has no reveal button when disabled', async () => {
    await render(<PasswordField label="Password" disabled />);

    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getByLabelText('Password').props.secureTextEntry).toBe(true);
  });
});
