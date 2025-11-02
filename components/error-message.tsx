import React from 'react';
import { FieldError } from 'react-hook-form';
import { StyleSheet, Text } from 'react-native';

interface ErrorMessageProps {
  error?: FieldError;
}

export function ErrorMessage({ error }: ErrorMessageProps) {
  if (!error) return null;

  return <Text style={styles.errorText}>{error.message}</Text>;
}

const styles = StyleSheet.create({
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
