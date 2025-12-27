import { styles } from '@/app/actions/create.styles';
import { DateTimeInput } from '@/components/date-time-input';
import { CommunityActionFormData } from '@/schemas/community-action.schema';
import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { Text, View } from 'react-native';

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
    </View>
  );
}
