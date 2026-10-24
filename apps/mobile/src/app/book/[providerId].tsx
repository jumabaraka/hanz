// apps/mobile/src/app/book/[providerId].tsx
// Booking request (PRD BKG-1): service, date, time, place, notes, and the escrow price breakdown.
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TextInput } from '@/components/styled';
import { Avatar, Button, Chip, SuccessModal, Verified } from '@/components/ui';
import { locations, providerById } from '@/data/mock';
import { breakdown, ghs, priceLabel } from '@/lib/money';
import { useApp } from '@/store/AppStore';

const TIMES = ['Morning (9am)', 'Afternoon (1pm)', 'Evening (5pm)'];

function nextDays(n: number) {
  const out: string[] = [];
  const d = new Date();
  for (let i = 0; i < n; i++) {
    const day = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);
    out.push(
      i === 0
        ? 'Today'
        : i === 1
          ? 'Tomorrow'
          : day.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }),
    );
  }
  return out;
}

export default function BookRequest() {
  const { providerId, listingId } = useLocalSearchParams<{ providerId: string; listingId?: string }>();
  const p = providerById(providerId ?? '');
  const { createBooking } = useApp();
  const days = useMemo(() => nextDays(6), []);

  const [selected, setSelected] = useState(listingId ?? p?.listings[0]?.id ?? '');
  const [day, setDay] = useState(days[1]);
  const [time, setTime] = useState(TIMES[1]);
  const [place, setPlace] = useState(locations[0]);
  const [notes, setNotes] = useState('');
  const [sentId, setSentId] = useState<string | null>(null);

  if (!p) return null;
  const listing = p.listings.find((l) => l.id === selected) ?? p.listings[0];
  const money = breakdown(listing.price);
  const first = p.name.split(' ')[0];

  const send = () => {
    const id = createBooking({
      providerId: p.id,
      listingId: listing.id,
      title: listing.title,
      price: money.price,
      escrowFee: money.escrowFee,
      total: money.total,
      date: day,
      time,
      place,
      notes,
    });
    setSentId(id);
  };

  return (
    <View className="flex-1 bg-canvas">
      <SafeAreaView edges={['top']} className="bg-card">
        <View className="flex-row items-center justify-between p-4">
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Ionicons name="close" size={24} className="text-ink" />
          </Pressable>
          <Text className="text-[17px] font-bold text-ink">Request a booking</Text>
          <View className="w-6" />
        </View>
      </SafeAreaView>

      <ScrollView contentContainerClassName="gap-5 p-4 pb-32">
        <View className="flex-row items-center gap-3 rounded-card bg-card p-3">
          <Avatar initials={p.initials} color={p.color} size={44} />
          <View className="flex-1">
            <View className="flex-row items-center gap-1">
              <Text className="text-base font-bold text-ink">{p.business}</Text>
              {p.verified ? <Verified /> : null}
            </View>
            <Text className="text-xs text-muted">Usually replies within 1 hour</Text>
          </View>
        </View>

        <Field label="Service">
          <View className="gap-2">
            {p.listings.map((l) => {
              const on = l.id === listing.id;
              return (
                <Pressable
                  key={l.id}
                  onPress={() => setSelected(l.id)}
                  className={`flex-row items-center gap-2.5 rounded-xl border-[1.5px] bg-card p-3 ${on ? 'border-primary' : 'border-card'}`}
                >
                  <Ionicons
                    name={on ? 'radio-button-on' : 'radio-button-off'}
                    size={20}
                    className={on ? 'text-primary' : 'text-muted'}
                  />
                  <Text className="flex-1 text-sm text-ink">{l.title}</Text>
                  <Text className="text-[13px] font-bold text-primary">{priceLabel(l.price, l.priceType)}</Text>
                </Pressable>
              );
            })}
          </View>
        </Field>

        <Field label="Day">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2">
            {days.map((d) => (
              <Chip key={d} label={d} active={d === day} onPress={() => setDay(d)} />
            ))}
          </ScrollView>
        </Field>

        <Field label="Time">
          <View className="flex-row flex-wrap gap-2">
            {TIMES.map((t) => (
              <Chip key={t} label={t} active={t === time} onPress={() => setTime(t)} />
            ))}
          </View>
        </Field>

        <Field label="Where">
          <View className="flex-row flex-wrap gap-2">
            {locations.map((l) => (
              <Chip key={l} label={l} active={l === place} onPress={() => setPlace(l)} />
            ))}
          </View>
        </Field>

        <Field label={`Notes for ${first}`}>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Describe the job, e.g. phone model, sizes, topic…"
            multiline
            textAlignVertical="top"
            className="min-h-[90px] rounded-xl bg-card p-3 text-sm text-ink web:outline-none"
          />
        </Field>

        <View className="rounded-card bg-card p-4">
          <Row label="Service price" value={ghs(money.price)} />
          <Row label="Escrow protection fee" value={ghs(money.escrowFee)} />
          <View className="my-2 h-px bg-line" />
          <Row label="Total you pay" value={ghs(money.total)} bold />
          <View className="mt-3 flex-row gap-2 rounded-xl bg-primary-soft p-3">
            <Ionicons name="shield-checkmark" size={18} className="text-primary" />
            <Text className="flex-1 text-xs leading-[18px] text-primary-dark">
              You pay by mobile money only after {first} accepts. Hanz holds the money and releases it when you confirm the job is
              done, or 48 hours after delivery if you raise no problem.
            </Text>
          </View>
          <Text className="mt-3 text-[11px] leading-4 text-muted">
            Cancel before acceptance: no charge. Cancel more than 2 hours before the booked time: full refund of the service
            price.
          </Text>
        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} className="absolute inset-x-0 bottom-0 border-t border-line bg-card">
        <View className="p-4">
          <Button label={`Send request · ${ghs(money.total)}`} onPress={send} />
        </View>
      </SafeAreaView>

      <SuccessModal
        visible={!!sentId}
        title="Request sent"
        body={`${first} has 12 hours to accept. You'll get a notification, then pay ${ghs(money.total)} by mobile money into escrow.`}
        primary="View booking"
        onPrimary={() => {
          const id = sentId;
          setSentId(null);
          if (id) router.replace(`/booking/${id}`);
        }}
        secondary="Back to home"
        onSecondary={() => {
          setSentId(null);
          router.dismissAll();
        }}
        onClose={() => setSentId(null)}
      />
    </View>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View>
      <Text className="mb-2 text-sm font-semibold text-ink">{label}</Text>
      {children}
    </View>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View className="flex-row justify-between py-1">
      <Text className={`text-sm ${bold ? 'font-bold text-ink' : 'text-muted'}`}>{label}</Text>
      <Text className={`font-bold text-ink ${bold ? 'text-[17px]' : 'text-sm'}`}>{value}</Text>
    </View>
  );
}