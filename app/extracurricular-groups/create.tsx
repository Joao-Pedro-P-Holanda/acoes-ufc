import {
  BasicInfoStep,
  DetailsStep,
  OrganizersStep
} from "@/components/cell-steps";
import { FormNavigationButtons } from "@/components/form-navigation-buttons";
import { FormStepper } from "@/components/form-stepper";
import { CellFields, CellFormData, cellSchema } from "@/schemas/cell.schema";
import { getProfessors, registerCell } from "@/services/cell";
import { styles } from "@/styles/extracurricular-groups-create.styles";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

interface StepFieldMap {
  [key: number]: CellFields;
}

const steps = [
  { title: 'Informações básicas', description: 'Dados básicos da célula' },
  { title: 'Organizadores', description: 'Quem são os organizadores da célula' },
  { title: 'Detalhes', description: 'Dias, Local e contato' },
];

const stepFields: StepFieldMap = {
  2: ['name', 'description', 'professorId'] as CellFields,
  3: ['organizers'] as CellFields,
  4: ['location', 'frequency', 'frequencyItems'] as CellFields,
}

export default function CreateCellScreen() {
  const currentUserMockData = {
    id: 'user-123',
    name: 'João Silva',
    studentId: '20230001',
  }

  const [professorsList, setProfessorsList] = useState<any[]>([]);

  useEffect(() => {
    const fetchProfessors = async () => {
      const professors = await getProfessors();
      setProfessorsList(professors);
    };
    fetchProfessors();
  }, []);

  const [currentStep, setCurrentStep] = useState(0);

  const { control, handleSubmit, formState: { isSubmitting, errors }, trigger } = useForm({
    resolver: zodResolver(cellSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    shouldFocusError: true,
    defaultValues: {
      name: '',
      description: '',
      professorId: '',
      location: '',
      frequency: 'Semanal' as const,
      frequencyItems: [],
      organizers: [currentUserMockData],
    }
  });

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();

    if (!isValid) {
      return;
    }

    setCurrentStep(prev => prev + 1);
  };

  const handleFinalSubmit = async (data: CellFormData) => {
    const response = await registerCell(data);

    if (response.success) {
      console.log('Célula criada com sucesso! ID:', response.id);
    } else {
      console.log('Falha ao criar a célula.');
    }
  };

  const validateCurrentStep = async () => {
    const fieldsToValidate = stepFields[currentStep as keyof typeof stepFields];
    if (!fieldsToValidate) return true;

    const result = await trigger(fieldsToValidate as any);

    return result;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>

          <FormStepper steps={steps} currentStep={currentStep} />

          {currentStep === 0 && (
            <BasicInfoStep
              control={control}
              errors={errors}
              professorsList={professorsList}
            />
          )}

          {currentStep === 1 && (
            <OrganizersStep
              control={control}
              errors={errors}
            />
          )}

          {currentStep === 2 && (
            <DetailsStep
              control={control}
              errors={errors}
            />
          )}
        </View>

        <View>
          <FormNavigationButtons
            currentStep={currentStep}
            totalSteps={steps.length}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSubmit={handleSubmit(handleFinalSubmit)}
            isSubmitting={isSubmitting}
            submitLabel="Criar Célula"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
