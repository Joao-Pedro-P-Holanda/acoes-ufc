import { ExtracurricularGroupCard } from '@/components/extracurricular-group-card';
import { useExtracurricularGroups } from '@/hooks/use-extracurricular-groups';
import type { ExtracurricularGroup } from '@/interfaces/extracurricular_group';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ExtracurricularGroupsListScreen() {
  const [pageSize,setPageSize] = useState(10)
  const { 
    groups, 
    loading, 
    page, 
    totalCount, 
    hasNextPage, 
    hasPreviousPage, 
    goToNextPage, 
    goToPreviousPage, 
    refresh 
  } = useExtracurricularGroups(pageSize);
  const router = useRouter();
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: ExtracurricularGroup }) => (
    <ExtracurricularGroupCard
      group={item}
      onClick={() => router.push(`/extracurricular-groups/${item.id}`)}
    />
  );

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Carregando grupos...</Text>
        </View>
      );
    }

    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Nenhum grupo extracurricular encontrado</Text>
      </View>
    );
  };

  const renderPagination = () => {
    if (!totalCount || totalCount === 0) return null;

    const totalPages = Math.ceil(totalCount / 10);
    const currentPage = page + 1;

    return (
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={[styles.paginationButton, !hasPreviousPage && styles.paginationButtonDisabled]}
          onPress={goToPreviousPage}
          disabled={!hasPreviousPage || loading}
        >
          <Text style={[styles.paginationButtonText, !hasPreviousPage && styles.paginationButtonTextDisabled]}>
            Anterior
          </Text>
        </TouchableOpacity>

        <View style={styles.paginationInfo}>
          <Text style={styles.paginationText}>
            Página {currentPage} de {totalPages}
          </Text>
          <Text style={styles.paginationSubtext}>
            {(pageSize * page)+1} - {Math.min(pageSize* (page+1),totalCount)}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.paginationButton, !hasNextPage && styles.paginationButtonDisabled]}
          onPress={goToNextPage}
          disabled={!hasNextPage || loading}
        >
          <Text style={[styles.paginationButtonText, !hasNextPage && styles.paginationButtonTextDisabled]}>
            Próxima
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Grupos Extracurriculares</Text>
        <Text style={styles.headerSubtitle}>
          {totalCount !== null ? totalCount : groups.length} {totalCount === 1 ? 'grupo' : 'grupos'} encontrado{totalCount === 1 ? '' : 's'}
        </Text>
      </View>

      <FlatList
        data={groups}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#007AFF"
          />
        }
      />

      {renderPagination()}

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  paginationButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  paginationButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  paginationButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  paginationButtonTextDisabled: {
    color: '#9CA3AF',
  },
  paginationInfo: {
    alignItems: 'center',
  },
  paginationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  paginationSubtext: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
