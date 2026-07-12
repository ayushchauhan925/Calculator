import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/store/useSettings';

export default function RootLayout() {
  const t = useTheme();

  return (
    <>
      <StatusBar style={t.dark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: t.shell },
          headerStyle: { backgroundColor: t.shell },
          headerTintColor: t.textHi,
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="history" options={{ presentation: 'modal' }} />
        <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
        <Stack.Screen name="about" options={{ headerShown: true, title: 'About' }} />
        <Stack.Screen name="privacy" options={{ headerShown: true, title: 'Privacy' }} />
      </Stack>
    </>
  );
}