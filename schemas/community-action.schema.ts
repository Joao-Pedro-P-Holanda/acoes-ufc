import { z } from 'zod';

// Regex para validar formato de data DD/MM/AAAA
const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

// Regex para validar formato de hora HH:MM
const timeRegex = /^([01][0-9]|2[0-3]):([0-5][0-9])$/;

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

// Schema de validação
export const communityActionSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(1, 'O nome é obrigatório')
    .min(5, 'O nome deve ter no mínimo 5 caracteres')
    .max(100, 'O nome deve ter no máximo 100 caracteres'),
  description: z
    .string()
    .min(1, 'A descrição é obrigatória')
    .min(20, 'A descrição deve ter no mínimo 20 caracteres')
    .max(1000, 'A descrição deve ter no máximo 1000 caracteres'),
  startDate: z
    .string()
    .refine((val) => !val || isValidDate(val), {
        message: 'Data inválida. Use o formato DD/MM/AAAA'
    }).optional(),
    endDate: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true; 
      return isValidDate(val);
    }, {
      message: "Data inválida. Use o formato DD/MM/AAAA"
    }),
  startTime: z
    .string()
    .min(1, 'O horário de início é obrigatório')
    .regex(timeRegex, 'Horário inválido. Use o formato HH:MM'),
  endTime: z
    .string()
    .min(1, 'O horário de fim é obrigatório')
    .regex(timeRegex, 'Horário inválido. Use o formato HH:MM'),
  frequency: z
    .enum(['Única', 'Diária', 'Semanal', 'Quinzenal', 'Mensal'])
    .optional(),
  location: z
    .string()
    .min(1, 'O local é obrigatório')
    .min(5, 'O local deve ter no mínimo 5 caracteres')
    .max(200, 'O local deve ter no máximo 200 caracteres'),
  contact: z
    .string()
    .min(1, 'As informações de contato são obrigatórias')
    .min(5, 'As informações de contato devem ter no mínimo 5 caracteres')
    .max(200, 'As informações de contato devem ter no máximo 200 caracteres'),
  maxParticipants: z.number().int('O número deve ser um inteiro')
    .min(1, 'Deve haver pelo menos 1 participante')
    .max(10000, 'O número máximo de participantes é 10.000'),
  isFree: z.boolean().default(false),
  isFull: z.boolean().optional(),
  price: z
    .number()
    .min(0, 'O preço não pode ser negativo')
    .max(100000, 'O preço máximo é R$ 100.000,00')
    .optional(),
  originalLink: z.string().url('Link inválido')
    .optional()
    .or(z.literal('')),
  tags: z
    .array(z.string())
    .min(1, 'Adicione pelo menos uma tag')
    .max(10, 'Máximo de 10 tags permitidas'),
})
.refine(
  (data) => {
    // Valida que a data de fim não é anterior à data de início
    if (!data.startDate || !data.endDate) return true;
    
    const [startDay, startMonth, startYear] = data.startDate.split('/').map(Number);
    const [endDay, endMonth, endYear] = data.endDate.split('/').map(Number);
    
    const start = new Date(startYear, startMonth - 1, startDay);
    const end = new Date(endYear, endMonth - 1, endDay);
    
    return end >= start;
  },
{
  message: 'A data de fim não pode ser anterior à data de início',
  path: ['endDate']
}
)
.refine(
  (data) => {
    // Se não é gratuito, o preço é obrigatório
    if (data.isFree === false && (data.price === undefined || data.price === 0)) {
      return false;
    }
    return true;
  },
{
  message: 'O preço é obrigatório para eventos pagos',
  path: ['price']
}
)
.refine(
  (data) => {
    // Valida que o horário de fim não é anterior ao horário de início (se mesma data)
    if (!data.startDate || !data.endDate || !data.startTime || !data.endTime) return true;
    
    // Só valida horário se for o mesmo dia
    if (data.startDate !== data.endDate) return true;
    
    const [startHour, startMin] = data.startTime.split(':').map(Number);
    const [endHour, endMin] = data.endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    return endMinutes > startMinutes;
  },
{
  message: 'O horário de fim deve ser posterior ao horário de início',
  path: ['endTime']
}
);

export type CommunityActionFormData = z.infer<typeof communityActionSchema>;
