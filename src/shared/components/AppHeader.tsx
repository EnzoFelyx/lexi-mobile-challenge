import { UserRound } from 'lucide-react-native';
import { Platform, Pressable, View } from 'react-native';

import { MAX_COMPACT_FONT_SCALE } from '@/constants/accessibility';
import { useTheme } from '@/core/theme/useTheme';
import { useTexts } from '@/i18n/useTexts';
import { isAndroid13OrNewer } from '@/shared/utils/nativeSheet';

import { AppText } from './AppText';
import { BackButton } from './BackButton';
import { ROUND_BUTTON_CLASS } from './PlainBackButton';

interface AppHeaderProps {
  /** Sem ação: a tela atual já é a da conta; o botão fica como no Figma, só com o retorno do toque. */
  onAccountPress?: () => void;
  /** Seta de voltar antes do logo, em telas fora das abas (decisão do autor; o Figma não tem). */
  onBack?: () => void;
  /** Header das telas de login e cadastro: a frase "English, every day" no lugar do botão de conta. */
  showTagline?: boolean;
}

// A partir do Android 13, 8pt a mais separam o header da barra de status (pedido do autor).
const STATUS_BAR_GAP_CLASS = isAndroid13OrNewer(Platform.OS, Platform.Version) ? 'mt-sm' : '';

// O botão de conta na própria tela da conta: só o retorno visual do toque.
const stayOnAccount = () => undefined;

/** Header do Figma: logo "Lexi" com o ponto da marca e o botão de conta (44pt). */
export function AppHeader({ onAccountPress, onBack, showTagline = false }: AppHeaderProps) {
  const t = useTexts();
  const { colors, sizes } = useTheme();
  const icon = { color: colors.textPrimary, strokeWidth: sizes.iconStrokeWidth };

  return (
    <View
      className={`h-header flex-row items-center justify-between gap-md px-xl ${STATUS_BAR_GAP_CLASS}`}
    >
      <View className="flex-row items-center gap-md">
        {onBack ? <BackButton onPress={onBack} /> : null}
        <View className="flex-row items-baseline gap-sm">
          <AppText
            variant="logo"
            accessibilityRole="header"
            maxFontSizeMultiplier={MAX_COMPACT_FONT_SCALE}
          >
            {t.appName}
          </AppText>
          <View className="h-brand-point w-brand-point rounded-pill bg-accent" />
        </View>
      </View>
      {showTagline ? (
        <AppText
          variant="tagline"
          tone="secondary"
          numberOfLines={1}
          maxFontSizeMultiplier={MAX_COMPACT_FONT_SCALE}
          className="flex-shrink"
        >
          {t.header.tagline}
        </AppText>
      ) : onAccountPress ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t.header.accountLabel}
          accessibilityHint={t.header.accountHint}
          onPress={onAccountPress}
          className={`${ROUND_BUTTON_CLASS} active:opacity-80`}
        >
          <UserRound size={sizes.accountIcon} {...icon} />
        </Pressable>
      ) : (
        // Já na conta: responde ao toque como os outros botões (pedido do autor), sem ação.
        // Fora do leitor de tela, para não anunciar um botão que não faz nada.
        <Pressable
          accessible={false}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          onPress={stayOnAccount}
          className={`${ROUND_BUTTON_CLASS} active:opacity-80`}
        >
          <UserRound size={sizes.accountIcon} {...icon} />
        </Pressable>
      )}
    </View>
  );
}
