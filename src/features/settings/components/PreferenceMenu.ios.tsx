import { Host, Menu, Picker, RNHostView, Text } from '@expo/ui/swift-ui';
import {
  accessibilityHint,
  accessibilityLabel,
  pickerStyle,
  tag,
} from '@expo/ui/swift-ui/modifiers';
import { StyleSheet } from 'react-native';

import { sizes } from '@/core/theme/theme';
import { useTheme } from '@/core/theme/useTheme';

import { selectedLabel } from '../hooks/preferenceChoice';
import type { PreferenceMenuProps } from './PreferenceMenu';
import { PreferenceRow } from './PreferenceRow';

// O Host do SwiftUI não recebe className: altura da linha do Figma pelo token.
const styles = StyleSheet.create({ row: { height: sizes.row } });

/**
 * Escolha de uma preferência no iOS (decisão do autor, 2026-11-05): a linha do Figma (React Native,
 * dentro de um `RNHostView`) é o rótulo de um `Menu` nativo do SwiftUI, que abre ancorado na linha
 * com um `Picker` inline e o ✓ do sistema na opção atual. O `Host` recebe o tema do app, para o
 * menu seguir o tema escolhido, e não o do celular.
 */
export function PreferenceMenu<T extends string>({
  label,
  choice,
  accessibilityHint: hint,
}: PreferenceMenuProps<T>) {
  const theme = useTheme();
  const value = selectedLabel(choice);

  return (
    <Host colorScheme={theme.mode} style={styles.row}>
      <Menu
        label={
          <RNHostView>
            <PreferenceRow label={label} value={value} />
          </RNHostView>
        }
        modifiers={[accessibilityLabel(`${label}, ${value}`), accessibilityHint(hint)]}
      >
        <Picker
          selection={choice.selected}
          onSelectionChange={(selection: T) => choice.choose(selection)}
          modifiers={[pickerStyle('inline')]}
        >
          {choice.options.map((option) => (
            <Text key={option.value} modifiers={[tag(option.value)]}>
              {option.label}
            </Text>
          ))}
        </Picker>
      </Menu>
    </Host>
  );
}
