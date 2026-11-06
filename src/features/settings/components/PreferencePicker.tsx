import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { useTexts } from '@/i18n/useTexts';
import { AppText } from '@/shared/components/AppText';

import type { PreferenceChoice } from '../hooks/preferenceChoice';

interface PreferencePickerProps<T extends string> {
  title: string;
  choice: PreferenceChoice<T>;
  visible: boolean;
  onClose: () => void;
}

interface OptionListProps<T extends string> {
  title: string;
  choice: PreferenceChoice<T>;
  onChoose: (value: T) => void;
}

/** Título e opções com rádio (Material 3): a atual muda de forma, não só de cor. */
function OptionList<T extends string>({ title, choice, onChoose }: OptionListProps<T>) {
  return (
    <>
      <AppText variant="heading" accessibilityRole="header" className="px-xl pb-md">
        {title}
      </AppText>
      <View accessibilityRole="radiogroup">
        {choice.options.map((option) => {
          const isSelected = option.value === choice.selected;
          return (
            <Pressable
              key={option.value}
              accessibilityRole="radio"
              accessibilityLabel={option.label}
              accessibilityState={{ checked: isSelected }}
              onPress={() => onChoose(option.value)}
              className="min-h-row flex-row items-center gap-lg px-xl py-sm active:bg-surface-muted"
            >
              <View
                className={`h-radio w-radio items-center justify-center rounded-pill border-field-active ${isSelected ? 'border-accent' : 'border-text-secondary'}`}
              >
                {isSelected ? (
                  <View className="h-radio-dot w-radio-dot rounded-pill bg-accent" />
                ) : null}
              </View>
              <AppText variant="body" className="flex-shrink">
                {option.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </>
  );
}

/**
 * Escolha de uma preferência no Android, com rádios num diálogo (guia de configurações do Android;
 * decisão do autor, 2026-11-06). Escolher já aplica e fecha; tocar fora ou voltar só fecha.
 */
export function PreferencePicker<T extends string>({
  title,
  choice,
  visible,
  onClose,
}: PreferencePickerProps<T>) {
  const t = useTexts();
  const choose = (value: T) => {
    choice.choose(value);
    onClose();
  };

  return (
    <Modal
      transparent
      statusBarTranslucent
      navigationBarTranslucent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center px-xl">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t.settings.closePicker}
          onPress={onClose}
          style={StyleSheet.absoluteFill}
          className="bg-scrim/50"
        />
        <View className="rounded-lg bg-surface py-xl">
          <OptionList title={title} choice={choice} onChoose={choose} />
        </View>
      </View>
    </Modal>
  );
}
