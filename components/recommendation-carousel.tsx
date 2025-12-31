import { Recommendation, RecommendationWithImage } from '@/types/recommendation';
import React, { useMemo } from 'react';
import {
  Dimensions,
  FlatList,
  ImageBackground,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Props = {
  items: RecommendationWithImage[];
};

const HORIZONTAL_PADDING = 16;
const CARD_GAP = 12;

export function RecommendationCarousel({ items }: Props) {
  const cardWidth = useMemo(() => {
    const windowWidth = Dimensions.get('window').width;
    return Math.min(340, windowWidth - HORIZONTAL_PADDING * 2);
  }, []);

  const renderItem = ({ item }: ListRenderItemInfo<RecommendationWithImage>) => {
    return (
      <View style={[styles.cardWrapper, { width: cardWidth, marginRight: CARD_GAP }]}>
        <ImageBackground
          source={item.backgroundImage}
          style={styles.card}
          imageStyle={styles.cardImage}
          resizeMode="cover"
        >
          <View style={styles.tagsRow}>
            {item.tags.slice(0, 3).map((tag) => (
              <View key={`${item.id}-${tag}`} style={styles.tagPill}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          <View style={styles.textOverlay}>
            <Text style={styles.title} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.subtitle} numberOfLines={1}>
              {item.mediaUsername}
            </Text>
          </View>
        </ImageBackground>
      </View>
    );
  };

  return (
    <FlatList
      horizontal
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      snapToInterval={cardWidth + CARD_GAP}
      decelerationRate="fast"
      pagingEnabled
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingRight: HORIZONTAL_PADDING - CARD_GAP,
  },
  cardWrapper: {
    height: 160,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  cardImage: {
    borderRadius: 16,
  },
  tagsRow: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    gap: 6,
    padding: 12,
  },
  tagPill: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  textOverlay: {
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
    opacity: 0.95,
  },
});
