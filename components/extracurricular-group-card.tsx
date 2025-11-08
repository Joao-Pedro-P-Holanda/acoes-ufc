import { ExtracurricularGroup } from '@/interfaces/extracurricular_group';
import { Tag, Users } from 'lucide-react-native';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface ExtracurricularGroupCardProps {
  group: ExtracurricularGroup;
  onClick?: () => void;
}

export function ExtracurricularGroupCard({ group, onClick }: ExtracurricularGroupCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onClick}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={styles.header}>
          <Users color="#007AFF" size={20} style={styles.icon} />
          <Text style={styles.title} numberOfLines={2}>
            {group.name}
          </Text>
        </View>

        {group.category && (
          <View style={styles.categoryRow}>
            <Tag color="#6B7280" size={16} style={styles.categoryIcon} />
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{group.category}</Text>
            </View>
          </View>
        )}

        {group.description && (
          <Text style={styles.description} numberOfLines={2}>
            {group.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 12,
  },
  cardContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  icon: {
    marginTop: 2,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    lineHeight: 24,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  categoryIcon: {
    opacity: 0.7,
  },
  categoryBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0369A1',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});
