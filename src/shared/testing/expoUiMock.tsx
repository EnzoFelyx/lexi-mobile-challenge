import { Children, isValidElement, type ReactElement, type ReactNode } from 'react';
import { Pressable, Text as RNText, View } from 'react-native';

/**
 * Mock mínimo do `@expo/ui/swift-ui` para o Jest (os componentes nativos do SwiftUI não existem
 * lá). O `Picker` vira uma lista de botões, um por opção, com o selecionado marcado, para os
 * testes escolherem uma opção como o usuário faria no menu.
 */
type Modifier = { tag?: string | number };
type WithChildren = { children?: ReactNode };

const tagOf = (element: ReactElement<{ modifiers?: Modifier[] }>) =>
  element.props.modifiers?.find((modifier) => modifier.tag !== undefined)?.tag;

export const Host = ({ children }: WithChildren) => <View>{children}</View>;

export const RNHostView = ({ children }: WithChildren) => <>{children}</>;

export const Menu = ({ label, children }: WithChildren & { label: ReactNode }) => (
  <View>
    {label}
    {children}
  </View>
);

export const Text = ({ children }: WithChildren) => <RNText>{children}</RNText>;

export const Picker = ({
  selection,
  onSelectionChange,
  children,
}: WithChildren & {
  selection?: string | number;
  onSelectionChange?: (value: string | number) => void;
}) => (
  <View>
    {Children.map(children, (child) => {
      if (!isValidElement<{ modifiers?: Modifier[]; children?: ReactNode }>(child)) {
        return null;
      }
      const value = tagOf(child);
      return (
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: value === selection }}
          onPress={() => value !== undefined && onSelectionChange?.(value)}
        >
          <RNText>{child.props.children}</RNText>
        </Pressable>
      );
    })}
  </View>
);

export const modifiersMock = {
  tag: (value: string | number) => ({ tag: value }),
  pickerStyle: (style: string) => ({ pickerStyle: style }),
  accessibilityLabel: (label: string) => ({ accessibilityLabel: label }),
  accessibilityHint: (hint: string) => ({ accessibilityHint: hint }),
};
