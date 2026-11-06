import { useState } from 'react';

import { type PreferenceChoice, selectedLabel } from '../hooks/preferenceChoice';
import { PreferencePicker } from './PreferencePicker';
import { PreferenceRow } from './PreferenceRow';

export interface PreferenceMenuProps<T extends string> {
  label: string;
  choice: PreferenceChoice<T>;
  accessibilityHint: string;
}

/**
 * Escolha de uma preferência no Android: a linha do Figma abre um diálogo com rádios. (No iOS,
 * `PreferenceMenu.ios.tsx` usa o menu do sistema com o ✓ na opção atual.)
 */
export function PreferenceMenu<T extends string>({
  label,
  choice,
  accessibilityHint,
}: PreferenceMenuProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <PreferenceRow
        label={label}
        value={selectedLabel(choice)}
        onPress={() => setIsOpen(true)}
        accessibilityHint={accessibilityHint}
      />
      <PreferencePicker
        title={label}
        choice={choice}
        visible={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
