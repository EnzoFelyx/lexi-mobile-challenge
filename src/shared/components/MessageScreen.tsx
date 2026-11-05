import { History } from 'lucide-react-native';
import { View } from 'react-native';

import { EmptyState } from './EmptyState';

interface MessageScreenAction {
  label: string;
  onPress: () => void;
}

interface MessageScreenProps {
  title: string;
  message: string;
  action?: MessageScreenAction;
}

/**
 * Tela inteira de erro recuperável (Figma "Shared recoverable error content"): um só layout para
 * as falhas da lista, do banco, do histórico e dos favoritos, igual ao do estado vazio.
 */
export function MessageScreen({ title, message, action }: MessageScreenProps) {
  return (
    <View className="flex-1 justify-center bg-background px-xl">
      <EmptyState icon={History} title={title} message={message} action={action} />
    </View>
  );
}
