// apps/mobile/src/app/provider/[id].tsx
// Provider profile: About (services + hours), Works, Reviews. Booking starts from here.
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar, Button, EmptyState, Stars, Verified, WorkTile } from '@/components/ui';
import { categoryById, providerById } from '@/data/mock';
import { priceLabel } from '@/lib/money';
import { useApp } from '@/store/AppStore';

type Tab = 'about' | 'works' | 'reviews';

const TABS = [
  ['about', 'person-circle-outline', 'About'],
  ['works', 'images-outline', 'Works'],
  ['reviews', 'chatbubble-ellipses-outline', 'Reviews'],
] as const;

export default function ProviderProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const p = providerById(id ?? '');
  const { following, toggleFollow, chats } = useApp();
  const [tab, setTab] = useState<Tab>('about');
  const { width } = useWindowDimensions();
  const tile = (Math.min(width, 480) - 32 - 2 * 6) / 3;

  if (!p) {
    return (
      <SafeAreaView className="flex-1">
        <EmptyState icon="person" title="Profile not found" body="This provider may have left Hanz." />
      </SafeAreaView>
    );
  }

  const isFollowing = following[p.id];
  const chatId = chats.find((c) => c.providerId === p.id)?.id ?? `c-${p.id}`;
  const cat = categoryById(p.categoryId);

  return (
    <View className="flex-1 bg-canvas">
      <ScrollView contentContainerClassName="pb-28">
        <SafeAreaView edges={['top']} className="bg-primary">
          <View className="px-4">
            <View className="flex-row items-center gap-2 py-2">
              <Pressable
                className="h-11 w-11 items-center justify-center rounded-xl bg-card"
                onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
              >
                <Ionicons name="arrow-back" size={20} className="text-ink" />
              </Pressable>
              <View className="h-11 flex-1 flex-row items-center gap-1.5 rounded-xl bg-card px-3.5">
                <Text className="shrink text-base font-bold text-ink" numberOfLines={1}>
                  {p.business}
                </Text>
                {p.verified ? <Verified size={16} /> : null}
              </View>
              <Pressable
                className="h-11 w-11 items-center justify-center rounded-xl bg-card"
                onPress={() => router.push('/notifications')}
              >
                <Ionicons name="notifications-outline" size={20} className="text-primary" />
              </Pressable>
            </View>

            <View className="mt-4 flex-row items-center gap-4">
              <View>
                <Avatar initials={p.initials} color={p.color} size={78} />
                <View className="absolute -bottom-1 self-center rounded-full bg-card px-1.5 py-px">
                  <Text className="text-[11px] font-bold text-ink">{p.rating}★</Text>
                </View>
              </View>
              <View className="flex-1">
                <View className="flex-row justify-around">
                  <Stat value={p.completedJobs} label="Jobs done" />
                  <Stat value={p.followers + (isFollowing && !p.following ? 1 : 0)} label="Followers" />
                  <Stat value={p.reviewCount} label="Reviews" />
                </View>
                <Text className="mt-3 text-center text-[13px] text-white">
                  <Ionicons name="location" size={13} className="text-accent" /> {p.area} · {cat?.name}
                </Text>
              </View>
            </View>

            <View className="mt-5 flex-row gap-2">
              <Pressable
                className={`h-10 flex-1 items-center justify-center rounded-lg border-[1.5px] border-white ${isFollowing ? 'bg-white' : ''}`}
                onPress={() => toggleFollow(p.id)}
              >
                <Text className={`font-semibold ${isFollowing ? 'text-primary' : 'text-white'}`}>
                  {isFollowing ? 'Following' : 'Follow'}
                </Text>
              </Pressable>
              <Pressable
                className="h-10 flex-[1.6] items-center justify-center rounded-lg bg-white"
                onPress={() => router.push({ pathname: '/chat/[id]', params: { id: chatId, providerId: p.id } })}
              >
                <Text className="font-semibold text-primary">Send a message</Text>
              </Pressable>
            </View>

            <View className="mt-5 flex-row">
              {TABS.map(([key, icon, label]) => (
                <Pressable key={key} className="flex-1 items-center gap-0.5 pb-3" onPress={() => setTab(key)}>
                  <Ionicons name={icon} size={22} className={tab === key ? 'text-white' : 'text-primary-muted'} />
                  <Text className={`text-[11px] ${tab === key ? 'text-white' : 'text-primary-muted'}`}>{label}</Text>
                  {tab === key ? <View className="absolute bottom-0 h-[3px] w-10 rounded-sm bg-accent" /> : null}
                </Pressable>
              ))}
            </View>
          </View>
        </SafeAreaView>

        <View className="-mt-0.5 min-h-[400px] rounded-t-[20px] bg-card p-4">
          {tab === 'about' ? (
            <>
              <Text className="text-sm leading-[21px] text-muted">{p.bio}</Text>
              {!p.verified ? (
                <View className="mt-3 flex-row items-center gap-2 rounded-xl bg-canvas p-3">
                  <Ionicons name="time-outline" size={16} className="text-accent" />
                  <Text className="flex-1 text-xs text-muted">
                    ID verification pending. Bookings are still protected by escrow.
                  </Text>
                </View>
              ) : null}

              <Text className="mb-2 mt-5 text-[15px] font-semibold text-ink">Services</Text>
              {p.listings.map((l) => (
                <View key={l.id} className="flex-row items-center gap-3 border-b border-line py-3">
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-ink">{l.title}</Text>
                    <Text className="text-[13px] text-muted">{l.duration}</Text>
                  </View>
                  <View className="items-end gap-1.5">
                    <Text className="text-sm font-bold text-primary">{priceLabel(l.price, l.priceType)}</Text>
                    <Pressable
                      className="rounded-lg bg-accent-soft px-3.5 py-[5px]"
                      onPress={() =>
                        router.push({ pathname: '/book/[providerId]', params: { providerId: p.id, listingId: l.id } })
                      }
                    >
                      <Text className="text-xs font-bold text-accent">Book</Text>
                    </Pressable>
                  </View>
                </View>
              ))}

              <Text className="mb-2 mt-5 text-[15px] font-semibold text-ink">Working hours</Text>
              {p.hours.map((h) => (
                <View key={h.day} className="flex-row justify-between py-[5px]">
                  <Text className="text-[13px] text-muted">{h.day}</Text>
                  <Text className={`text-[13px] ${h.time === 'Closed' ? 'text-danger' : 'text-ink'}`}>{h.time}</Text>
                </View>
              ))}
            </>
          ) : null}

          {tab === 'works' ? (
            <View className="flex-row flex-wrap gap-1.5">
              {p.works.map((w) => (
                <WorkTile key={w.id} work={w} size={tile} />
              ))}
            </View>
          ) : null}

          {tab === 'reviews' ? (
            <View className="gap-3">
              <View className="flex-row items-center gap-2 rounded-xl bg-canvas p-3">
                <Ionicons name="shield-checkmark-outline" size={16} className="text-primary" />
                <Text className="flex-1 text-xs text-muted">Only buyers with a completed booking can leave a review.</Text>
              </View>
              {p.reviews.map((r) => (
                <View key={r.id} className="gap-1 rounded-xl bg-canvas p-3">
                  <View className="flex-row justify-between">
                    <Text className="text-sm font-semibold text-ink">{r.author}</Text>
                    <Text className="text-[13px] text-muted">{r.date}</Text>
                  </View>
                  <Stars rating={r.rating} />
                  <Text className="mt-1.5 text-sm leading-[21px] text-muted">{r.text}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} className="absolute inset-x-0 bottom-0 border-t border-line bg-card">
        <View className="p-4">
          <Button
            label="Book a service"
            icon="calendar-outline"
            onPress={() => router.push({ pathname: '/book/[providerId]', params: { providerId: p.id } })}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <View className="items-center">
      <Text className="text-lg font-bold text-white">{value.toLocaleString()}</Text>
      <Text className="text-xs text-on-primary-muted">{label}</Text>
    </View>
  );
}