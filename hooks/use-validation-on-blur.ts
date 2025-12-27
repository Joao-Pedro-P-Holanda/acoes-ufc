import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';

interface UseValidationOnBlurProps {
  form: UseFormReturn<any>;
  fields: string[];
}

export function useValidationOnBlur({ form, fields }: UseValidationOnBlurProps) {
  const { trigger } = form;

  useEffect(() => {
    const validateFields = async () => {
      await trigger(fields as any);
    };

    validateFields();
  }, [trigger, fields]);
}
