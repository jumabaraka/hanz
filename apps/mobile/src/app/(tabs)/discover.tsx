// apps/mobile/src/app/(tabs)/discover.tsx
// Discover: search, quick filters, category tiles and provider results.
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Avatar, Chip, EmptyState, Screen, SearchHeader, Stars, Verified, WorkTile } from '@/components/ui';
import { categories, categoryById, providers, type Provider } from '@/data/mock';
import { priceLabel } from '@/lib/money';
import { useApp } from '@/store/AppStore';

type Filter = 'near' | 'following' | 'top' | 'today' | null;

const FILTERS: { id: Exclude<Filter, null>; label: string }[] = [
  { id: 'near', label: 'Near Me' },
  { id: 'following', label: 'Following' },
  { id: 'top', label: 'Top Rated' },
  { id: 'today', label: 'Available Today' },
];

export default function Discover() {
  const params = useLocalSearchParams<{ category?: string }>();
  const { following } = useApp();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>(null);
  const [category, setCategory] = useState<string | null>(params.category ?? null);

  useEffect(() => {
    if (params.category) setCategory(params.category);
  }, [params.category]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list: Provider[] = providers.filter((p) => {
      if (category && p.categoryId !== category) return false;
      if (!q) return true;
      const cat = categoryById(p.categoryId)?.name ?? '';
      return [p.name, p.business, cat, ...p.listings.map((l) => l.title)].some((s) => s.toLowerCase().includes(q));
    });
    if (filter === 'following') list = list.filter((p) => following[p.id]);
    if (filter === 'today') list = list.filter((p) => p.availableToday);
    if (filter === 'top') list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [query, filter, category, following]);

  const browsing = !query && !filter && !category;
  const cat = category ? categoryById(category) : null;
  const heading = cat
    ? cat.name
    : filter === 'following'
      ? 'People you follow'
      : filter === 'top'
        ? 'Top rated near you'
        : filter === 'today'
          ? 'Available today'
          : filter === 'near'
            ? 'Near you on campus'
            : `Results for “${query}”`;

  return (
    <Screen>
      <SearchHeader value={query} onChangeText={setQuery} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="grow-0"
        contentContainerClassName="gap-2 px-4 pb-3"
      >
        {FILTERS.map((f) => (
          <Chip key={f.id} label={f.label} active={filter === f.id} onPress={() => setFilter(filter === f.id ? null : f.id)} />
        ))}
      </ScrollView>

      <ScrollView contentContainerClassName="p-4 pt-1">
        {browsing ? (
          <View className="flex-row flex-wrap justify-between gap-y-3">
            {categories.map((c) => {
              const count = providers.filter((p) => p.categoryId === c.id).length;
              return (
                <Pressable
                  key={c.id}
                  className="aspect-square w-[48.5%] justify-between rounded-xl p-3"
                  style={{ backgroundColor: c.color }}
                  onPress={() => setCategory(c.id)}
                >
                  <Ionicons name={c.icon} size={44} className="text-white/90" />
                  <View className="flex-row items-end justify-between gap-1.5">
                    <Text className="flex-1 text-base font-semibold text-white" numberOfLines={2}>
                      {c.name}
                    </Text>
                    <View className="rounded-full bg-white/25 px-2 py-0.5">
                      <Text className="text-xs font-bold text-white">{count}</Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        ) : (
          <>
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-[17px] font-semibold text-ink">{heading}</Text>
              {category ? (
                <Pressable onPress={() => setCategory(null)} hitSlop={8}>
                  <Text className="font-semibold text-accent">Clear</Text>
                </Pressable>
              ) : null}
            </View>

            {results.length === 0 ? (
              <EmptyState
                icon="search"
                title="No results found"
                body="Try different words, remove a filter, or look in another category."
              />
            ) : filter === 'top' ? (
              <View className="flex-row flex-wrap gap-y-4">
                {results.map((p) => (
                  <Pressable key={p.id} className="w-1/3 items-center gap-1.5" onPress={() => router.push(`/provider/${p.id}`)}>
                    <View className="rounded-full border-2 border-accent p-[3px]">
                      <Avatar initials={p.initials} color={p.color} size={60} />
                      <View className="absolute -bottom-0.5 -right-1 rounded-full border-2 border-canvas bg-primary px-[5px] py-px">
                        <Text className="text-[10px] font-bold text-white">{p.rating}</Text>
                      </View>
                    </View>
                    <Text className="px-1 text-center text-xs text-muted" numberOfLines={2}>
                      {p.business}
                    </Text>
                  </Pressable>
                ))}
              </View>
            ) : (
              <View className="gap-3">
                {results.map((p) => (
                  <ProviderRow key={p.id} p={p} />
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

function ProviderRow({ p }: { p: Provider }) {
  const cheapest = [...p.listings].sort((a, b) => a.price - b.price)[0];
  return (
    <Pressable className="rounded-card bg-card p-3" onPress={() => router.push(`/provider/${p.id}`)}>
      <View className="flex-row items-center gap-3">
        <Avatar initials={p.initials} color={p.color} size={46} />
        <View className="flex-1">
          <View className="flex-row items-center gap-1">
            <Text className="shrink text-[15px] font-semibold text-ink" numberOfLines={1}>
              {p.business}
            </Text>
            {p.verified ? <Verified /> : null}
          </View>
          <View className="mt-0.5 flex-row items-center gap-1">
            <Stars rating={p.rating} />
            <Text className="text-xs text-muted">
              {p.rating} · {p.reviewCount} reviews
            </Text>
          </View>
          <Text className="mt-0.5 text-xs text-muted">
            <Ionicons name="location-outline" size={12} className="text-muted" /> {p.area}
            {p.availableToday ? '  ·  Available today' : ''}
          </Text>
        </View>
        <Text className="text-[13px] font-bold text-primary">{priceLabel(cheapest.price, cheapest.priceType)}</Text>
      </View>
      <View className="mt-3 flex-row gap-1.5">
        {p.works.slice(0, 3).map((w) => (
          <WorkTile key={w.id} work={w} size={96} />
        ))}
      </View>
    </Pressable>
  );
}