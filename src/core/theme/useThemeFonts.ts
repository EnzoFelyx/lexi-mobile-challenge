import { Fraunces_600SemiBold } from '@expo-google-fonts/fraunces/600SemiBold';
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_400Regular_Italic } from '@expo-google-fonts/inter/400Regular_Italic';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';

import { fonts } from './theme';

// Só os pesos do theme.ts, importados por subcaminho para não empacotar a família inteira.
const fontAssets = {
  [fonts.serifSemiBold]: Fraunces_600SemiBold,
  [fonts.sansRegular]: Inter_400Regular,
  [fonts.sansMedium]: Inter_500Medium,
  [fonts.sansSemiBold]: Inter_600SemiBold,
  [fonts.sansItalic]: Inter_400Regular_Italic,
};

/**
 * Carrega as fontes do tema (useFonts funciona no Expo Go; o config plugin não).
 * Se falhar, o app segue com a fonte do sistema em vez de travar no splash.
 */
export function useThemeFonts(): boolean {
  const [loaded, error] = useFonts(fontAssets);

  useEffect(() => {
    if (error) {
      console.warn('[theme] Could not load the theme fonts; falling back to system fonts.', error);
    }
  }, [error]);

  return loaded || error !== null;
}
