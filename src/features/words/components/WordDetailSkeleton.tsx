import { StyleSheet, View } from 'react-native';

import { sizes } from '@/core/theme/theme';
import { useTexts } from '@/i18n/useTexts';
import { AppText } from '@/shared/components/AppText';
import { Skeleton } from '@/shared/components/Skeleton';

import { DETAIL_FOOTER_CLASS } from './DetailNavigation';
import { AudioPlayer } from './AudioPlayer';

// Medidas dos placeholders no frame "Word detail loading" do Figma (3:15914).
const PLACEHOLDER = {
  headword: { width: 156, height: 40 },
  headwordBox: 54,
  phonetic: { width: 88, height: 20 },
  meaningsTitle: { width: 128, height: 28 },
  chip: { width: 48, height: 26 },
  definition: { width: '100%', height: 16 },
  example: { width: 248, height: 14 },
} as const;

const styles = StyleSheet.create({
  headwordBox: { height: PLACEHOLDER.headwordBox },
});

const MEANING_PLACEHOLDERS = 2;

interface WordDetailSkeletonProps {
  /** Mostra os blocos do Previous/Next quando o detalhe tem navegação. */
  withNavigation: boolean;
}
const noop = () => undefined;

/** Skeleton do detalhe enquanto a palavra carrega (Figma 3:15914). */
export function WordDetailSkeleton({ withNavigation }: WordDetailSkeletonProps) {
  const t = useTexts();
  return (
    <View
      accessible
      accessibilityLabel={t.wordDetail.loading}
      accessibilityState={{ busy: true }}
      className="flex-1 gap-lg-plus pt-sm"
    >
      <View className="gap-sm rounded-lg bg-accent-soft p-lg-plus">
        <View className="justify-center" style={styles.headwordBox}>
          <Skeleton {...PLACEHOLDER.headword} />
        </View>
        <Skeleton {...PLACEHOLDER.phonetic} />
        <AudioPlayer
          label={t.pronunciation.preparing}
          status="loading"
          progress={0}
          durationText={null}
          buttonLabel={t.pronunciation.preparing}
          progressLabel={t.pronunciation.progress}
          onToggle={noop}
        />
      </View>
      <View className="gap-lg-plus">
        <Skeleton {...PLACEHOLDER.meaningsTitle} />
        {Array.from({ length: MEANING_PLACEHOLDERS }, (_, index) => (
          <View key={index} className="gap-md">
            <Skeleton {...PLACEHOLDER.chip} />
            <Skeleton {...PLACEHOLDER.definition} />
            <Skeleton {...PLACEHOLDER.example} />
          </View>
        ))}
      </View>
      <AppText variant="note" tone="secondary">
        {t.wordDetail.lookingUp}
      </AppText>
      {withNavigation ? (
        <View className={`mt-auto ${DETAIL_FOOTER_CLASS}`}>
          <View className="flex-1">
            <Skeleton width="100%" height={sizes.button} />
          </View>
          <View className="flex-1">
            <Skeleton width="100%" height={sizes.button} />
          </View>
        </View>
      ) : null}
    </View>
  );
}
