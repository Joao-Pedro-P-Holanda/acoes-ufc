import { FormStepper } from '@/components/form-stepper';
import { BasicInfoStep } from '@/components/form-steps/basic-info-step';
import { DateTimeStep } from '@/components/form-steps/date-time-step';
import { DetailsStep } from '@/components/form-steps/details-step';
import { PrimaryButton } from '@/components/primary-button';
import { useActions } from '@/hooks/use-actions';
import { CommunityAction } from '@/interfaces/community-action';
import { CommunityActionFormData, communityActionSchema } from '@/schemas/community-action.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from "expo-router";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import { styles } from './create.styles';

export default function CreateActionScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  
  const { 
    control, 
    handleSubmit, 
    watch, 
    setValue,
    trigger,
    formState: { errors, isSubmitting }
  } = useForm<CommunityActionFormData>({
    resolver: zodResolver(communityActionSchema) as any,
    defaultValues: {
      isFree: false,
      tags: [],
      frequency: undefined,
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      location: '',
      contact: '',
      maxParticipants: 0,
      originalLink: '',
    },
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const router = useRouter();

  const { addAction } = useActions();
  const [currentTag, setCurrentTag] = useState('');

  const isFree = watch('isFree');
  const tags = watch('tags') || [];
  const startDate = watch('startDate');

  const steps = [
    { title: 'Básico', description: 'Nome e descrição' },
    { title: 'Data/Hora', description: 'Quando acontece' },
    { title: 'Detalhes', description: 'Local e contato' },
  ];

  // Handlers para validar campos cruzados ao perder foco
  const handleStartDateBlur = async () => {
    await trigger(['startDate', 'endDate']); // Valida ambas as datas
  };

  const handleEndDateBlur = async () => {
    await trigger(['startDate', 'endDate']); // Valida ambas as datas
  };

  const handleStartTimeBlur = async () => {
    await trigger(['startTime', 'endTime']); // Valida ambos os horários
  };

  const handleEndTimeBlur = async () => {
    await trigger(['startTime', 'endTime']); // Valida ambos os horários
  };

  const onSubmit = async (data: CommunityActionFormData) => {
    try {
      const action: CommunityAction = {
        ...data,
        id: uuidv4(),
        isFull: false,
      };
      console.log('Creating action:', action);
      await addAction(action);
      console.log('Action created, navigating...');
      
      // Navega de volta e força reload
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/');
      }
    } catch (error) {
      console.error('Error creating action:', error);
      Alert.alert(
        'Erro',
        'Não foi possível criar a ação. Tente novamente.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleAddTag = () => {
    if (currentTag.trim()) {
      const currentTags = tags;
      if (!currentTags.includes(currentTag.trim())) {
        setValue('tags', [...currentTags, currentTag.trim()]);
      }
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue('tags', tags.filter(tag => tag !== tagToRemove));
  };

  const parseDate = (dateString: string): Date | undefined => {
    if (!dateString) return undefined;
    const parts = dateString.split('/');
    if (parts.length === 3) {
      return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    }
    return undefined;
  };

  const minimumEndDate = parseDate(startDate);

  // Validação do step atual antes de avançar
  const validateCurrentStep = async (): Promise<boolean> => {
    let fieldsToValidate: (keyof CommunityActionFormData)[] = [];

    switch (currentStep) {
      case 0: // Informações Básicas
        fieldsToValidate = ['name', 'description', 'tags'];
        break;
      case 1: // Data e Horário
        fieldsToValidate = ['startDate', 'endDate', 'startTime', 'endTime'];
        break;
      case 2: // Detalhes
        fieldsToValidate = ['location', 'contact', 'maxParticipants'];
        if (!isFree) {
          fieldsToValidate.push('price');
        }
        break;
    }

    const result = await trigger(fieldsToValidate);
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinalSubmit = async (data: CommunityActionFormData) => {
    const isValid = await validateCurrentStep();
    if (!isValid) return;
    
    await onSubmit(data);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View>
          <FormStepper steps={steps} currentStep={currentStep} />

          {currentStep === 0 && (
            <BasicInfoStep
              control={control}
              errors={errors}
              tags={tags}
              currentTag={currentTag}
              onCurrentTagChange={setCurrentTag}
              onAddTag={handleAddTag}
              onRemoveTag={handleRemoveTag}
            />
          )}

          {currentStep === 1 && (
            <DateTimeStep
              control={control}
              errors={errors}
              minimumEndDate={minimumEndDate}
              onStartDateBlur={handleStartDateBlur}
              onEndDateBlur={handleEndDateBlur}
              onStartTimeBlur={handleStartTimeBlur}
              onEndTimeBlur={handleEndTimeBlur}
            />
          )}

          {currentStep === 2 && (
            <DetailsStep
              control={control}
              errors={errors}
              isFree={isFree}
              onSetValue={setValue}
            />
          )}

          <View style={styles.buttonRow}>
            {currentStep > 0 && (
              <PrimaryButton
                onPress={handlePrevious}
                variant="secondary"
                style={styles.buttonHalf}
              >
                Voltar
              </PrimaryButton>
            )}

            {currentStep < steps.length - 1 ? (
              <PrimaryButton
                onPress={handleNext}
                style={currentStep === 0 ? styles.buttonFull : styles.buttonHalf}
              >
                Próximo
              </PrimaryButton>
            ) : (
              <PrimaryButton
                onPress={handleSubmit(handleFinalSubmit)}
                disabled={isSubmitting}
                loading={isSubmitting}
                style={styles.buttonHalf}
              >
                {isSubmitting ? 'Publicando...' : 'Publicar Ação'}
              </PrimaryButton>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
