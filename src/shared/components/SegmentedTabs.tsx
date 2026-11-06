import { useState } from 'react';
import { Animated, type LayoutChangeEvent, Pressable, StyleSheet, View } from 'react-native';

import { MAX_COMPACT_FONT_SCALE } from '@/constants/accessibility';
import { sizes, spacing } from '@/core/theme/theme';

import { AppText, type TextTone, type TextVariant } from './AppText';

type TabState = 'active' | 'inactive';

const labelVariant: Record<TabState, TextVariant> = { active: 'labelStrong', inactive: 'label' };
const labelTone: Record<TabState, TextTone> = { active: 'accent', inactive: 'secondary' };

const TRACK_PADDING = spacing.xxs;

// Posição e largura vêm da medição da barra: não dá para usar className.
const styles = StyleSheet.create({
  indicator: {
    position: 'absolute',
    top: TRACK_PADDING,
    left: TRACK_PADDING,
    height: sizes.tabItem,
  },
  labelOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export interface SegmentedTab {
  key: string;
  label: string;
}

interface SegmentedTabsProps {
  tabs: readonly SegmentedTab[];
  activeKey: string;
  onTabPress: (key: string) => void;
  /** Posição real das páginas: o destaque acompanha o movimento, em vez de esperar a troca. */
  position?: Animated.AnimatedInterpolation<number>;
}

interface MovingTabLabelProps {
  label: string;
  index: number;
  position: Animated.AnimatedInterpolation<number>;
}

/** Os dois estilos do rótulo sobrepostos: conforme a página se move, um dá lugar ao outro. */
function MovingTabLabel({ label, index, position }: MovingTabLabelProps) {
  const activeOpacity = position.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [0, 1, 0],
    extrapolate: 'clamp',
  });
  const inactiveOpacity = position.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [1, 0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View className="items-center justify-center">
      {/* O ativo é mais largo (semibold) e define o tamanho; sobre o outro, cortaria as letras. */}
      <Animated.View style={{ opacity: activeOpacity }}>
        <AppText
          variant={labelVariant.active}
          tone={labelTone.active}
          numberOfLines={1}
          maxFontSizeMultiplier={MAX_COMPACT_FONT_SCALE}
        >
          {label}
        </AppText>
      </Animated.View>
      <Animated.View style={[styles.labelOverlay, { opacity: inactiveOpacity }]}>
        <AppText
          variant={labelVariant.inactive}
          tone={labelTone.inactive}
          numberOfLines={1}
          maxFontSizeMultiplier={MAX_COMPACT_FONT_SCALE}
        >
          {label}
        </AppText>
      </Animated.View>
    </View>
  );
}

/** Abas segmentadas do Figma: trilho `surfaceMuted` de 52pt com a aba ativa em `surface`. */
export function SegmentedTabs({ tabs, activeKey, onTabPress, position }: SegmentedTabsProps) {
  const [tabWidth, setTabWidth] = useState(0);
  const measureTrack = ({ nativeEvent }: LayoutChangeEvent) =>
    setTabWidth((nativeEvent.layout.width - TRACK_PADDING * 2) / tabs.length);
  const showsMovingHighlight = position !== undefined && tabWidth > 0;

  return (
    <View
      accessibilityRole="tablist"
      onLayout={position ? measureTrack : undefined}
      className="h-tabs flex-row rounded-md bg-surface-muted p-xxs"
    >
      {showsMovingHighlight ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.indicator,
            {
              width: tabWidth,
              transform: [
                {
                  translateX: position.interpolate({
                    inputRange: tabs.map((_, index) => index),
                    outputRange: tabs.map((_, index) => index * tabWidth),
                    extrapolate: 'clamp',
                  }),
                },
              ],
            },
          ]}
        >
          <View className="flex-1 rounded-sm bg-surface" />
        </Animated.View>
      ) : null}
      {tabs.map((tab, index) => {
        const isActive = tab.key === activeKey;
        const tabState: TabState = isActive ? 'active' : 'inactive';
        return (
          <Pressable
            key={tab.key}
            accessibilityRole="tab"
            accessibilityLabel={tab.label}
            accessibilityState={{ selected: isActive }}
            onPress={() => onTabPress(tab.key)}
            className={`h-tab-item flex-1 items-center justify-center rounded-sm ${isActive && !position ? 'bg-surface' : ''}`}
          >
            {position ? (
              <MovingTabLabel label={tab.label} index={index} position={position} />
            ) : (
              <AppText
                variant={labelVariant[tabState]}
                tone={labelTone[tabState]}
                numberOfLines={1}
                maxFontSizeMultiplier={MAX_COMPACT_FONT_SCALE}
              >
                {tab.label}
              </AppText>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
