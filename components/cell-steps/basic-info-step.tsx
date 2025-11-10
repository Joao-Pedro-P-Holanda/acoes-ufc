import { styles } from '@/app/actions/create.styles';
import { SelectPicker } from '@/components/professor-picker';
import { TextInputField } from '@/components/text-input-field';
import { CellFormData } from '@/schemas/cell.schema';
import React from 'react';
import { Control, FieldError, FieldErrors } from 'react-hook-form';
import { Text, View } from 'react-native';
import { Item } from 'react-native-picker-select';

interface BasicInfoStepProps {
  control: Control<CellFormData>;
  errors: FieldErrors;
  professorsList: Item[];
}

export function BasicInfoStep({
  control,
  errors,
  professorsList,
}: BasicInfoStepProps) {
  return (
    <>
      <Text style={styles.formTitle}>Informações Básicas</Text>
      <Text style={styles.formSubtitle}>Preencha as informações básicas da célula.</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Nome *</Text>
        <TextInputField
          control={control}
          name="name"
          error={errors.name as FieldError}
          placeholder="Nome da célula"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Descrição *</Text>
        <TextInputField
          control={control}
          name="description"
          error={errors.description as FieldError}
          placeholder="Descreva detalhadamente a célula..."
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Selecione o professor responsável *</Text>
        <SelectPicker
          control={control}
          name="professorId"
          error={errors.professorId as FieldError}
          items={professorsList}
          placeholder="Selecione um professor"
        />
      </View>
    </>
  );
}
