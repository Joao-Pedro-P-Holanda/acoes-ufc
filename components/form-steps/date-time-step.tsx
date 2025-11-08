import { styles } from '@/app/actions/create.styles';
import { DateTimeInput } from '@/components/date-time-input';
import { CommunityActionFormData } from '@/schemas/community-action.schema';
import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { Text, View } from 'react-native';
import { FrequencySelector } from '../frequency-selector';

interface DateTimeStepProps {
  control: Control<CommunityActionFormData>;
  errors: FieldErrors<CommunityActionFormData>;
  minimumEndDate?: Date;
  onStartDateBlur: () => void;
  onEndDateBlur: () => void;
  onStartTimeBlur: () => void;
  onEndTimeBlur: () => void;
}

export function DateTimeStep({
  control,
  errors,
  minimumEndDate,
  onStartDateBlur,
  onEndDateBlur,
  onStartTimeBlur,
  onEndTimeBlur,
}: DateTimeStepProps) {
  return (
    <View>
      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <Text style={styles.label}>Data de Início *</Text>
          <DateTimeInput
            control={control}
            name="startDate"
            mode="date"
            error={errors.startDate}
            onBlurCustom={onStartDateBlur}
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
            onBlurCustom={onEndDateBlur}
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
            onBlurCustom={onStartTimeBlur}
          />
        </View>
        <View style={styles.halfWidth}>
          <Text style={styles.label}>Horário de Fim *</Text>
          <DateTimeInput
            control={control}
            name="endTime"
            mode="time"
            error={errors.endTime}
            onBlurCustom={onEndTimeBlur}
          />
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Frequência (opcional)</Text>
        <Controller
          control={control}
          name="frequency"
          render={({ field: { onChange, value } }) => (
            <Controller
              control={control}
              name="startDate"
              render={({ field: { value: startDateValue } }) => (
                <FrequencySelector
                  value={value}
                  onChange={onChange}
                  startDate={startDateValue}
                  labelStyle={styles.label}
                  inputStyle={styles.input}
                />
              )}
            />
          )}
        />
      </View>
    </View>
  );
}