import { Cell } from "@/interfaces/cell";
import { supabase } from '@/supabaseClient';
import { Item } from "react-native-picker-select";

const TABLE_NAME = 'extracurricular_group';

export const registerCell = async (data: Cell): Promise<{ success: boolean; id: string }> => {
  console.log('Registering cell with data:', data);

  const convertToISO = (value?: string | undefined | null) => {
    if (!value) return null;
    const parts = value.split('/');
    if (parts.length !== 3) return null;
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const frequencyToInterval = (f?: string | null) => {
    if (!f) return null;
    // If the frequency already looks like an ISO 8601 duration, return it
    if (f.startsWith('P')) return f;
    if (f === 'Semanal') return 'P7D'; // 7 days
    if (f === 'Mensal') return 'P1M'; // 1 month
    return null;
  };

  const makeTime = (t: string) => (t && t.length === 5 ? `${t}:00` : t);

  const weekdayMap: Record<string, number> = {
    'Domingo': 0,
    'Segunda-feira': 1,
    'Terça-feira': 2,
    'Quarta-feira': 3,
    'Quinta-feira': 4,
    'Sexta-feira': 5,
    'Sábado': 6,
  };

  const payload = {
    name: data.name,
    description: data.description ?? null,
    category: (data as any).category ?? null,
    location: data.location ?? null,
    responsible_professor_id: data.professorId ? Number(data.professorId) : null,
    frequency: frequencyToInterval(data.frequency),
    start_date: convertToISO(data.startDate),
    end_date: convertToISO(data.endDate),
    // Map FrequencyItem -> scheduled_time composite
    allocated_times: (data.frequencyItems ?? []).map(item => {
      if (data.frequency === 'Semanal') {
        return {
          weekday: weekdayMap[item.day] ?? Number(item.day),
          start_time: makeTime(item.startTime),
          end_time: makeTime(item.endTime),
        };
      } else if (data.frequency === 'Mensal') {
        return {
          day: Number(item.day),
          start_time: makeTime(item.startTime),
          end_time: makeTime(item.endTime),
        };
      }
      return {
        day: item.day,
        start_time: makeTime(item.startTime),
        end_time: makeTime(item.endTime),
      };
    }),
    approved: data.approved ?? false,
  }; 

  console.log('Inserting payload:', payload);

  return await supabase.from(TABLE_NAME).insert(payload).select('id').then(({ data: insertedData, error }) => {
    if (error) {
      console.error('Error inserting cell:', error);
      return { success: false, id: '' };
    }
    console.log('Cell inserted successfully:', insertedData);
    const insertedId = (insertedData as any)?.[0]?.id ?? '';
    return { success: true, id: String(insertedId) };
  });
};

export const getCategories = async (): Promise<string[]> => {
  const mockData = [
    'Academic Support',
    'Career Development',
    'Health & Wellness',
    'Hobbies & Interests',
  ];

  return new Promise<string[]>(resolve => {
    setTimeout(() => {
      resolve(mockData);
    }, 500);
  });
}

export const getProfessors = async (): Promise<Item[]> => {
  const mockData = [
    {
      value: '1',
      label: 'F. Victor Pinheiro'
    },
    {
      value: '2',
      label: 'Claro Henrique'
    }
  ];

  return new Promise<Item[]>(resolve => {
    setTimeout(() => {
      resolve(mockData);
    }, 500);
  });
};