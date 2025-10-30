import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { X } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';
import CheckBox from 'expo-checkbox';
import { useActions } from '@/hooks/use-actions';
import { v4 as uuidv4 } from 'uuid';
import { AppColors } from '@/constants/theme';

export default function CreateActionScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [frequency, setFrequency] = useState('');
  const [contact, setContact] = useState('');
  const [location, setLocation] = useState('');
  const [currentTag, setCurrentTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isFull, setIsFull] = useState(false);
  const [maxParticipants, setMaxParticipants] = useState('');
  const [price, setPrice] = useState('');
  const [isFree, setIsFree] = useState(true);
  const [originalLink, setOriginalLink] = useState('');

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const { addAction } = useActions()

  const handleSubmit = () => {
    if (!name || !description || !startDate || !endDate || !startTime || !endTime || !contact || !location || tags.length === 0 || !maxParticipants) {
      Alert.alert(
        'Campos obrigatórios',
        'Por favor, preencha todos os campos obrigatórios e adicione pelo menos uma tag.'
      );
      return;
    }

    addAction({
      id: uuidv4(),
      name,
      description,
      startDate,
      endDate,
      startTime,
      endTime,
      frequency: frequency || undefined,
      contact,
      location,
      tags,
      isFull,
      maxParticipants: parseInt(maxParticipants),
      price: isFree ? 0 : (price ? parseFloat(price) : undefined),
      originalLink: originalLink || undefined,
    });

    // Reset form
    setName('');
    setDescription('');
    setStartDate('');
    setEndDate('');
    setStartTime('');
    setEndTime('');
    setFrequency('');
    setContact('');
    setLocation('');
    setTags([]);
    setIsFull(false);
    setMaxParticipants('');
    setPrice('');
    setIsFree(true);
    setOriginalLink('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Nome da Ação *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Ex: Limpeza do Parque Central"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Descrição *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Descreva detalhadamente a ação comunitária..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Data de Início *</Text>
            <TextInput
              style={styles.input}
              value={startDate}
              onChangeText={setStartDate}
              placeholder="DD/MM/AAAA"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Data de Fim *</Text>
            <TextInput
              style={styles.input}
              value={endDate}
              onChangeText={setEndDate}
              placeholder="DD/MM/AAAA"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Horário de Início *</Text>
            <TextInput
              style={styles.input}
              value={startTime}
              onChangeText={setStartTime}
              placeholder="HH:MM"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Horário de Fim *</Text>
            <TextInput
              style={styles.input}
              value={endTime}
              onChangeText={setEndTime}
              placeholder="HH:MM"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Frequência (opcional)</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={frequency}
              onValueChange={setFrequency}
              style={styles.picker}
            >
              <Picker.Item label="Selecione a frequência" value="" />
              <Picker.Item label="Única" value="Única" />
              <Picker.Item label="Diária" value="Diária" />
              <Picker.Item label="Semanal" value="Semanal" />
              <Picker.Item label="Quinzenal" value="Quinzenal" />
              <Picker.Item label="Mensal" value="Mensal" />
            </Picker>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Local *</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="Ex: Parque Central, Rua das Flores, 123"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <Text style={styles.hint}>
          Adicione coordenadas para exibir a ação no mapa
        </Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Informações de Contato *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={contact}
            onChangeText={setContact}
            placeholder="Ex: email@exemplo.com, (11) 98765-4321"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Número Máximo de Participantes *</Text>
          <TextInput
            style={styles.input}
            value={maxParticipants}
            onChangeText={setMaxParticipants}
            placeholder="Ex: 50"
            placeholderTextColor="#9CA3AF"
            keyboardType="number-pad"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Inscrição</Text>
          <View style={styles.checkboxRow}>
            <CheckBox
              value={isFree}
              onValueChange={(checked) => {
                setIsFree(checked);
                if (checked) setPrice('');
              }}
              color={isFree ? AppColors.primary : AppColors.gray}
            />
            <Text style={styles.checkboxLabel}>Evento gratuito</Text>
          </View>
          {!isFree && (
            <View style={styles.formGroup}>
              <Text style={styles.label}>Preço da Inscrição (R$)</Text>
              <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                placeholder="Ex: 25.00"
                placeholderTextColor="#9CA3AF"
                keyboardType="decimal-pad"
              />
            </View>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Link Original (Opcional)</Text>
          <TextInput
            style={styles.input}
            value={originalLink}
            onChangeText={setOriginalLink}
            placeholder="https://exemplo.com/evento"
            placeholderTextColor="#9CA3AF"
            keyboardType="url"
            autoCapitalize="none"
          />
          <Text style={styles.hint}>
            Link para mais informações sobre a ação (site, formulário, etc.)
          </Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Tags *</Text>
          <View style={styles.tagInputRow}>
            <TextInput
              style={[styles.input, styles.tagInput]}
              value={currentTag}
              onChangeText={setCurrentTag}
              placeholder="Digite uma tag"
              placeholderTextColor="#9CA3AF"
              onSubmitEditing={handleAddTag}
            />
            <TouchableOpacity
              onPress={handleAddTag}
              style={styles.addTagButton}
            >
              <Text style={styles.addTagButtonText}>Adicionar</Text>
            </TouchableOpacity>
          </View>
          {tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                  <TouchableOpacity onPress={() => handleRemoveTag(tag)}>
                    <X color="#059669" size={14} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          style={styles.submitButton}
        >
          <Text style={styles.submitButtonText}>Publicar Ação</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#000000',
  },
  textArea: {
    minHeight: 80,
    paddingTop: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  halfWidth: {
    flex: 1,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  hint: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: -8,
    marginBottom: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#000000',
    marginLeft: 8,
  },
  tagInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tagInput: {
    flex: 1,
  },
  addTagButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  addTagButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
