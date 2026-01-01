import { RecommendationCarousel } from '@/components/recommendation-carousel';
import { useActions } from '@/hooks/use-actions';
import useRecommendations from '@/hooks/use-recommendations';
import { CommunityAction } from '@/interfaces/community-action';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ActionCard } from '../../components/action-card';

export default function HomeScreen() {
  const { actions } = useActions();

  const { recommendations } = useRecommendations()
  console.log("recomendations", recommendations)


  const router = useRouter();

  const [showSplash, setShowSplash] = useState(true);

  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.delay(800),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => setShowSplash(false));
  }, []);

  const getActionsByTag = () => {
    const tagMap = new Map<string, CommunityAction[]>();

    actions.forEach((action) => {
      let tags: string[] = [];

      if (Array.isArray(action.tags)) {
        tags = action.tags;
      } else if (typeof action.tags === 'string') {
        try {
          const parsed = JSON.parse(action.tags);
          tags = Array.isArray(parsed) ? parsed : [action.tags];
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

    return Array.from(tagMap.entries())
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 5);
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
                onClick={() =>
                  router.navigate({
                    pathname: '/actions/[id]',
                    params: { id: action.id },
                  })
                }
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
        <Text style={styles.sectionTitle}>Recomendações</Text>
        
        <RecommendationCarousel items={recommendations} />
        
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

      {showSplash && (
        <Animated.View
          style={[
            styles.splashContainer,
            { opacity },
          ]}
        >
          <Animated.Image
            source={require('@/assets/images/icon.jpg')}
            style={{
              width: 180,
              height: 180,
              transform: [{ scale }],
            }}
            resizeMode="contain"
          />
        </Animated.View>
      )}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
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
    marginLeft: 2,
    marginTop: 2,
    marginBottom: 2,
  },
  splashContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#121214',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
});