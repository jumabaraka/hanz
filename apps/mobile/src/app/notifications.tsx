// apps/mobile/src/app/notifications.tsx
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { notifications } from '@/data/mock';

export default function Notifications() {
  const groups = ['Today', 'Earlier'] as const;
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-canvas">
      <View className="flex-row gap-2 px-4 py-2">
        <Pressable
          className="h-11 w-11 items-center justify-center rounded-xl bg-card"
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
        >
          <Ionicons name="arrow-back" size={20} className="text-ink" />
        </Pressable>
        <View className="h-11 flex-1 justify-center rounded-xl bg-card px-3.5">
          <Text className="text-base font-semibold text-ink">Notifications</Text>
        </View>
      </View>
      <ScrollView contentContainerClassName="p-4 pt-1">
        {groups.map((g) => (
          <View key={g}>
            <Text className="mb-2 mt-4 text-[17px] font-semibold text-ink">{g}</Text>
            {notifications
              .filter((n) => n.group === g)
              .map((n) => (
                <View key={n.id} className="mb-2 flex-row gap-3 rounded-xl bg-card p-3">
                  <View className="h-9 w-9 items-center justify-center rounded-full bg-primary-soft">
                    <Ionicons name={n.icon} size={18} className="text-primary" />
                  </View>
                  <View className="flex-1">
                    <View className="flex-row justify-between gap-2">
                      <Text className="shrink text-sm font-semibold text-ink">{n.title}</Text>
                      <Text className="text-[11px] text-muted">{n.when}</Text>
                    </View>
                    <Text className="mt-0.5 text-[13px] leading-[18px] text-muted">{n.body}</Text>
                  </View>
                </View>
              ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}