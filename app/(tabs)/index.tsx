import { useActions } from '@/hooks/use-actions';
import { CommunityAction } from '@/interfaces/community-action';
import { Link, useFocusEffect, useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import React, { useCallback } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ActionCard } from '../../components/action-card';

export default function HomeScreen() {
  const { actions, refresh } = useActions();

  const router = useRouter();

  // Recarrega quando a tela recebe foco
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const getActionsByTag = () => {
    // TODO: consider an action in a single more relevant tag,
    // currently, if an action has more than one tag it will appear multiple times
    const tagMap = new Map<string, CommunityAction[]>();

    actions.forEach((action) => {
  let tags: string[] = [];

  // Garante que tags sempre seja um array
  if (Array.isArray(action.tags)) {
        tags = action.tags;
      } else if (typeof action.tags === 'string') {
        try {
          const parsed = JSON.parse(action.tags);
          if (Array.isArray(parsed)) {
            tags = parsed;
          } else {
            tags = [action.tags];
          }
        } catch {
          tags = [action.tags];
        }
      }

      tags.forEach((tag) => {
        if (!tagMap.has(tag)) {
          tagMap.set(tag, []);
        }
        tagMap.get(tag)!.push(action);
      });
    });

    // Ordenar tags por número de ações (mais populares primeiro)
    return Array.from(tagMap.entries())
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 5); // Pegar apenas as 5 tags mais populares
  };

  const tagSections = getActionsByTag();

  const renderTagSection = ({ item }: { item: [string, CommunityAction[]] }) => {
    const [tag, tagActions] = item;

    return (
      <View style={styles.tagSection}>
        <View style={styles.tagHeader}>
          <Text style={styles.tagTitle}>{tag}</Text>
          <Text style={styles.tagCount}>
            {tagActions.length} {tagActions.length === 1 ? 'ação' : 'ações'}
          </Text>
        </View>

        <FlatList
          horizontal
          data={tagActions}
          keyExtractor={(action) => action.id}
          renderItem={({ item: action }) => (
            <View style={styles.carouselItem}>
              <ActionCard
                action={action}
                onClick={() => router.navigate({ pathname: '/actions/[id]', params: { id: action.id } })}
              />
            </View>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContent}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Ações Recentes</Text>

        {actions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              Nenhuma ação cadastrada ainda.
            </Text>
            <Text style={styles.emptySubtext}>
              Seja o primeiro a compartilhar uma ação comunitária!
            </Text>
          </View>
        ) : (
          <FlatList
            data={tagSections}
            keyExtractor={(item) => item[0]}
            renderItem={renderTagSection}
            scrollEnabled={false}
            contentContainerStyle={styles.sectionsContainer}
          />
        )}
      </ScrollView>

      <Link href={{ pathname: "/actions/create" }} asChild>
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.8}
        >
          <Plus color="#ffffff" size={28} />
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 24,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  sectionsContainer: {
    gap: 24,
  },
  tagSection: {
    marginBottom: 24,
  },
  tagHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tagTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000000',
  },
  tagCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  carouselContent: {
    paddingRight: 16,
  },
  carouselItem: {
    width: 300,
    marginRight: 12,
  },
  fab: {
    position: 'absolute',
    bottom: 64,
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
    elevation: 8,
  },
});
