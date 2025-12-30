import 'react-native-get-random-values';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Link, Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';


import { useColorScheme } from '@/hooks/use-color-scheme';
import { Plus } from 'lucide-react-native';
import { StyleSheet, TouchableOpacity } from 'react-native';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();

  const routesWithFab = [
    "/",
    "/actions",
    "/extracurricular-groups"
  ]

  const shouldShowFab = routesWithFab.some(screen =>
    pathname === screen || pathname.startsWith('/(tabs)')
  );

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="form-selector" options={{ title: "Adicionar novo evento" }} />
        <Stack.Screen name="actions/create" options={{ title: "Compartilhar ação externa" }} />
        <Stack.Screen name="actions/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="extracurricular-groups/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="extracurricular-groups/create" options={{ title: "Criar Célula de discentes" }} />
      </Stack>

      {shouldShowFab && <Link href={{ pathname: "/form-selector" }} asChild>

        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.8}
        >
          <Plus color="#ffffff" size={28} />
        </TouchableOpacity>
      </Link>
      }
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 128,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    boxShadow: '0px 4px 4.65px rgba(0,0,0,0.3)' as any,
    elevation: 8,
  },
})
