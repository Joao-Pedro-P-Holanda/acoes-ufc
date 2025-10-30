import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Calendar, Clock, MapPin, Tag, Users } from 'lucide-react-native';
import { CommunityAction } from '@/interfaces/community-action';
interface ActionCardProps {
  action: CommunityAction;
  onClick?: () => void;
}

export function ActionCard({ action, onClick }: ActionCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onClick}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.headerContent}>
          <Text style={styles.title} numberOfLines={2}>
            {action.name}
          </Text>
          {action.isFull && (
            <View style={styles.badge}>
              <Users color="#FFFFFF" size={12} />
              <Text style={styles.badgeText}>Lotado</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <Calendar color="#6B7280" size={16} />
          <Text style={styles.infoText}>
            {formatDate(action.startDate)} - {formatDate(action.endDate)}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Clock color="#6B7280" size={16} />
          <Text style={styles.infoText}>
            {action.startTime} - {action.endTime}
            {action.frequency && ` • ${action.frequency}`}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <MapPin color="#6B7280" size={16} />
          <Text style={styles.infoText} numberOfLines={1}>
            {action.location}
          </Text>
        </View>

        <View style={styles.tagsRow}>
          <Tag color="#6B7280" size={16} style={styles.tagIcon} />
          <View style={styles.tagsContainer}>
            {action.tags.map((tag, index) => (
              <View key={index} style={styles.tagBadge}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.contactSection}>
          <Text style={styles.contactLabel}>
            Contato: <Text style={styles.contactValue}>{action.contact}</Text>
          </Text>
        </View>
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
  },
  cardHeader: {
    padding: 16,
    paddingBottom: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    lineHeight: 24,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  cardContent: {
    padding: 16,
    paddingTop: 0,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  tagIcon: {
    marginTop: 4,
  },
  tagsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
  contactSection: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  contactLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  contactValue: {
    color: '#000000',
    fontWeight: '500',
  },
});
