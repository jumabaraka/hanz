// apps/mobile/src/app/(tabs)/_layout.tsx
import Ionicons from '@expo/vector-icons/Ionicons';
import Tabs from 'expo-router/js-tabs';
import { Text, View } from 'react-native';

import type { IconName } from '@/data/mock';

// Icons, labels and the bar background are drawn with classes, so colours come from tailwind.config.js.
const tab = (title: string, active: IconName, idle: IconName) => ({
  title,
  tabBarIcon: ({ focused }: { focused: boolean }) => (
    <Ionicons name={focused ? active : idle} size={22} className={focused ? 'text-accent' : 'text-muted'} />
  ),
  tabBarLabel: ({ focused }: { focused: boolean }) => (
    <Text className={`mb-1.5 text-[11px] ${focused ? 'text-accent' : 'text-muted'}`}>{title}</Text>
  ),
});

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { height: 64, paddingTop: 6, borderTopWidth: 0, backgroundColor: 'transparent', elevation: 0 },
        tabBarBackground: () => <View className="flex-1 border-t border-line bg-card" />,
      }}
    >
      <Tabs.Screen name="index" options={tab('Home', 'home', 'home-outline')} />
      <Tabs.Screen name="discover" options={tab('Discover', 'search', 'search-outline')} />
      <Tabs.Screen name="messages" options={tab('Messages', 'chatbubbles', 'chatbubbles-outline')} />
      <Tabs.Screen name="me" options={tab('Me', 'person-circle', 'person-circle-outline')} />
    </Tabs>
  );
}