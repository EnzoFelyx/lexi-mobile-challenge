import { Text, View } from 'react-native';

export default function WordListScreen() {
  return (
    <View className="flex-1 bg-background p-xl">
      <Text className="font-serif-semi-bold text-display text-text-primary">Lexi</Text>
      <Text className="font-sans-regular text-body text-text-secondary">Word list</Text>
    </View>
  );
}
