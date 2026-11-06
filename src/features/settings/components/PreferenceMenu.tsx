import { Alert } from 'react-native';

import { type PreferenceChoice, selectedLabel } from '../hooks/preferenceChoice';
import { PreferenceRow } from './PreferenceRow';

export interface PreferenceMenuProps<T extends string> {
  label: string;
  choice: PreferenceChoice<T>;
  accessibilityHint: string;
}

/**
 * Escolha de uma preferência no Android: a linha do Figma abre um diálogo nativo no meio da tela.
 * O Android aceita até 3 botões e cancela tocando fora. (No iOS, `PreferenceMenu.ios.tsx` usa o
 * menu do sistema com o ✓ na opção atual.)
 */
export function PreferenceMenu<T extends string>({
  label,
  choice,
  accessibilityHint,
}: PreferenceMenuProps<T>) {
  const openDialog = () =>
    Alert.alert(
      label,
      undefined,
      choice.options.map((option) => ({
        text: option.label,
        onPress: () => choice.choose(option.value),
      })),
      { cancelable: true },
    );

  return (
    <PreferenceRow
      label={label}
      value={selectedLabel(choice)}
      onPress={openDialog}
      accessibilityHint={accessibilityHint}
    />
  );
}
