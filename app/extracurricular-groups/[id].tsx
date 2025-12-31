import { formatDuration, type Duration } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Calendar,
  CheckCircle,
  Clock,
  MapPin,
  Trash2,
  User,
  Users
} from "lucide-react-native";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useExtracurricularGroup } from "../../hooks/use-extracurricular-group";

export default function ExtracurricularGroupDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { group, deleteGroup, acceptRequest } = useExtracurricularGroup(
    typeof id === 'string' ? id : undefined
  );

  if (!group) {
    return (
      <View style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>Grupo extracurricular não encontrado</Text>
        </View>
      </View>
    );
  }

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

  const formatFrequency = (frequency?: Duration) => {
    if (!frequency) return "Não especificado";
    
    return formatDuration(frequency, {
      locale: ptBR,
      delimiter: ', ',
    });
  };

  const formatTime = (timeStr: string) => {
    // Extract HH:MM from time string (handles both "HH:MM:SS" and "HH:MM" formats)
    return timeStr.substring(0, 5);
  };

  const formatScheduledTimes = () => {
    const daysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    console.log(daysOfWeek)
    
    return group.allocated_times.map((time, index) => (
      <Text key={index} style={styles.scheduleItem}>
        {daysOfWeek[time.weekday]}: {formatTime(time.start_time)} às {formatTime(time.end_time)}
      </Text>
    ));
  };

  const handleDeleteGroup = async () => {
    try {
      await deleteGroup(group.id);
      router.back();
    } catch {
      Alert.alert("Erro", "Não foi possível remover o grupo extracurricular");
    }
  };

  const handleAcceptRequest = async () => {
    try {
      // You can pass the request ID here when implementing
      await acceptRequest('request-id');
      Alert.alert("Sucesso", "Solicitação aceita com sucesso!");
    } catch {
      Alert.alert("Erro", "Não foi possível aceitar a solicitação");
    }
  };
  console.log(group)

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Título */}
        <View style={styles.titleSection}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{group.name}</Text>
          </View>
          {group.category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{group.category}</Text>
            </View>
          )}
        </View>

        {/* Descrição */}
        {group.description && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sobre o Grupo</Text>
            <Text style={styles.description}>{group.description}</Text>
          </View>
        )}

        {/* Informações Principais */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Informações</Text>

          <View style={styles.infoSection}>
            <View style={styles.infoItem}>
              <Calendar size={20} color="#007AFF" style={styles.icon} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Período</Text>
                <Text style={styles.infoText}>
                  {formatDate(group.start_date)} até {formatDate(group.end_date)}
                </Text>
              </View>
            </View>

            <View style={styles.separator} />

            <View style={styles.infoItem}>
              <Clock size={20} color="#007AFF" style={styles.icon} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Frequência</Text>
                <Text style={styles.infoText}>
                  {formatFrequency(group.frequency)}
                </Text>
              </View>
            </View>

            {group.location && (
              <>
                <View style={styles.separator} />
                <View style={styles.infoItem}>
                  <MapPin size={20} color="#007AFF" style={styles.icon} />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Local</Text>
                    <Text style={styles.infoText}>{group.location}</Text>
                  </View>
                </View>
              </>
            )}

            <View style={styles.separator} />

            <View style={styles.infoItem}>
              <User size={20} color="#007AFF" style={styles.icon} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Professor Responsável</Text>
                <Text style={styles.infoText}>ID: {group.responsible_professor_id}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Horários */}
        {group.allocated_times.length > 0 && (
          <View style={styles.card}>
            <View style={styles.infoItem}>
              <Clock size={20} color="#007AFF" style={styles.icon} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Horários</Text>
                <View style={styles.scheduleContainer}>
                  {formatScheduledTimes()}
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Botões de Ação */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={handleAcceptRequest}
          >
            <CheckCircle size={18} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.acceptButtonText}>Aceitar Solicitação</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryButton}
          >
            <Users size={18} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.primaryButtonText}>Participar do Grupo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteGroup}
          >
            <Trash2 size={18} color="#dc2626" style={styles.buttonIcon} />
            <Text style={styles.deleteButtonText}>Remover Grupo</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: "#007AFF",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  categoryText: {
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
  separator: {
    height: 1,
    backgroundColor: "#e5e5e5",
  },
  scheduleContainer: {
    marginTop: 8,
    gap: 4,
  },
  scheduleItem: {
    fontSize: 14,
    color: "#000",
    paddingVertical: 4,
  },
  metaText: {
    fontSize: 12,
    color: "#999",
  },
  buttonsContainer: {
    gap: 8,
    marginBottom: 16,
  },
  acceptButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10b981",
    borderRadius: 8,
    padding: 14,
  },
  buttonIcon: {
    marginRight: 8,
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 14,
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
