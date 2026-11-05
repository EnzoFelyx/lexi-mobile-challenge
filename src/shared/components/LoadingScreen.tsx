import { View } from 'react-native';

import { Spinner } from './Spinner';

interface LoadingScreenProps {
  /** O que está carregando, para o leitor de tela. */
  label: string;
}

/** Tela inteira carregando: o spinner do Figma no centro. */
export function LoadingScreen({ label }: LoadingScreenProps) {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Spinner accessibilityLabel={label} />
    </View>
  );
}
