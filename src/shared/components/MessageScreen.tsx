import { View } from 'react-native';

import { AppText } from './AppText';
import { Button } from './Button';

interface MessageScreenAction {
  label: string;
  onPress: () => void;
}

interface MessageScreenProps {
  title: string;
  message: string;
  action?: MessageScreenAction;
}

/** Tela inteira com título, explicação e uma ação opcional (erros e estados de bloqueio). */
export function MessageScreen({ title, message, action }: MessageScreenProps) {
  return (
    <View className="flex-1 justify-center gap-xl bg-background px-xl">
      <View className="gap-sm">
        <AppText variant="display" accessibilityRole="header">
          {title}
        </AppText>
        <AppText variant="body" tone="secondary">
          {message}
        </AppText>
      </View>
      {action ? <Button label={action.label} onPress={action.onPress} /> : null}
    </View>
  );
}
