// apps/mobile/src/components/styled.tsx
// One-time NativeWind setup for components whose colour is a prop rather than a style,
// so every colour in the app comes from tailwind.config.js. Imported once in src/app/_layout.tsx.
//
//   import Ionicons from '@expo/vector-icons/Ionicons';
//   <Ionicons name="star" size={16} className="text-star" />
//   <TextInput placeholderClassName="text-muted" />   (TextInput from this file)
import Ionicons from '@expo/vector-icons/Ionicons';
import { cssInterop } from 'nativewind';
import type { ComponentProps } from 'react';
import { TextInput as RNTextInput } from 'react-native';

cssInterop(Ionicons, {
  className: { target: 'style', nativeStyleToProp: { color: true } },
});

cssInterop(RNTextInput, {
  className: { target: 'style', nativeStyleToProp: { textAlign: true } },
  placeholderClassName: { target: false, nativeStyleToProp: { color: 'placeholderTextColor' } },
});

export type IconName = ComponentProps<typeof Ionicons>['name'];

export function TextInput(props: ComponentProps<typeof RNTextInput> & { placeholderClassName?: string }) {
  return <RNTextInput placeholderClassName="text-muted" {...props} />;
}