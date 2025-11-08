import React, { useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface FrequencySelectorProps {
  value?: string;
  onChange: (value: string) => void;
  startDate?: string; // formato DD/MM/YYYY
  containerStyle?: any;
  labelStyle?: any;
  inputStyle?: any;
}

type FrequencyType = '' | 'Diária' | 'Semanal' | 'Mensal' | 'Anual';
type EndType = 'Nunca' | 'Em' | 'Após';

const DAYS_OF_WEEK = [
  { short: 'D', full: 'Domingo', value: 0 },
  { short: 'S', full: 'Segunda', value: 1 },
  { short: 'T', full: 'Terça', value: 2 },
  { short: 'Q', full: 'Quarta', value: 3 },
  { short: 'Q', full: 'Quinta', value: 4 },
  { short: 'S', full: 'Sexta', value: 5 },
  { short: 'S', full: 'Sábado', value: 6 },
];

export function FrequencySelector({
  value,
  onChange,
  startDate,
  containerStyle,
  labelStyle,
  inputStyle,
}: FrequencySelectorProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [frequency, setFrequency] = useState<FrequencyType>('');
  const [interval, setInterval] = useState('1');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [endType, setEndType] = useState<EndType>('Nunca');
  const [endDate, setEndDate] = useState('');
  const [occurrences, setOccurrences] = useState('13');

  // Inicializa os dias selecionados baseado na data inicial
  React.useEffect(() => {
    if (startDate && frequency === 'Semanal') {
      const parts = startDate.split('/');
      if (parts.length === 3) {
        const date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        const dayOfWeek = date.getDay();
        if (selectedDays.length === 0) {
          setSelectedDays([dayOfWeek]);
        }
      }
    }
  }, [startDate, frequency]);

  const getDisplayText = () => {
    if (!value || value === '') return 'Não se repete';
    return value;
  };

  const handleConfirm = () => {
    if (!frequency) {
      onChange('');
      setModalVisible(false);
      return;
    }

    let result = '';
    
    if (frequency === 'Diária') {
      result = interval === '1' ? 'Diária' : `A cada ${interval} dias`;
    } else if (frequency === 'Semanal') {
      const dayNames = selectedDays
        .sort((a, b) => a - b)
        .map(d => DAYS_OF_WEEK[d].short)
        .join(', ');
      result = interval === '1' 
        ? `Semanal em ${dayNames}` 
        : `A cada ${interval} semanas em ${dayNames}`;
    } else if (frequency === 'Mensal') {
      result = interval === '1' ? 'Mensal' : `A cada ${interval} meses`;
    } else if (frequency === 'Anual') {
      result = interval === '1' ? 'Anual' : `A cada ${interval} anos`;
    }

    onChange(result);
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const toggleDay = (day: number) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  return (
    <View style={containerStyle}>
      <TouchableOpacity
        style={[styles.input, inputStyle]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.inputText}>{getDisplayText()}</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Recorrência personalizada</Text>

            <ScrollView style={styles.scrollContent}>
              {/* Repetir a cada */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Repetir a cada:</Text>
                <View style={styles.intervalRow}>
                  <TextInput
                    style={styles.intervalInput}
                    value={interval}
                    onChangeText={setInterval}
                    keyboardType="number-pad"
                    maxLength={3}
                  />
                  <View style={styles.pickerButton}>
                    <TouchableOpacity
                      style={[
                        styles.frequencyOption,
                        frequency === 'Diária' && styles.frequencyOptionSelected,
                      ]}
                      onPress={() => setFrequency('Diária')}
                    >
                      <Text
                        style={[
                          styles.frequencyOptionText,
                          frequency === 'Diária' && styles.frequencyOptionTextSelected,
                        ]}
                      >
                        {interval === '1' ? 'dia' : 'dias'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.frequencyOption,
                        frequency === 'Semanal' && styles.frequencyOptionSelected,
                      ]}
                      onPress={() => setFrequency('Semanal')}
                    >
                      <Text
                        style={[
                          styles.frequencyOptionText,
                          frequency === 'Semanal' && styles.frequencyOptionTextSelected,
                        ]}
                      >
                        {interval === '1' ? 'semana' : 'semanas'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.frequencyOption,
                        frequency === 'Mensal' && styles.frequencyOptionSelected,
                      ]}
                      onPress={() => setFrequency('Mensal')}
                    >
                      <Text
                        style={[
                          styles.frequencyOptionText,
                          frequency === 'Mensal' && styles.frequencyOptionTextSelected,
                        ]}
                      >
                        {interval === '1' ? 'mês' : 'meses'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.frequencyOption,
                        frequency === 'Anual' && styles.frequencyOptionSelected,
                      ]}
                      onPress={() => setFrequency('Anual')}
                    >
                      <Text
                        style={[
                          styles.frequencyOptionText,
                          frequency === 'Anual' && styles.frequencyOptionTextSelected,
                        ]}
                      >
                        {interval === '1' ? 'ano' : 'anos'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Repetir em (dias da semana) */}
              {frequency === 'Semanal' && (
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Repetir:</Text>
                  <View style={styles.daysRow}>
                    {DAYS_OF_WEEK.map((day, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.dayButton,
                          selectedDays.includes(day.value) && styles.dayButtonSelected,
                        ]}
                        onPress={() => toggleDay(day.value)}
                      >
                        <Text
                          style={[
                            styles.dayButtonText,
                            selectedDays.includes(day.value) && styles.dayButtonTextSelected,
                          ]}
                        >
                          {day.short}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Termina em */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Termina em</Text>
                
                <TouchableOpacity
                  style={styles.radioRow}
                  onPress={() => setEndType('Nunca')}
                >
                  <View style={styles.radio}>
                    {endType === 'Nunca' && <View style={styles.radioSelected} />}
                  </View>
                  <Text style={styles.radioLabel}>Nunca</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.radioRow}
                  onPress={() => setEndType('Em')}
                >
                  <View style={styles.radio}>
                    {endType === 'Em' && <View style={styles.radioSelected} />}
                  </View>
                  <Text style={styles.radioLabel}>Em</Text>
                  <TextInput
                    style={[styles.dateInput, endType !== 'Em' && styles.disabledInput]}
                    value={endDate}
                    onChangeText={setEndDate}
                    placeholder="4 fev. 2026"
                    editable={endType === 'Em'}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.radioRow}
                  onPress={() => setEndType('Após')}
                >
                  <View style={styles.radio}>
                    {endType === 'Após' && <View style={styles.radioSelected} />}
                  </View>
                  <Text style={styles.radioLabel}>Após</Text>
                  <TextInput
                    style={[styles.occurrencesInput, endType !== 'Após' && styles.disabledInput]}
                    value={occurrences}
                    onChangeText={setOccurrences}
                    keyboardType="number-pad"
                    editable={endType === 'Após'}
                  />
                  <Text style={styles.radioLabel}>ocorrências</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            {/* Botões de ação */}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                <Text style={styles.confirmButtonText}>Concluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#2D2D2D',
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: '#404040',
  },
  inputText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#2D2D2D',
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#404040',
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    color: '#AAAAAA',
    marginBottom: 12,
  },
  intervalRow: {
    flexDirection: 'column',
    gap: 12,
  },
  intervalInput: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#404040',
    width: 80,
  },
  pickerButton: {
    flexDirection: 'column',
    gap: 8,
  },
  frequencyOption: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#404040',
  },
  frequencyOptionSelected: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  frequencyOptionText: {
    color: '#AAAAAA',
    fontSize: 16,
  },
  frequencyOptionTextSelected: {
    color: '#FFFFFF',
  },
  daysRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#404040',
  },
  dayButtonSelected: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  dayButtonText: {
    color: '#AAAAAA',
    fontSize: 14,
    fontWeight: '600',
  },
  dayButtonTextSelected: {
    color: '#FFFFFF',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4A90E2',
  },
  radioLabel: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  dateInput: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#404040',
  },
  occurrencesInput: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#404040',
    width: 80,
    textAlign: 'center',
  },
  disabledInput: {
    opacity: 0.5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    paddingTop: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#404040',
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  cancelButtonText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});