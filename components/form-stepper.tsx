import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Step {
  title: string;
  description?: string;
}

interface FormStepperProps {
  steps: Step[];
  currentStep: number;
}

export function FormStepper({ steps, currentStep }: FormStepperProps) {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <View key={index} style={styles.stepContainer}>
            <View style={[styles.stepIndicatorRow, index === 0 ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' }]}>
              {index > 0 && (<View
                style={[
                  styles.stepHalfLine,
                  isCompleted && styles.stepLineCompleted,
                ]}
              />)}

              <View
                style={[
                  styles.stepCircle,
                  isActive && styles.stepCircleActive,
                  isCompleted && styles.stepCircleCompleted,
                ]}
              >
                <Text
                  style={[
                    styles.stepNumber,
                    (isActive || isCompleted) && styles.stepNumberActive,
                  ]}
                >
                  {index + 1}
                </Text>
              </View>

              {index < steps.length - 1 && (
                <View
                  style={[
                    styles.stepHalfLine,
                    isCompleted && styles.stepLineCompleted,
                  ]}
                />
              )}
            </View>

            <View style={styles.stepContent}>
              <Text
                style={[
                  styles.stepTitle,
                  isActive && styles.stepTitleActive,
                ]}
              >
                {step.title}
              </Text>
              {step.description && (
                <Text style={styles.stepDescription}>
                  {step.description}
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  stepContainer: {
    flex: 1,
    alignItems: 'center',
  },
  stepIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  stepCircleActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  stepCircleCompleted: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  stepNumberActive: {
    color: '#FFFFFF',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#D1D5DB',
    marginLeft: -2,
  },
  stepHalfLine: {
    flex: 0.5,
    height: 2,
    backgroundColor: '#D1D5DB',
  },
  stepLineCompleted: {
    backgroundColor: '#059669',
  },
  stepContent: {
    marginTop: 8,
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
  },
  stepTitleActive: {
    color: '#10B981',
  },
  stepDescription: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
    textAlign: 'center',
  },
});
