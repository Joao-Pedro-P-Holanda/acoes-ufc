import { Image } from 'expo-image';
import { User } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { storage } from '@/utils/storage';

type Props = {
  title?: string;
  profileImageUrl?: string | null;
};

const HEADER_HEIGHT = 56;
const AVATAR_SIZE = 36;

type UserMenuButtonProps = {
  profileImageUrl?: string | null;
  menuTopOffset?: number;
};

export function UserMenuButton({ profileImageUrl, menuTopOffset = HEADER_HEIGHT }: UserMenuButtonProps) {
  const colorScheme = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  const theme = Colors[scheme];
  const insets = useSafeAreaInsets();

  const [menuOpen, setMenuOpen] = useState(false);
  const [storedProfileImageUrl, setStoredProfileImageUrl] = useState<string | null>(null);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const url = await storage.get<string>('profileImageUrl');
      if (!cancelled) setStoredProfileImageUrl(url);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const effectiveImageUrl = useMemo(() => {
    return profileImageUrl ?? storedProfileImageUrl;
  }, [profileImageUrl, storedProfileImageUrl]);

  const showDefaultIcon = !effectiveImageUrl || imageFailed;

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Abrir menu do usuário"
        hitSlop={8}
        style={[styles.avatarButton, { borderColor: theme.outlineVariant }]}
      >
        {showDefaultIcon ? (
          <View style={[styles.avatarFallback, { backgroundColor: theme.surface }]}>
            <User size={20} color={theme.icon} />
          </View>
        ) : (
          <Image
            source={{ uri: effectiveImageUrl }}
            style={styles.avatarImage}
            contentFit="cover"
            onError={() => setImageFailed(true)}
          />
        )}
      </Pressable>

      <Modal
        visible={menuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setMenuOpen(false)}>
          <Pressable
            style={[
              styles.menu,
              {
                top: insets.top + menuTopOffset,
                right: 16,
                backgroundColor: theme.background,
                borderColor: theme.outlineVariant,
              },
            ]}
            onPress={() => {
              // Keep menu open when tapping inside the menu container.
            }}
          >
            <Pressable
              accessibilityRole="button"
              onPress={() => setMenuOpen(false)}
              style={styles.menuItem}
            >
              <Text style={[styles.menuItemText, { color: theme.text }]}>Fechar</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

export function AppHeader({ title = 'UFC Ações ', profileImageUrl }: Props) {
  const colorScheme = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  const theme = Colors[scheme];
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top, backgroundColor: theme.background }]}>
      <View
        style={[
          styles.container,
          {
            height: HEADER_HEIGHT,
            borderBottomColor: theme.outlineVariant,
            backgroundColor: theme.background,
          },
        ]}
      >
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
          {title}
        </Text>

        <UserMenuButton profileImageUrl={profileImageUrl} menuTopOffset={HEADER_HEIGHT} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    width: '100%',
  },
  container: {
    width: '100%',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  avatarButton: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  menu: {
    position: 'absolute',
    minWidth: 160,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
