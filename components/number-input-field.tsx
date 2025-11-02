import React from 'react';
import { Control, Controller, FieldError, FieldValues, Path } from 'react-hook-form';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { ErrorMessage } from './error-message';

interface NumberInputFieldProps<T extends FieldValues> extends Omit<TextInputProps, 'value' | 'onChangeText' | 'onBlur' | 'keyboardType'> {
  control: Control<T>;
  name: Path<T>;
  error?: FieldError;
  isInteger?: boolean;
}

export function NumberInputField<T extends FieldValues>({
  control,
  name,
  error,
  isInteger = false,
  ...textInputProps
}: NumberInputFieldProps<T>) {
  return (
    <View>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            value={value?.toString() || ''}
            onChangeText={(text) => {
              const parsed = isInteger ? parseInt(text) : parseFloat(text);
              onChange(parsed || 0);
            }}
            onBlur={onBlur}
            keyboardType={isInteger ? 'number-pad' : 'numeric'}
            {...textInputProps}
          />
        )}
      />
      <ErrorMessage error={error} />
    </View>
  );
}

const styles = StyleSheet.create({
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
});
