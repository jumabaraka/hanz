// apps/mobile/src/app/(tabs)/index.tsx
// Home: categories, a short explainer of escrow, and recommended providers.
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Avatar, Card, Screen, SearchHeader, SectionTitle, Stars, Verified, WorkTile } from '@/components/ui';
import { categories, categoryById, providers } from '@/data/mock';
import { priceLabel } from '@/lib/money';

export default function Home() {
  const top = categories.slice(0, 4);
  const recommended = [...providers].sort((a, b) => b.rating - a.rating);

  return (
    <Screen>
      <SearchHeader onFocus={() => router.push('/discover')} />
      <ScrollView contentContainerClassName="gap-4 p-4 pt-2">
        <Card>
          <SectionTitle title="Top Categories" action="See all" onAction={() => router.push('/discover')} />
          <View className="flex-row flex-wrap gap-y-4">
            {top.map((c) => {
              const people = providers.filter((p) => p.categoryId === c.id);
              return (
                <Pressable
                  key={c.id}
                  className="w-1/2 items-center gap-2"
                  onPress={() => router.push({ pathname: '/discover', params: { category: c.id } })}
                >
                  <Text className="text-[13px] font-medium text-ink" numberOfLines={1}>
                    {c.name}
                  </Text>
                  <View className="flex-row items-center">
                    {people.slice(0, 3).map((p, i) => (
                      <View
                        key={p.id}
                        className={i ? '-ml-2.5 rounded-full border-2 border-white' : 'rounded-full border-2 border-white'}
                      >
                        <Avatar initials={p.initials} color={p.color} size={32} />
                      </View>
                    ))}
                    <View
                      className="-ml-2.5 h-8 w-8 items-center justify-center rounded-full border-2 border-white"
                      style={{ backgroundColor: c.color }}
                    >
                      <Ionicons name={c.icon} size={14} className="text-white" />
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </Card>

        <View className="flex-row items-center gap-3 rounded-card bg-primary p-4">
          <Ionicons name="shield-checkmark" size={28} className="text-white" />
          <View className="flex-1">
            <Text className="text-[15px] font-bold text-white">Pay safely with Hanz escrow</Text>
            <Text className="mt-0.5 text-[13px] leading-[18px] text-on-primary">
              Your money is held until you confirm the job is done. If something goes wrong, you get it back.
            </Text>
          </View>
        </View>

        <View>
          <SectionTitle title="Recommended for You" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-3">
            {recommended.map((p) => {
              const cat = categoryById(p.categoryId);
              const cheapest = [...p.listings].sort((a, b) => a.price - b.price)[0];
              return (
                <Pressable key={p.id} onPress={() => router.push(`/provider/${p.id}`)} className="w-60 rounded-card bg-card p-3">
                  <View className="mb-2.5 flex-row items-center gap-2">
                    <Avatar initials={p.initials} color={p.color} size={32} />
                    <View className="flex-1">
                      <View className="flex-row items-center gap-1">
                        <Text className="shrink text-sm font-semibold text-ink" numberOfLines={1}>
                          {p.business}
                        </Text>
                        {p.verified ? <Verified /> : null}
                      </View>
                      <Text className="text-xs text-muted">{cat?.name}</Text>
                    </View>
                  </View>
                  <View className="flex-row gap-1.5">
                    {p.works.slice(0, 2).map((w) => (
                      <WorkTile key={w.id} work={w} size={104} />
                    ))}
                  </View>
                  <View className="mt-2.5 flex-row items-center justify-between">
                    <View className="flex-row items-center gap-1">
                      <Stars rating={p.rating} />
                      <Text className="text-xs text-muted">
                        {p.rating} ({p.reviewCount})
                      </Text>
                    </View>
                    <Text className="text-[13px] font-bold text-primary">{priceLabel(cheapest.price, cheapest.priceType)}</Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </ScrollView>
    </Screen>
  );
}