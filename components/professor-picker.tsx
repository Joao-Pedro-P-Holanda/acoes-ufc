import { customPickerStyles } from '@/styles/actions-create.styles';
import React, { Dispatch, SetStateAction } from 'react';
import { Control, Controller, FieldError, FieldValues, Path } from 'react-hook-form';
import { Platform, View } from 'react-native';
import RNPickerSelect, { Item } from 'react-native-picker-select';
import { ErrorMessage } from './error-message';

// ==================== Versão com React Hook Form ====================
interface SelectPickerProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  error?: FieldError;
  items: Item[];
  placeholder?: string;
}

export function SelectPicker<T extends FieldValues>({
  control,
  name,
  error,
  items,
  placeholder = 'Selecione uma opção',
}: SelectPickerProps<T>) {
  return (
    <View>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <RNPickerSelect
            onValueChange={(selectedValue) => {
              onChange(selectedValue);
            }}
            value={Platform.OS === 'ios' ? (value ?? '') : (value ?? null)}
            items={items}
            style={customPickerStyles}
            placeholder={{ label: placeholder, value: Platform.OS === 'ios' ? '' : null }}
            useNativeAndroidPickerStyle={false}
          />
        )}
      />
      <ErrorMessage error={error} />
    </View>
  );
}

// ==================== Versão com Estado Local ====================
interface SimpleSelectPickerProps {
  value: string;
  onValueChange: Dispatch<SetStateAction<string>>;
  items: Item[];
  placeholder?: string;
}

export function SimpleSelectPicker({
  value,
  onValueChange,
  items,
  placeholder = 'Selecione uma opção',
}: SimpleSelectPickerProps) {
  return (
    <View>
      <RNPickerSelect
        onValueChange={(selectedValue) => {
          onValueChange(selectedValue);
        }}
        value={Platform.OS === 'ios' ? (value ?? '') : (value ?? null)}
        items={items}
        style={customPickerStyles}
        placeholder={{ label: placeholder, value: Platform.OS === 'ios' ? '' : null }}
        useNativeAndroidPickerStyle={false}
      />
    </View>
  );
}