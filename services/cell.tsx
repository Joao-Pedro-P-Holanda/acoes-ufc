import { Cell } from "@/interfaces/cell";
import { Item } from "react-native-picker-select";

export const registerCell = async (data: Cell): Promise<{ success: boolean; id: string }> => {
  console.log('Registering cell with data:', data);
  return new Promise<{ success: boolean; id: string }>((resolve) => {
    setTimeout(() => {
      resolve({ success: true, id: 'new-cell-id' });
    }, 1000);
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