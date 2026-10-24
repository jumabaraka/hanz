// apps/mobile/src/components/ui.tsx
// Small shared building blocks used across screens. Styled with Tailwind (NativeWind).
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { TextInput } from '@/components/styled';
import type { IconName, Work } from '@/data/mock';

const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(' ');

export function Screen({ children, edges = ['top'], className }: { children: ReactNode; edges?: Edge[]; className?: string }) {
  return (
    <SafeAreaView edges={edges} className={cx('flex-1 bg-canvas', className)}>
      {children}
    </SafeAreaView>
  );
}

/** Initials avatar. `color` is the person's own colour from their data; or pass a class such as "bg-accent". */
export function Avatar({
  initials,
  color,
  className,
  size = 44,
}: {
  initials: string;
  color?: string;
  className?: string;
  size?: number;
}) {
  return (
    <View
      className={cx('items-center justify-center', className)}
      style={{ width: size, height: size, borderRadius: size / 2, ...(color ? { backgroundColor: color } : null) }}
    >
      <Text className="font-bold text-white" style={{ fontSize: size * 0.36 }}>
        {initials}
      </Text>
    </View>
  );
}

export function Verified({ size = 14 }: { size?: number }) {
  return <Ionicons name="checkmark-circle" size={size} className="text-accent" />;
}

export function Stars({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <View className="flex-row gap-px">
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={rating >= i ? 'star' : rating >= i - 0.5 ? 'star-half' : 'star-outline'}
          size={size}
          className="text-star"
        />
      ))}
    </View>
  );
}

export function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className={cx('rounded-lg border px-3 py-[7px]', active ? 'border-primary bg-primary' : 'border-chip bg-chip')}
    >
      <Text className={cx('text-[13px] font-medium', active ? 'text-white' : 'text-muted')}>{label}</Text>
    </Pressable>
  );
}

export function SearchHeader({
  value,
  onChangeText,
  onSubmit,
  onFocus,
  placeholder = 'Search for services, people…',
}: {
  value?: string;
  onChangeText?: (t: string) => void;
  onSubmit?: () => void;
  onFocus?: () => void;
  placeholder?: string;
}) {
  return (
    <View className="flex-row items-center gap-2 px-4 py-2">
      <View className="h-11 flex-1 flex-row items-center gap-2 rounded-xl bg-card px-3">
        <Ionicons name="search" size={18} className="text-muted" />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmit}
          onFocus={onFocus}
          placeholder={placeholder}
          className="h-11 flex-1 text-sm text-ink web:outline-none"
          returnKeyType="search"
        />
        {value ? (
          <Pressable onPress={() => onChangeText?.('')} hitSlop={8}>
            <Ionicons name="close" size={18} className="text-muted" />
          </Pressable>
        ) : null}
      </View>
      <Pressable
        className="h-11 w-11 items-center justify-center rounded-xl bg-card"
        onPress={() => router.push('/notifications')}
      >
        <Ionicons name="notifications-outline" size={20} className="text-primary" />
        <View className="absolute right-[11px] top-2.5 h-2 w-2 rounded-full bg-danger" />
      </Pressable>
    </View>
  );
}

export function SectionTitle({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View className="mb-3 flex-row items-center justify-between">
      <View className="flex-row items-center gap-2">
        <View className="h-[26px] w-[26px] items-center justify-center rounded-[7px] bg-accent-soft">
          <Ionicons name="flash" size={14} className="text-accent" />
        </View>
        <Text className="text-[17px] font-semibold text-ink">{title}</Text>
      </View>
      {action ? (
        <Pressable onPress={onAction} className="rounded-lg bg-accent-soft px-2.5 py-[5px]">
          <Text className="text-xs font-semibold text-accent">{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <View className={cx('rounded-card bg-card p-4 shadow-sm', className)}>{children}</View>;
}

const BUTTON = {
  primary: { box: 'bg-primary border-transparent', text: 'text-white' },
  outline: { box: 'bg-transparent border-primary', text: 'text-primary' },
  ghost: { box: 'bg-transparent border-transparent', text: 'text-primary' },
  danger: { box: 'bg-danger-soft border-transparent', text: 'text-danger' },
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled,
  className,
}: {
  label: string;
  onPress?: () => void;
  variant?: keyof typeof BUTTON;
  icon?: IconName;
  disabled?: boolean;
  className?: string;
}) {
  const v = BUTTON[variant];
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      className={cx(
        'h-[50px] flex-row items-center justify-center gap-2 rounded-xl border-[1.5px] px-4 active:opacity-80',
        disabled ? 'border-transparent bg-disabled' : v.box,
        className,
      )}
    >
      {icon ? <Ionicons name={icon} size={18} className={disabled ? 'text-white' : v.text} /> : null}
      <Text className={cx('text-base font-semibold', disabled ? 'text-white' : v.text)}>{label}</Text>
    </Pressable>
  );
}

export function WorkTile({ work, size }: { work: Work; size: number }) {
  return (
    <View className="justify-between rounded-lg p-2" style={{ width: size, height: size, backgroundColor: work.tint }}>
      <Ionicons
        name={work.icon}
        size={size * 0.3}
        className="text-primary"
        style={{ alignSelf: 'center', marginTop: size * 0.18 }}
      />
      <Text numberOfLines={2} className="text-[11px] font-medium text-ink">
        {work.title}
      </Text>
    </View>
  );
}

/** Bottom sheet used for confirmations and the mobile money prompt. */
export function Sheet({ visible, onClose, children }: { visible: boolean; onClose: () => void; children: ReactNode }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/45">
        <View className="w-full max-w-[520px] items-center self-center rounded-t-sheet bg-card p-6 pb-10">{children}</View>
      </View>
    </Modal>
  );
}

export function SuccessModal({
  visible,
  title,
  body,
  primary,
  onPrimary,
  secondary,
  onSecondary,
  onClose,
}: {
  visible: boolean;
  title: string;
  body: string;
  primary: string;
  onPrimary: () => void;
  secondary?: string;
  onSecondary?: () => void;
  onClose: () => void;
}) {
  return (
    <Sheet visible={visible} onClose={onClose}>
      <Pressable onPress={onClose} className="self-end" hitSlop={10}>
        <Ionicons name="close" size={22} className="text-ink" />
      </Pressable>
      <View className="mb-4 h-[72px] w-[72px] items-center justify-center rounded-full bg-success">
        <Ionicons name="checkmark" size={36} className="text-white" />
      </View>
      <Text className="text-center text-[22px] font-bold text-ink">{title}</Text>
      <Text className="mt-2 text-center text-sm leading-5 text-muted">{body}</Text>
      <Button label={primary} onPress={onPrimary} className="mt-5 self-stretch" />
      {secondary ? <Button label={secondary} onPress={onSecondary} variant="ghost" className="self-stretch" /> : null}
    </Sheet>
  );
}

export function EmptyState({ icon, title, body }: { icon: IconName; title: string; body: string }) {
  return (
    <View className="items-center px-8 py-16">
      <View className="mb-4 h-[72px] w-[72px] items-center justify-center rounded-full bg-accent-soft">
        <Ionicons name={icon} size={32} className="text-accent" />
      </View>
      <Text className="text-center text-xl font-bold text-ink">{title}</Text>
      <Text className="mt-2 text-center text-sm leading-5 text-muted">{body}</Text>
    </View>
  );
}