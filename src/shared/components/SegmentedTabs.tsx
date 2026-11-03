import { Pressable, View } from 'react-native';

import { AppText, type TextTone, type TextVariant } from './AppText';

type TabState = 'active' | 'inactive';

const tabClass: Record<TabState, string> = {
  active: 'bg-surface',
  inactive: 'bg-surface-muted',
};

const labelVariant: Record<TabState, TextVariant> = { active: 'labelStrong', inactive: 'label' };
const labelTone: Record<TabState, TextTone> = { active: 'accent', inactive: 'secondary' };

export interface SegmentedTab {
  key: string;
  label: string;
}

interface SegmentedTabsProps {
  tabs: readonly SegmentedTab[];
  activeKey: string;
  onTabPress: (key: string) => void;
}

/** Abas segmentadas do Figma: trilho `surfaceMuted` de 52pt com a aba ativa em `surface`. */
export function SegmentedTabs({ tabs, activeKey, onTabPress }: SegmentedTabsProps) {
  return (
    <View accessibilityRole="tablist" className="h-tabs flex-row rounded-md bg-surface-muted p-xxs">
      {tabs.map((tab) => {
        const isActive = tab.key === activeKey;
        const tabState: TabState = isActive ? 'active' : 'inactive';
        return (
          <Pressable
            key={tab.key}
            accessibilityRole="tab"
            accessibilityLabel={tab.label}
            accessibilityState={{ selected: isActive }}
            onPress={() => onTabPress(tab.key)}
            className={`h-tab-item flex-1 items-center justify-center rounded-sm ${tabClass[tabState]}`}
          >
            <AppText variant={labelVariant[tabState]} tone={labelTone[tabState]}>
              {tab.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}
