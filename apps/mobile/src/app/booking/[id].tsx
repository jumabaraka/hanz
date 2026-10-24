// apps/mobile/src/app/booking/[id].tsx
// Booking detail with the escrow timeline (PRD sections 5.2 and 8).
// In the prototype, the provider's side and the MoMo prompt are simulated with buttons.
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar, Button, EmptyState, Sheet } from '@/components/ui';
import { providerById, type IconName } from '@/data/mock';
import { ghs } from '@/lib/money';
import { useApp, type BookingStatus } from '@/store/AppStore';

const STEPS: { status: BookingStatus; label: string }[] = [
  { status: 'REQUESTED', label: 'Request sent' },
  { status: 'ACCEPTED', label: 'Accepted' },
  { status: 'FUNDED', label: 'Payment secured' },
  { status: 'DELIVERED', label: 'Delivered' },
  { status: 'COMPLETED', label: 'Completed' },
];

const STATUS: Record<BookingStatus, { label: string; className: string; text: string }> = {
  REQUESTED: { label: 'Waiting for provider', className: 'bg-accent-soft', text: 'text-accent' },
  ACCEPTED: { label: 'Accepted · pay to confirm', className: 'bg-accent-soft', text: 'text-accent' },
  FUNDED: { label: 'Payment secured', className: 'bg-success-soft', text: 'text-success' },
  DELIVERED: { label: 'Delivered · confirm or report', className: 'bg-primary-soft', text: 'text-primary' },
  COMPLETED: { label: 'Completed', className: 'bg-success-soft', text: 'text-success' },
  DISPUTED: { label: 'Problem under review', className: 'bg-danger-soft', text: 'text-danger' },
  CANCELLED: { label: 'Cancelled', className: 'bg-canvas', text: 'text-muted' },
};

export default function BookingDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { bookings, advance, rate, chats } = useApp();
  const b = bookings.find((x) => x.id === id);
  const [momo, setMomo] = useState(false);

  if (!b) {
    return (
      <SafeAreaView className="flex-1">
        <EmptyState icon="calendar" title="Booking not found" body="It may have been removed." />
      </SafeAreaView>
    );
  }
  const p = providerById(b.providerId)!;
  const first = p.name.split(' ')[0];
  const reached = new Set(b.events.map((e) => e.status));
  const status = STATUS[b.status];
  const chatId = chats.find((c) => c.providerId === p.id)?.id ?? `c-${p.id}`;
  const held = b.status === 'FUNDED' || b.status === 'DELIVERED' || b.status === 'DISPUTED';

  return (
    <View className="flex-1 bg-canvas">
      <SafeAreaView edges={['top']} className="bg-card">
        <View className="flex-row items-center justify-between p-4">
          <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace('/me'))} hitSlop={10}>
            <Ionicons name="arrow-back" size={22} className="text-ink" />
          </Pressable>
          <Text className="text-[17px] font-bold text-ink">Booking</Text>
          <Pressable
            onPress={() => router.push({ pathname: '/chat/[id]', params: { id: chatId, providerId: p.id } })}
            hitSlop={10}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={22} className="text-primary" />
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerClassName="gap-4 p-4 pb-10">
        <View className="rounded-card bg-card p-4">
          <View className="flex-row items-center gap-3">
            <Avatar initials={p.initials} color={p.color} size={46} />
            <View className="flex-1">
              <Text className="text-base font-bold text-ink">{b.title}</Text>
              <Text className="text-xs text-muted">{p.business}</Text>
            </View>
          </View>
          <View className={`mb-1 mt-3 self-start rounded-lg px-2.5 py-[5px] ${status.className}`}>
            <Text className={`text-[13px] font-bold ${status.text}`}>{status.label}</Text>
          </View>
          <Detail icon="calendar-outline" text={`${b.date} · ${b.time}`} />
          <Detail icon="location-outline" text={b.place} />
          {b.notes ? <Detail icon="document-text-outline" text={b.notes} /> : null}
        </View>

        {held ? (
          <View className="flex-row items-center gap-3 rounded-card bg-primary p-4">
            <Ionicons name={b.status === 'DISPUTED' ? 'lock-closed' : 'shield-checkmark'} size={26} className="text-white" />
            <View className="flex-1">
              <Text className="text-base font-bold text-white">{ghs(b.total)} held by Hanz</Text>
              <Text className="mt-0.5 text-xs leading-[17px] text-on-primary">
                {b.status === 'DISPUTED'
                  ? 'Release is frozen while Hanz reviews the problem. Target: within 72 hours.'
                  : `${first} can see the money is secured. It's released only when you confirm, or 48 hours after delivery.`}
              </Text>
            </View>
          </View>
        ) : null}

        <View className="rounded-card bg-card p-4">
          <Text className="mb-3 text-[15px] font-semibold text-ink">Timeline</Text>
          {STEPS.map((s, i) => {
            const done = reached.has(s.status);
            const ev = b.events.find((e) => e.status === s.status);
            return (
              <View key={s.status} className="flex-row gap-3">
                <View className="items-center">
                  <View
                    className={`h-5 w-5 items-center justify-center rounded-full border-2 ${done ? 'border-success bg-success' : 'border-line'}`}
                  >
                    {done ? <Ionicons name="checkmark" size={12} className="text-white" /> : null}
                  </View>
                  {i < STEPS.length - 1 ? <View className={`my-0.5 w-0.5 flex-1 ${done ? 'bg-success' : 'bg-line'}`} /> : null}
                </View>
                <View className="flex-1 pb-4">
                  <Text className={`text-sm font-semibold ${done ? 'text-ink' : 'text-muted'}`}>{ev?.label ?? s.label}</Text>
                  {ev ? <Text className="text-xs text-muted">{ev.at}</Text> : null}
                </View>
              </View>
            );
          })}
          {b.events
            .filter((e) => e.status === 'DISPUTED' || e.status === 'CANCELLED')
            .map((e) => (
              <Text key={e.status} className="text-xs text-danger">
                {e.label} · {e.at}
              </Text>
            ))}
        </View>

        <View className="rounded-card bg-card p-4">
          <Text className="mb-3 text-[15px] font-semibold text-ink">Payment</Text>
          <Line label="Service price" value={ghs(b.price)} />
          <Line label="Escrow protection fee" value={ghs(b.escrowFee)} />
          <Line label="Total" value={ghs(b.total)} bold />
        </View>

        {b.status === 'REQUESTED' ? (
          <View className="gap-2">
            <Simulated label={`${first} accepts the request`} onPress={() => advance(b.id, 'ACCEPTED', `${first} accepted`)} />
            <Button
              label="Cancel request"
              variant="danger"
              onPress={() => advance(b.id, 'CANCELLED', 'You cancelled (no charge)')}
            />
          </View>
        ) : null}

        {b.status === 'ACCEPTED' ? (
          <Button label={`Pay ${ghs(b.total)} with mobile money`} icon="phone-portrait-outline" onPress={() => setMomo(true)} />
        ) : null}

        {b.status === 'FUNDED' ? (
          <Simulated
            label={`${first} marks the job delivered`}
            onPress={() => advance(b.id, 'DELIVERED', `${first} marked delivered`)}
          />
        ) : null}

        {b.status === 'DELIVERED' ? (
          <View className="gap-2">
            <Button
              label="Confirm job done"
              icon="checkmark-circle-outline"
              onPress={() => advance(b.id, 'COMPLETED', `Money released to ${first}`)}
            />
            <Button
              label="Report a problem"
              variant="danger"
              icon="alert-circle-outline"
              onPress={() => advance(b.id, 'DISPUTED', 'Problem reported, release frozen')}
            />
          </View>
        ) : null}

        {b.status === 'COMPLETED' ? (
          <View className="items-center rounded-card bg-card p-4">
            <Text className="mb-3 text-[15px] font-semibold text-ink">
              {b.rating ? 'Thanks for your rating' : `Rate ${first}`}
            </Text>
            <View className="flex-row gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Pressable key={i} onPress={() => rate(b.id, i)} hitSlop={6}>
                  <Ionicons name={(b.rating ?? 0) >= i ? 'star' : 'star-outline'} size={32} className="text-star" />
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}
      </ScrollView>

      <Sheet visible={momo} onClose={() => setMomo(false)}>
        <View className="mb-3 h-16 w-16 items-center justify-center rounded-full bg-primary-soft">
          <Ionicons name="phone-portrait" size={30} className="text-primary" />
        </View>
        <Text className="text-center text-xl font-bold text-ink">Approve the prompt on your phone</Text>
        <Text className="mt-2 text-center text-sm leading-5 text-muted">
          We sent a mobile money request for {ghs(b.total)} to 024 ••• 4471 (MTN MoMo). Enter your PIN to approve it.
        </Text>
        <View className="mt-3 rounded-lg bg-accent-soft px-2.5 py-1">
          <Text className="text-xs font-semibold text-accent">Prototype: no real money moves</Text>
        </View>
        <Button
          label="I approved it"
          className="mt-4 self-stretch"
          onPress={() => {
            setMomo(false);
            advance(b.id, 'FUNDED', 'Payment secured in escrow');
          }}
        />
        <Button label="Cancel" variant="ghost" className="self-stretch" onPress={() => setMomo(false)} />
      </Sheet>
    </View>
  );
}

function Detail({ icon, text }: { icon: IconName; text: string }) {
  return (
    <View className="mt-2 flex-row items-start gap-2">
      <Ionicons name={icon} size={16} className="text-muted" style={{ marginTop: 1 }} />
      <Text className="flex-1 text-sm text-ink">{text}</Text>
    </View>
  );
}

function Line({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View className="flex-row justify-between py-1">
      <Text className={`text-sm ${bold ? 'font-bold text-ink' : 'text-muted'}`}>{label}</Text>
      <Text className="text-sm font-bold text-ink">{value}</Text>
    </View>
  );
}

function Simulated({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="h-12 flex-row items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed border-accent bg-accent-soft active:opacity-80"
    >
      <Ionicons name="play-forward" size={16} className="text-accent" />
      <Text className="text-sm font-bold text-accent">Demo: {label}</Text>
    </Pressable>
  );
}