// apps/mobile/src/app/_layout.tsx
import '../../global.css';
import '@/components/styled'; // lets Ionicons and TextInput take Tailwind classes

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";


import { AppStoreProvider } from '@/store/AppStore';

export default function RootLayout() {
  return (
    <SafeAreaView className="flex-1">
      <AppStoreProvider>
        <StatusBar style="dark" />
        {/* On a wide browser window, keep the app phone-sized and centred. */}
        <View className="flex-1 bg-canvas web:bg-backdrop">
          <View className="w-full flex-1 self-center bg-canvas web:max-w-[480px]">
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="provider/[id]" />
              <Stack.Screen name="book/[providerId]" options={{ presentation: 'modal' }} />
              <Stack.Screen name="booking/[id]" />
              <Stack.Screen name="chat/[id]" />
              <Stack.Screen name="notifications" />
            </Stack>
          </View>
        </View>

        
      </AppStoreProvider>
    </SafeAreaView>
  );
}

