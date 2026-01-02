import { z } from "zod";

export const frequencyOptions = ['Semanal', 'Mensal'] as const;

// Regex para validar formato de data DD/MM/AAAA
const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

// Função helper para validar data
const isValidDate = (dateStr: string): boolean => {
  if (!dateRegex.test(dateStr)) return false;

  const [day, month, year] = dateStr.split('/').map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

export const cellSchema = z.object({
  organizers: z.array(
    z.object({
      studentId: z.string()
        .min(1, 'O ID do estudante é obrigatório')
        .min(5, 'O ID do estudante deve ter pelo menos 5 caracteres'),
      name: z.string().min(1, 'O nome do organizador é obrigatório'),
    })
  ).min(1, 'Adicione pelo menos um organizador'),
  frequency: z.enum(frequencyOptions, { message: 'Selecione uma frequência válida' }),
  frequencyItems: z.array(
    z.object({
      day: z.string(),
      startTime: z.string(),
      endTime: z.string(),
    })
  ).min(1, 'Adicione pelo menos um item ao cronograma'),
  name: z.string()
    .min(1, 'O nome é obrigatório')
    .max(100, 'O nome deve ter no máximo 100 caracteres'),
  description: z.string()
    .max(1000, 'A descrição deve ter no máximo 1000 caracteres'),
  category: z.string().max(100, 'A categoria deve ter no máximo 100 caracteres').optional(),
  professorId: z.string().min(1, 'O professor responsável é obrigatório'),
  location: z.string()
    .min(1, 'O local é obrigatório')
    .max(200, 'O local deve ter no máximo 200 caracteres'),
  startDate: z
    .string()
    .min(1, 'A data de início é obrigatória')
    .refine((val) => isValidDate(val), { message: 'Data inválida. Use o formato DD/MM/AAAA' }),
  endDate: z
    .string()
    .min(1, 'A data de fim é obrigatória')
    .refine((val) => isValidDate(val), { message: 'Data inválida. Use o formato DD/MM/AAAA' }),
})
.refine(
  (data) => {
    const [startDay, startMonth, startYear] = data.startDate.split('/').map(Number);
    const [endDay, endMonth, endYear] = data.endDate.split('/').map(Number);

    const start = new Date(startYear, startMonth - 1, startDay);
    const end = new Date(endYear, endMonth - 1, endDay);

    return end >= start;
  },
  {
    path: ['endDate'],
    message: 'A data de fim não pode ser anterior à data de início'
  }
);

export type CellFormData = z.infer<typeof cellSchema>;
export type CellFields = (keyof typeof cellSchema.shape)[];

