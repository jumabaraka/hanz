// apps/mobile/src/app/(tabs)/messages.tsx
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Avatar, Screen, SearchHeader, SectionTitle, Verified } from '@/components/ui';
import { providerById, type Chat } from '@/data/mock';
import { useApp } from '@/store/AppStore';

export default function Messages() {
  const { chats } = useApp();
  const pinned = chats.filter((c) => c.pinned);
  const rest = chats.filter((c) => !c.pinned);

  return (
    <Screen>
      <SearchHeader placeholder="Search chats…" />
      <ScrollView contentContainerClassName="p-4 pt-2">
        <View className="rounded-card bg-card p-4">
          <SectionTitle title="Chats" />
          {pinned.length ? (
            <>
              <Text className="mb-1 mt-2 text-[13px] text-muted">
                <Ionicons name="pin" size={12} className="text-muted" /> Pinned
              </Text>
              {pinned.map((c) => (
                <ChatRow key={c.id} c={c} />
              ))}
            </>
          ) : null}
          <Text className="mb-1 mt-2 text-[13px] text-muted">All chats</Text>
          {rest.map((c) => (
            <ChatRow key={c.id} c={c} />
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

function ChatRow({ c }: { c: Chat }) {
  const p = providerById(c.providerId);
  if (!p) return null;
  const last = c.messages[c.messages.length - 1];
  return (
    <Pressable
      className="flex-row items-center gap-3 py-3"
      onPress={() => router.push({ pathname: '/chat/[id]', params: { id: c.id, providerId: p.id } })}
    >
      <Avatar initials={p.initials} color={p.color} size={48} />
      <View className="flex-1">
        <View className="flex-row items-center gap-1">
          <Text className="shrink text-[15px] font-semibold text-ink" numberOfLines={1}>
            {p.business}
          </Text>
          {p.verified ? <Verified /> : null}
        </View>
        <Text className="mt-0.5 text-[13px] text-muted" numberOfLines={1}>
          {last?.from === 'me' ? 'You: ' : ''}
          {last?.text}
        </Text>
      </View>
      <View className="items-end gap-1.5">
        <Text className="text-[11px] text-muted">{c.updated}</Text>
        {c.unread ? (
          <View className="h-5 min-w-5 items-center justify-center rounded-full bg-danger px-[5px]">
            <Text className="text-[11px] font-bold text-white">{c.unread}</Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}