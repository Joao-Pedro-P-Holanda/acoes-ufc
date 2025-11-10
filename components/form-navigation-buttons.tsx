import React from 'react';
import { StyleSheet, View } from 'react-native';
import { PrimaryButton } from './primary-button';

interface FormNavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  nextLabel?: string;
  previousLabel?: string;
  disabled?: boolean;
}

export function FormNavigationButtons({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Publicar',
  nextLabel = 'Próximo',
  previousLabel = 'Voltar',
  disabled = false,
}: FormNavigationButtonsProps) {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <View style={styles.buttonRow}>
      {!isFirstStep && (
        <PrimaryButton
          onPress={onPrevious}
          variant="secondary"
          style={styles.buttonHalf}
          disabled={isSubmitting}
        >
          {previousLabel}
        </PrimaryButton>
      )}

      {isLastStep ? (
        <PrimaryButton
          onPress={onSubmit}
          disabled={isSubmitting || disabled}
          loading={isSubmitting}
          style={isFirstStep ? styles.buttonFull : styles.buttonHalf}
        >
          {isSubmitting ? 'Publicando...' : submitLabel}
        </PrimaryButton>
      ) : (
        <PrimaryButton
          onPress={onNext}
          style={isFirstStep ? styles.buttonFull : styles.buttonHalf}
          disabled={disabled}
        >
          {nextLabel}
        </PrimaryButton>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  buttonFull: {
    flex: 1,
  },
  buttonHalf: {
    flex: 1,
  },
});
