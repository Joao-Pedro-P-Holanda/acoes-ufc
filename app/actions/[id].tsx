import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Calendar,
  Clock,
  DollarSign,
  ExternalLink,
  MapPin,
  Tag,
  Trash2,
  Users
} from "lucide-react-native";
import { Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useActions } from "../../hooks/use-actions"; // Adjust the import path as needed

export default function ActionDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { actions, deleteAction } = useActions(typeof id === 'string' ? id : undefined);

  if (!actions || !actions.length) {
    return (
      <View style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>Ação não encontrada</Text>
        </View>
      </View>
    );
  }

  else {

    const action = actions[0];

    const formatDate = (dateStr: string) => {
      const [day, month, year] = dateStr.split('/');

      const date = new Date(Number(year), Number(month) - 1, Number(day));

      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      });
    };

    const formatPrice = (price?: number) => {
      if (price === undefined || price === 0) {
        return "Gratuito";
      }
      return `R$ ${price.toFixed(2).replace(".", ",")}`;
    };

    const handleOpenLink = (url: string) => {
      Linking.openURL(url);
    };

    const handleDeleteAction = async () => {
      try {
        await deleteAction(action.id);
        router.back();
      } catch {
        Alert.alert("Erro", "Não foi possível remover a ação");
      }
    }

    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          {/* Título e Status */}
          <View style={styles.titleSection}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{action.name}</Text>
              {action.isFull && (
                <View style={styles.badge}>
                  <Users size={12} color="#fff" />
                  <Text style={styles.badgeText}>Lotado</Text>
                </View>
              )}
            </View>
          </View>

          {/* Descrição */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sobre a Ação</Text>
            <Text style={styles.description}>{action.description}</Text>
          </View>

          {/* Informações Principais */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Informações</Text>

            <View style={styles.infoSection}>
              <View style={styles.infoItem}>
                <Calendar size={20} color="#007AFF" style={styles.icon} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Período</Text>
                  <Text style={styles.infoText}>
                    {formatDate(action.startDate)} até {formatDate(action.endDate)}
                  </Text>
                </View>
              </View>

              <View style={styles.separator} />

              <View style={styles.infoItem}>
                <Clock size={20} color="#007AFF" style={styles.icon} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Horário</Text>
                  <Text style={styles.infoText}>
                    {action.startTime} às {action.endTime}
                    {action.frequency && (
                      <Text style={styles.frequency}> • {action.frequency}</Text>
                    )}
                  </Text>
                </View>
              </View>

              <View style={styles.separator} />

              <View style={styles.infoItem}>
                <MapPin size={20} color="#007AFF" style={styles.icon} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Local</Text>
                  <Text style={styles.infoText}>{action.location}</Text>
                </View>
              </View>

              <View style={styles.separator} />

              <View style={styles.infoItem}>
                <Users size={20} color="#007AFF" style={styles.icon} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Vagas</Text>
                  <Text style={styles.infoText}>
                    {action.maxParticipants} participantes
                  </Text>
                </View>
              </View>

              <View style={styles.separator} />

              <View style={styles.infoItem}>
                <DollarSign size={20} color="#007AFF" style={styles.icon} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Inscrição</Text>
                  <Text style={styles.infoText}>
                    {formatPrice(action.price)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Tags */}
          <View style={styles.card}>
            <View style={styles.infoItem}>
              <Tag size={20} color="#007AFF" style={styles.icon} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Categorias</Text>
                <View style={styles.tagsContainer}>
                  {action.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>

          {/* Contato */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Contato</Text>
            <Text style={styles.description}>{action.contact}</Text>
          </View>

          {/* Link Original */}
          {action.originalLink && (
            <View style={styles.card}>
              <View style={styles.infoItem}>
                <ExternalLink size={20} color="#007AFF" style={styles.icon} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Mais Informações</Text>
                  <TouchableOpacity onPress={() => handleOpenLink(action.originalLink!)}>
                    <Text style={styles.link}>{action.originalLink}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* Botões de Ação */}
          <View style={styles.buttonsContainer}>
            {action.originalLink && (
              <TouchableOpacity
                style={styles.outlineButton}
                onPress={() => handleOpenLink(action.originalLink!)}
              >
                <ExternalLink size={18} color="#007AFF" style={styles.buttonIcon} />
                <Text style={styles.outlineButtonText}>Acessar Link Original</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.primaryButton, action.isFull && styles.disabledButton]}
              disabled={action.isFull}
            >
              <Text style={styles.primaryButtonText}>
                {action.isFull ? "Evento Lotado" : "Participar da Ação"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeleteAction}
            >
              <Trash2 size={18} color="#dc2626" style={styles.buttonIcon} />
              <Text style={styles.deleteButtonText}>Remover Ação</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#007AFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 48, // Account for status bar
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    boxShadow: '0px 2px 4px rgba(0,0,0,0.1)' as any,
    elevation: 3,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#666",
  },
  titleSection: {
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    flex: 1,
  },
  badge: {
    backgroundColor: "#dc2626",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    boxShadow: '0px 1px 2px rgba(0,0,0,0.05)' as any,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  infoSection: {
    gap: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  icon: {
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: "#000",
  },
  frequency: {
    color: "#666",
  },
  separator: {
    height: 1,
    backgroundColor: "#e5e5e5",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  tag: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 12,
    color: "#333",
  },
  link: {
    fontSize: 14,
    color: "#007AFF",
    textDecorationLine: "underline",
  },
  buttonsContainer: {
    gap: 8,
    marginBottom: 16,
  },
  outlineButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 8,
    padding: 14,
  },
  buttonIcon: {
    marginRight: 8,
  },
  outlineButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
  primaryButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#dc2626",
    borderRadius: 8,
    padding: 14,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#dc2626",
  },
});
