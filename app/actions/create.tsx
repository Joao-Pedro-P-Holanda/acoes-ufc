import { DateTimeInput } from '@/components/date-time-input';
import { NumberInputField } from '@/components/number-input-field';
import { PrimaryButton } from '@/components/primary-button';
import { TextInputField } from '@/components/text-input-field';
import { useActions } from '@/hooks/use-actions';
import { CommunityAction } from '@/interfaces/community-action';
import { CommunityActionFormData, communityActionSchema } from '@/schemas/community-action.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Picker } from '@react-native-picker/picker';
import CheckBox from 'expo-checkbox';
import { useRouter } from "expo-router";
import { X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import { styles } from './create.styles';

export default function CreateActionScreen() {
  const { 
    control, 
    handleSubmit, 
    watch, 
    setValue,
    trigger,
    formState: { errors, isSubmitting }
  } = useForm<CommunityActionFormData>({
    resolver: zodResolver(communityActionSchema) as any,
    defaultValues: {
      isFree: false,
      tags: [],
      frequency: undefined,
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      location: '',
      contact: '',
      maxParticipants: 0,
      originalLink: '',
    },
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const router = useRouter();

  const { addAction } = useActions();
  const [currentTag, setCurrentTag] = useState('');

  const isFree = watch('isFree');
  const tags = watch('tags') || [];
  const startDate = watch('startDate');

  // Handlers para validar campos cruzados ao perder foco
  const handleStartDateBlur = async () => {
    await trigger(['startDate', 'endDate']); // Valida ambas as datas
  };

  const handleEndDateBlur = async () => {
    await trigger(['startDate', 'endDate']); // Valida ambas as datas
  };

  const handleStartTimeBlur = async () => {
    await trigger(['startTime', 'endTime']); // Valida ambos os horários
  };

  const handleEndTimeBlur = async () => {
    await trigger(['startTime', 'endTime']); // Valida ambos os horários
  };

  const onSubmit = async (data: CommunityActionFormData) => {
    try {
      const action: CommunityAction = {
        ...data,
        id: uuidv4(),
        isFull: false,
      };
      console.log('Creating action:', action);
      await addAction(action);
      console.log('Action created, navigating...');
      

      router.navigate({pathname:`/actions/${action.id}` })
    } catch (error) {
      console.error('Error creating action:', error);
      Alert.alert(
        'Erro',
        'Não foi possível criar a ação. Tente novamente.',
        [{ text: 'OK' }]
      );
    }
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
            <TextInputField
              control={control}
              name="name"
              error={errors.name}
              placeholder="Ex: Limpeza do Parque Central"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Descrição *</Text>
            <TextInputField
              control={control}
              name="description"
              error={errors.description}
              placeholder="Descreva detalhadamente a ação comunitária..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Data de Início *</Text>
              <DateTimeInput
                control={control}
                name="startDate"
                mode="date"
                error={errors.startDate}
                onBlurCustom={handleStartDateBlur}
              />
            </View>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Data de Fim *</Text>
              <DateTimeInput
                control={control}
                name="endDate"
                mode="date"
                minimumDate={minimumEndDate}
                error={errors.endDate}
                onBlurCustom={handleEndDateBlur}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Horário de Início *</Text>
              <DateTimeInput
                control={control}
                name="startTime"
                mode="time"
                error={errors.startTime}
                onBlurCustom={handleStartTimeBlur}
              />
            </View>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Horário de Fim *</Text>
              <DateTimeInput
                control={control}
                name="endTime"
                mode="time"
                error={errors.endTime}
                onBlurCustom={handleEndTimeBlur}
              />
            </View>
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
            <TextInputField
              control={control}
              name="location"
              error={errors.location}
              placeholder="Ex: Parque Central, Rua das Flores, 123"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <Text style={styles.hint}>
            Adicione coordenadas para exibir a ação no mapa
          </Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Informações de Contato *</Text>
            <TextInputField
              control={control}
              name="contact"
              error={errors.contact}
              placeholder="Ex: email@exemplo.com, (11) 98765-4321"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Número Máximo de Participantes *</Text>
            <NumberInputField
              control={control}
              name="maxParticipants"
              error={errors.maxParticipants}
              placeholder="Ex: 50"
              placeholderTextColor="#9CA3AF"
              isInteger
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
                <NumberInputField
                  control={control}
                  name="price"
                  error={errors.price}
                  placeholder="Ex: 25.00"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Link Original (Opcional)</Text>
            <TextInputField
              control={control}
              name="originalLink"
              error={errors.originalLink}
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
                autoComplete="off"
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
            {errors.tags && (
              <Text style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>
                {errors.tags.message?.toString()}
              </Text>
            )}
          </View>

          <PrimaryButton
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            {isSubmitting ? 'Publicando...' : 'Publicar Ação'}
          </PrimaryButton>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
