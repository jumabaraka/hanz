// apps/mobile/src/app/(tabs)/me.tsx
// The user's own space: buyer/provider mode switch and bookings.
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar, Button, EmptyState } from '@/components/ui';
import { me, providerById } from '@/data/mock';
import { ghs } from '@/lib/money';
import { useApp, type BookingStatus } from '@/store/AppStore';

const PILL: Record<BookingStatus, { text: string; box: string; label: string }> = {
  REQUESTED: { text: 'Requested', box: 'bg-accent-soft', label: 'text-accent' },
  ACCEPTED: { text: 'Pay now', box: 'bg-accent-soft', label: 'text-accent' },
  FUNDED: { text: 'Secured', box: 'bg-success-soft', label: 'text-success' },
  DELIVERED: { text: 'Confirm', box: 'bg-primary-soft', label: 'text-primary' },
  COMPLETED: { text: 'Completed', box: 'bg-success-soft', label: 'text-success' },
  DISPUTED: { text: 'In review', box: 'bg-danger-soft', label: 'text-danger' },
  CANCELLED: { text: 'Cancelled', box: 'bg-canvas', label: 'text-muted' },
};

const PROVIDER_STEPS = [
  ['person-outline', 'Add your name, photo and campus area'],
  ['card-outline', 'Upload your Ghana Card or student ID and a selfie'],
  ['phone-portrait-outline', 'Add your MoMo number for payouts'],
  ['pricetag-outline', 'Create your first listing; we review it within 24 hours'],
] as const;

export default function Me() {
  const { bookings, following } = useApp();
  const [mode, setMode] = useState<'buyer' | 'provider'>('buyer');
  const followingCount = Object.values(following).filter(Boolean).length;

  return (
    <View className="flex-1 bg-canvas">
      <ScrollView>
        <SafeAreaView edges={['top']} className="bg-primary">
          <View className="p-4 pb-5">
            <View className="mt-2 h-11 items-center justify-center rounded-xl bg-card">
              <Text className="text-base font-bold text-ink">{me.name}</Text>
            </View>
            <View className="mt-5 items-center">
              <Avatar initials={me.initials} className="bg-accent" size={78} />
            </View>
            <View className="mt-4 flex-row">
              <Stat value={bookings.length} label="Bookings" />
              <Stat value={followingCount} label="Following" />
              <Stat value={bookings.filter((b) => b.rating).length} label="Reviews given" />
            </View>
            <View className="mt-5 flex-row rounded-xl bg-white/10 p-1">
              {(['buyer', 'provider'] as const).map((m) => (
                <Pressable
                  key={m}
                  className={`flex-1 items-center rounded-lg py-2.5 ${mode === m ? 'bg-white' : ''}`}
                  onPress={() => setMode(m)}
                >
                  <Text className={`font-semibold ${mode === m ? 'text-primary' : 'text-white'}`}>
                    {m === 'buyer' ? 'Buyer mode' : 'Provider mode'}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </SafeAreaView>

        <View className="-mt-3 min-h-[420px] rounded-t-[20px] bg-card p-4">
          {mode === 'buyer' ? (
            <>
              <Text className="mb-3 text-base font-semibold text-ink">My bookings</Text>
              {bookings.length === 0 ? (
                <EmptyState icon="calendar-outline" title="No bookings yet" body="Find someone on Discover and send a request." />
              ) : (
                bookings.map((b) => {
                  const p = providerById(b.providerId);
                  const pill = PILL[b.status];
                  return (
                    <Pressable
                      key={b.id}
                      className="flex-row items-center gap-3 border-b border-line py-3"
                      onPress={() => router.push(`/booking/${b.id}`)}
                    >
                      {p ? <Avatar initials={p.initials} color={p.color} size={42} /> : null}
                      <View className="flex-1">
                        <Text className="text-sm font-semibold text-ink" numberOfLines={1}>
                          {b.title}
                        </Text>
                        <Text className="mt-0.5 text-xs text-muted">
                          {p?.business} · {b.date}
                        </Text>
                      </View>
                      <View className="items-end gap-1">
                        <View className={`rounded-lg px-2 py-[3px] ${pill.box}`}>
                          <Text className={`text-[11px] font-bold ${pill.label}`}>{pill.text}</Text>
                        </View>
                        <Text className="text-[13px] font-bold text-ink">{ghs(b.total)}</Text>
                      </View>
                    </Pressable>
                  );
                })
              )}
            </>
          ) : (
            <View className="gap-3">
              <Text className="mb-3 text-base font-semibold text-ink">Start earning on Hanz</Text>
              {PROVIDER_STEPS.map(([icon, text], i) => (
                <View key={text} className="flex-row items-center gap-3 rounded-xl bg-canvas p-3">
                  <View className="h-6 w-6 items-center justify-center rounded-full bg-primary">
                    <Text className="font-bold text-white">{i + 1}</Text>
                  </View>
                  <Ionicons name={icon} size={18} className="text-primary" />
                  <Text className="flex-1 text-sm text-ink">{text}</Text>
                </View>
              ))}
              <Button label="Become a provider" disabled />
              <Text className="text-center text-xs text-muted">Provider sign-up is coming in the next build.</Text>
            </View>
          )}

          <View className="mt-6 flex-row items-center gap-2 rounded-xl bg-accent-soft p-3">
            <Ionicons name="flask-outline" size={16} className="text-accent" />
            <Text className="flex-1 text-xs text-ink">Prototype with sample data. Nothing is saved and no real money moves.</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <View className="flex-1 items-center">
      <Text className="text-lg font-bold text-white">{value}</Text>
      <Text className="text-xs text-on-primary-muted">{label}</Text>
    </View>
  );
}