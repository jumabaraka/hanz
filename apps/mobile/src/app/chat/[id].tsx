// apps/mobile/src/app/chat/[id].tsx
// Chat thread. Phone numbers stay hidden (PRD MSG-1), and no call button: calls are out of scope.
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TextInput } from '@/components/styled';
import { Avatar, Verified } from '@/components/ui';
import { providerById } from '@/data/mock';
import { useApp } from '@/store/AppStore';

export default function ChatThread() {
  const { id, providerId } = useLocalSearchParams<{ id: string; providerId: string }>();
  const { chats, sendMessage } = useApp();
  const chat = chats.find((c) => c.id === id);
  const p = providerById(providerId ?? chat?.providerId ?? '');
  const [text, setText] = useState('');
  const scroll = useRef<ScrollView>(null);

  if (!p) return null;
  const messages = chat?.messages ?? [];

  const send = () => {
    const t = text.trim();
    if (!t) return;
    sendMessage(id ?? `c-${p.id}`, p.id, t);
    setText('');
    setTimeout(() => scroll.current?.scrollToEnd({ animated: true }), 50);
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-card">
      <View className="flex-row items-center gap-3 border-b border-line p-4">
        <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace('/messages'))} hitSlop={10}>
          <Ionicons name="arrow-back" size={22} className="text-ink" />
        </Pressable>
        <Pressable className="flex-1 flex-row items-center gap-2.5" onPress={() => router.push(`/provider/${p.id}`)}>
          <Avatar initials={p.initials} color={p.color} size={38} />
          <View>
            <View className="flex-row items-center gap-1">
              <Text className="text-[15px] font-bold text-ink">{p.business}</Text>
              {p.verified ? <Verified /> : null}
            </View>
            <Text className="text-[11px] text-success">Online</Text>
          </View>
        </Pressable>
        <Pressable
          className="rounded-lg bg-primary px-3.5 py-[7px]"
          onPress={() => router.push({ pathname: '/book/[providerId]', params: { providerId: p.id } })}
        >
          <Text className="text-[13px] font-bold text-white">Book</Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          ref={scroll}
          className="flex-1 bg-canvas"
          contentContainerClassName="gap-2 p-4"
          onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: false })}
        >
          <View className="mb-2 flex-row items-center gap-1.5 self-center rounded-lg bg-primary-soft p-2">
            <Ionicons name="shield-checkmark-outline" size={14} className="text-primary" />
            <Text className="shrink text-[11px] text-primary-dark">
              Phone numbers stay hidden. Pay only through Hanz to keep escrow protection.
            </Text>
          </View>
          {messages.map((m) => {
            const mine = m.from === 'me';
            return (
              <View key={m.id} className={`gap-[3px] ${mine ? 'items-end' : 'items-start'}`}>
                <View
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 ${mine ? 'rounded-br bg-primary' : 'rounded-bl bg-card'}`}
                >
                  <Text className={`text-sm leading-5 ${mine ? 'text-white' : 'text-ink'}`}>{m.text}</Text>
                </View>
                <Text className="text-[10px] text-muted">{m.time}</Text>
              </View>
            );
          })}
        </ScrollView>

        <View className="flex-row items-center gap-2.5 bg-card p-3">
          <Ionicons name="attach" size={22} className="text-muted" />
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Write your message"
            className="h-[42px] flex-1 rounded-xl bg-canvas px-3 text-sm text-ink web:outline-none"
            onSubmitEditing={send}
            returnKeyType="send"
          />
          <Ionicons name="camera-outline" size={22} className="text-muted" />
          <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-accent" onPress={send}>
            <Ionicons name="send" size={16} className="text-white" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}