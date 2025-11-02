import React from 'react';
import { Control, Controller, FieldError, FieldValues, Path } from 'react-hook-form';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { ErrorMessage } from './error-message';

interface TextInputFieldProps<T extends FieldValues> extends Omit<TextInputProps, 'value' | 'onChangeText' | 'onBlur'> {
  control: Control<T>;
  name: Path<T>;
  error?: FieldError;
  multiline?: boolean;
  numberOfLines?: number;
}

export function TextInputField<T extends FieldValues>({
  control,
  name,
  error,
  multiline = false,
  numberOfLines,
  ...textInputProps
}: TextInputFieldProps<T>) {
  return (
    <View>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[
              styles.input,
              multiline && styles.textArea,
            ]}
            value={value?.toString() || ''}
            onChangeText={onChange}
            onBlur={onBlur}
            multiline={multiline}
            numberOfLines={numberOfLines}
            textAlignVertical={multiline ? 'top' : 'center'}
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
  textArea: {
    minHeight: 80,
    paddingTop: 10,
  },
});
