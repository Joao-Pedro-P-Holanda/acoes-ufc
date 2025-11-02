import { DateTimeInput } from '@/components/date-time-input';
import { useActions } from '@/hooks/use-actions';
import { CommunityAction } from '@/interfaces/community-action';
import { Picker } from '@react-native-picker/picker';
import { Button } from '@react-navigation/elements';
import CheckBox from 'expo-checkbox';
import { useRouter } from "expo-router";
import { X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { v4 as uuidv4 } from 'uuid';

export default function CreateActionScreen() {
  const { control, handleSubmit, watch, setValue } = useForm<CommunityAction>({
  });

  const router = useRouter();

  const { addAction } = useActions();
  const [currentTag, setCurrentTag] = useState('');

  const isFree = watch('isFree');
  const tags = watch('tags') || [];
  const startDate = watch('startDate');

  const onSubmit = async (action: CommunityAction) => {
    action.id = uuidv4();
    await addAction(action);
    router.push(`/actions/${action.id}` as any);
  };

  const handleAddTag = () => {
    if (currentTag.trim()) {
      const currentTags = tags;
      if (!currentTags.includes(currentTag.trim())) {
        setValue('tags', [...currentTags, currentTag.trim()]);
      }
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue('tags', tags.filter(tag => tag !== tagToRemove));
  };

  const parseDate = (dateString: string): Date | undefined => {
    if (!dateString) return undefined;
    const parts = dateString.split('/');
    if (parts.length === 3) {
      return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    }
    return undefined;
  };

  const minimumEndDate = parseDate(startDate);



  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Nome da Ação *</Text>
            <Controller
              control={control}
              name="name"
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Ex: Limpeza do Parque Central"
                  placeholderTextColor="#9CA3AF"
                />
              )}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Descrição *</Text>
            <Controller
              control={control}
              name="description"
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Descreva detalhadamente a ação comunitária..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              )}
            />
          </View>

          <View style={styles.row}>
            <DateTimeInput
              control={control}
              name="startDate"
              label="Data de Início"
              mode="date"
              required
            />
            <DateTimeInput
              control={control}
              name="endDate"
              label="Data de Fim"
              mode="date"
              required
              minimumDate={minimumEndDate}
            />
          </View>

          <View style={styles.row}>
            <DateTimeInput
              control={control}
              name="startTime"
              label="Horário de Início"
              mode="time"
              required
            />
            <DateTimeInput
              control={control}
              name="endTime"
              label="Horário de Fim"
              mode="time"
              required
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Frequência (opcional)</Text>
            <View style={styles.pickerContainer}>
              <Controller
                control={control}
                name="frequency"
                render={({ field: { onChange, value } }) => (
                  <Picker
                    selectedValue={value}
                    onValueChange={onChange}
                    style={styles.picker}
                  >
                    <Picker.Item label="Selecione a frequência" value="" />
                    <Picker.Item label="Única" value="Única" />
                    <Picker.Item label="Diária" value="Diária" />
                    <Picker.Item label="Semanal" value="Semanal" />
                    <Picker.Item label="Quinzenal" value="Quinzenal" />
                    <Picker.Item label="Mensal" value="Mensal" />
                  </Picker>
                )}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Local *</Text>
            <Controller
              control={control}
              name="location"
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Ex: Parque Central, Rua das Flores, 123"
                  placeholderTextColor="#9CA3AF"
                />
              )}
            />
          </View>

          <Text style={styles.hint}>
            Adicione coordenadas para exibir a ação no mapa
          </Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Informações de Contato *</Text>
            <Controller
              control={control}
              name="contact"
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Ex: email@exemplo.com, (11) 98765-4321"
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              )}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Número Máximo de Participantes *</Text>
            <Controller
              control={control}
              name="maxParticipants"
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  value={value?.toString() || ''}
                  onChangeText={(text) => onChange(parseInt(text) || 0)}
                  onBlur={onBlur}
                  placeholder="Ex: 50"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="number-pad"
                />
              )}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Inscrição</Text>
            <Controller
              control={control}
              name="isFree"
              render={({ field: { onChange, value } }) => (
                <View style={styles.checkboxRow}>
                  <CheckBox
                    value={value}
                    onValueChange={(checked) => {
                      onChange(checked);
                      if (checked) setValue('price', 0);
                    }}
                    color={value ? '#10B981' : '#9CA3AF'}
                  />
                  <Text style={styles.checkboxLabel}>Evento gratuito</Text>
                </View>
              )}
            />
            {!isFree && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Preço da Inscrição (R$)</Text>
                <Controller
                  control={control}
                  name="price"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.input}
                      value={value?.toString() || ''}
                      onChangeText={(text) => onChange(parseFloat(text) || 0)}
                      onBlur={onBlur}
                      placeholder="Ex: 25.00"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numeric"
                    />
                  )}
                />
              </View>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Link Original (Opcional)</Text>
            <Controller
              control={control}
              name="originalLink"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="https://exemplo.com/evento"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="url"
                  autoCapitalize="none"
                />
              )}
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

          <Button
            style={styles.submitButton}
            onPress={handleSubmit(onSubmit)}
          >
            Publicar Ação
          </Button>
        </View>
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
    outlineStyle: 'none' as any,
  },
  dateButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    outlineStyle: 'none' as any,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#000000',
  },
  dateInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    padding: 0,
    margin: 0,
    outlineStyle: 'none' as any,
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
