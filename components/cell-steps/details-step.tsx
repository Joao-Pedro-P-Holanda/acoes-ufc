import { styles } from '@/app/actions/create.styles';
import { SelectPicker } from '@/components/professor-picker';
import { TextInputField } from '@/components/text-input-field';
import { CellFormData, frequencyOptions } from '@/schemas/cell.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react-native';
import React from 'react';
import { Control, FieldError, FieldErrors, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Item } from 'react-native-picker-select';
import { z } from 'zod';
import { DateTimeInput } from '../date-time-input';

interface DetailsStepProps {
  control: Control<CellFormData>;
  errors: FieldErrors;
}

export function DetailsStep({ control, errors }: DetailsStepProps) {
  const frequencyItems: Item[] = frequencyOptions.map((option) => ({
    label: option,
    value: option,
  }));

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'frequencyItems',
  });

  const [showFormAddDay, setShowFormAddDay] = React.useState(false);
  const frequencyValue = useWatch({ control, name: 'frequency' });

  const handleAddDay = (day: string, startTime: string, endTime: string) => {
    if (day && startTime && endTime) {
      append({ day, startTime, endTime });
      setShowFormAddDay(false);
    }
  };

  const handleCancelAddDay = () => {
    setShowFormAddDay(false);
  }


  return (
    <>
      <Text style={styles.formTitle}>Detalhes</Text>
      <Text style={styles.formSubtitle}>Forneça detalhes adicionais da célula.</Text>


      <View style={styles.formGroup}>
        <Text style={styles.label}>Local de encontro *</Text>
        <TextInputField
          control={control}
          name="location"
          error={errors.location as FieldError}
          placeholder="Ex: Sala 101, Bloco A"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Frequência *</Text>
        <SelectPicker
          control={control}
          name="frequency"
          error={errors.frequency as FieldError}
          items={frequencyItems}
          placeholder="Selecione a frequência"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Dias adicionados {fields.length}</Text>


      </View>

      {fields.length === 0 ? (
        <Text style={styles.emptyMessage}>Nenhum dia adicionado ainda</Text>
      ) : (
        fields.map((field, index) => (

          <View key={index} style={localStyles.frequencyItemContainer}>
            <Text style={localStyles.frequencyItemText}>
              {field.day} - {field.startTime} às {field.endTime}
            </Text>
            <TouchableOpacity
              onPress={() => remove(index)}
              style={localStyles.removeButton}
            >
              <X size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        ))
      )}

      {!showFormAddDay ?
        <View style={styles.formGroup}>

          <TouchableOpacity
            onPress={() => setShowFormAddDay(true)}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>+ Adicionar dia</Text>
          </TouchableOpacity>
        </View>
        :
        (<FormAddDay
          addDay={handleAddDay}
          frequencyType={frequencyValue}
          cancel={handleCancelAddDay}
        />)
      }
    </>
  );
}

// Validação para o formulário de adicionar dia
const addDaySchema = z.object({
  day: z.string().min(1, 'Selecione um dia'),
  startTime: z
    .string()
    .min(1, 'O horário de início é obrigatório')
    .regex(/^\d{2}:\d{2}$/, 'Formato inválido: use HH:MM'),
  endTime: z
    .string()
    .min(1, 'O horário de fim é obrigatório')
    .regex(/^\d{2}:\d{2}$/, 'Formato inválido: use HH:MM'),
});

type AddDayFormData = z.infer<typeof addDaySchema>;

interface FormAddDayProps {
  addDay: (day: string, startTime: string, endTime: string) => void;
  frequencyType: string;
  cancel: () => void;
}

const FormAddDay = ({ addDay, frequencyType, cancel }: FormAddDayProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<AddDayFormData>({
    resolver: zodResolver(addDaySchema),
    mode: 'onBlur',
    defaultValues: {
      day: '',
      startTime: '',
      endTime: '',
    },
  });

  const daysWeek = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
  ];

  const daysMonth = () => {
    const currentDate = new Date();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const daysArray = [];
    for (let day = 1; day <= daysInMonth; day++) {
      daysArray.push(day.toString());
    }
    return daysArray;
  };

  const getDaysOptions = (frequencyType: string) => {
    if (frequencyType === 'Semanal') {
      return daysWeek;
    } else if (frequencyType === 'Mensal') {
      return daysMonth();
    }
  };

  const daysOptions = getDaysOptions(frequencyType);

  const daysItems: Item[] = daysOptions?.map((option) => ({
    label: option,
    value: option,
  })) || [];

  const onSubmit = (data: AddDayFormData) => {
    addDay(data.day, data.startTime, data.endTime);
    reset();
  };

  const handleCancel = () => {
    reset();
    cancel();
  };

  return (
    <>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Dia da Semana *</Text>
        <SelectPicker
          control={control}
          name="day"
          error={errors.day as FieldError}
          items={daysItems}
          placeholder="Selecione o dia"
        />
        {errors.day && (
          <Text style={localStyles.errorText}>{errors.day.message}</Text>
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Horário de Início *</Text>

        <DateTimeInput
          control={control}
          name="startTime"
          mode='time'
          error={errors.startTime}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Horário de Fim *</Text>
        <DateTimeInput
          control={control}
          name="endTime"
          mode="time"
          error={errors.endTime}
        />
      </View>

      <View style={localStyles.formActions}>
        <TouchableOpacity
          onPress={handleCancel}
          style={[localStyles.button, localStyles.cancelButton]}
        >
          <Text style={localStyles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          style={[
            localStyles.button,
            localStyles.confirmButton,
            !isValid && localStyles.disabledButton,
          ]}
          disabled={!isValid}
        >
          <Text style={localStyles.confirmButtonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const localStyles = StyleSheet.create({
  frequencyItemText: {
    fontSize: 16,
    color: '#000000',
  },
  addButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  frequencyItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E5E7EB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#10B981',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
    opacity: 0.6,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  removeButton: {
    padding: 8,
    marginLeft: 8,
  },
});
