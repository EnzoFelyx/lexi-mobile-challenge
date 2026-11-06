import type { MaterialTopTabBarProps } from 'expo-router/js-top-tabs';
import { Platform, View } from 'react-native';

import { SegmentedTabs } from './SegmentedTabs';

/** `tabBar` das abas superiores: liga o estado do navegador ao SegmentedTabs do Figma. */
export function SegmentedTabBar({
  state,
  descriptors,
  emitter,
  navigateToTab,
  position,
}: MaterialTopTabBarProps) {
  const tabs = state.routes.map((route) => ({
    key: route.key,
    label: descriptors[route.key]?.options.title ?? route.name,
  }));
  const activeKey = state.routes[state.index]?.key ?? '';

  // Mesmo contrato da barra padrão: quem ouve `tabPress` pode cancelar a troca.
  const handleTabPress = (key: string) => {
    const event = emitter.emit({ type: 'tabPress', target: key, canPreventDefault: true });
    if (key !== activeKey && !event.defaultPrevented) {
      navigateToTab(key);
    }
  };

  return (
    <View className="px-xl">
      <SegmentedTabs
        tabs={tabs}
        activeKey={activeKey}
        onTabPress={handleTabPress}
        // O Android só confirma a troca de aba depois do movimento; sem isto, o destaque atrasa.
        position={Platform.OS === 'android' ? position : undefined}
      />
    </View>
  );
}
