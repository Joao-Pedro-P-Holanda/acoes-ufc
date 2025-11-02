import { styles } from '@/app/actions/create.styles';
import { NumberInputField } from '@/components/number-input-field';
import { TextInputField } from '@/components/text-input-field';
import { CommunityActionFormData } from '@/schemas/community-action.schema';
import CheckBox from 'expo-checkbox';
import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { Text, View } from 'react-native';

interface DetailsStepProps {
  control: Control<CommunityActionFormData>;
  errors: FieldErrors<CommunityActionFormData>;
  isFree: boolean;
  onSetValue: (name: keyof CommunityActionFormData, value: any) => void;
}

export function DetailsStep({
  control,
  errors,
  isFree,
  onSetValue,
}: DetailsStepProps) {
  return (
    <View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Local *</Text>
        <TextInputField
          control={control}
          name="location"
          error={errors.location}
          placeholder="Ex: Parque Central, Rua das Flores, 123"
          placeholderTextColor="#9CA3AF"
        />
        <Text style={styles.hint}>
          Adicione coordenadas para exibir a ação no mapa
        </Text>
      </View>

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
                  if (checked) onSetValue('price', 0);
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

    </View>
  );
}
