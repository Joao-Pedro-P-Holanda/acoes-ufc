import { z } from "zod";

export const frequencyOptions = ['Semanal', 'Mensal'] as const;

export const cellSchema = z.object({
  organizers: z.array(
    z.object({
      studentId: z.string()
        .min(1, 'O ID do estudante é obrigatório')
        .min(5, 'O ID do estudante deve ter pelo menos 5 caracteres'),
      name: z.string().min(1, 'O nome do organizador é obrigatório'),
    })
  ).min(1, 'Adicione pelo menos um organizador'),
  frequency: z.enum(frequencyOptions, { 
    required_error: 'Selecione uma frequência válida',
    invalid_type_error: 'Selecione uma frequência válida'
  }),
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
    .min(1, 'A descrição é obrigatória')
    .max(1000, 'A descrição deve ter no máximo 1000 caracteres'),
  professorId: z.string({
    required_error: 'O professor responsável é obrigatório'
  })
    .min(1, 'Selecione um professor responsável'),
  location: z.string()
    .min(1, 'O local é obrigatório')
    .max(200, 'O local deve ter no máximo 200 caracteres'),
});

export type CellFormData = z.infer<typeof cellSchema>;
export type CellFields = (keyof typeof cellSchema.shape)[];

