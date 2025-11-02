import { Calendar, Clock } from 'lucide-react-native';
import React, { useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// Importação condicional do DateTimePicker apenas para mobile
let DateTimePicker: any = null;
if (Platform.OS === 'ios' || Platform.OS === 'android') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  DateTimePicker = require('@react-native-community/datetimepicker').default;
}

interface DateTimeInputProps {
  control: Control<any>;
  name: string;
  mode: 'date' | 'time';
  placeholder?: string;
  minimumDate?: Date;
}

const isNativePlatform = Platform.OS === 'ios' || Platform.OS === 'android';

export function DateTimeInput({
  control,
  name,
  mode,
  placeholder,
  minimumDate,
}: DateTimeInputProps) {
  const [showPicker, setShowPicker] = useState(false);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('pt-BR');
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const applyDateMask = (text: string): string => {
    const numbers = text.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
  };

  const applyTimeMask = (text: string): string => {
    const numbers = text.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    return `${numbers.slice(0, 2)}:${numbers.slice(2, 4)}`;
  };

  const parseStringToDate = (value: string): Date => {
    if (mode === 'date') {
      const parts = value.split('/');
      if (parts.length === 3) {
        return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      }
    } else {
      return new Date(`2000-01-01T${value}`);
    }
    return new Date();
  };

  const Icon = mode === 'date' ? Calendar : Clock;
  const placeholderText = placeholder || (mode === 'date' ? 'DD/MM/AAAA' : 'HH:MM');
  const maxLength = mode === 'date' ? 10 : 5;

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <>
            {isNativePlatform ? (
              <>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowPicker(true)}
                >
                  <Icon size={20} color="#6B7280" />
                  <Text style={styles.dateButtonText}>
                    {value || placeholderText}
                  </Text>
                </TouchableOpacity>
                {showPicker && DateTimePicker && (
                  <DateTimePicker
                    value={value ? parseStringToDate(value) : new Date()}
                    mode={mode}
                    is24Hour={true}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    minimumDate={minimumDate}
                    onChange={(event: any, selectedValue: any) => {
                      if (Platform.OS === 'android') {
                        setShowPicker(false);
                      }
                      if (selectedValue && event.type === 'set') {
                        const formatted = mode === 'date' 
                          ? formatDate(selectedValue)
                          : formatTime(selectedValue);
                        onChange(formatted);
                      }
                      if (event.type === 'dismissed') {
                        setShowPicker(false);
                      }
                    }}
                  />
                )}
              </>
            ) : (
              <View style={styles.dateButton}>
                <Icon size={20} color="#6B7280" />
                <TextInput
                  style={styles.dateInput}
                  value={value || ''}
                  onChangeText={(text) => {
                    const masked = mode === 'date' 
                      ? applyDateMask(text)
                      : applyTimeMask(text);
                    onChange(masked);
                  }}
                  placeholder={placeholderText}
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  maxLength={maxLength}
                />
              </View>
            )}
          </>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});
