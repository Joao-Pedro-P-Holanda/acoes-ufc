import { CommunityAction } from '@/interfaces/community-action';
import { useState, useEffect } from 'react';

export function useActions() {
  const [actions, setActions] = useState<CommunityAction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActions();
  }, []);

  const loadActions = async () => {
    try {
      setLoading(true);
      // Hardcoded action for testing
      const hardcodedActions: CommunityAction[] = [
        {
          id: '2',
          name: 'Aula de Yoga na Praça',
          description: 'Aulas gratuitas de yoga ao ar livre. Todos os níveis são bem-vindos. Traga seu tapete!',
          startDate: '2024-11-10',
          endDate: '2024-12-20',
          startTime: '07:00',
          endTime: '08:00',
          frequency: 'Semanal',
          contact: 'yoga.comunidade@email.com',
          tags: ['Bem-estar'],
          location: 'Praça da Matriz',
          isFull: false,
          maxParticipants: 30,
          price: 0,
        },
        {
          id: '3',
          name: 'Oficina de Artesanato',
          description: 'Aprenda técnicas de artesanato com materiais recicláveis. Oficina voltada para a comunidade.',
          startDate: '2024-11-18',
          endDate: '2024-11-18',
          startTime: '14:00',
          endTime: '17:00',
          frequency: 'Única',
          contact: 'artesanato@comunidade.org\n(85) 91234-5678',
          tags: ['Arte'],
          location: 'Centro Comunitário do Bairro Alto',
          isFull: true,
          maxParticipants: 20,
          price: 15,
          originalLink: 'https://exemplo.com/oficina-artesanato',
          latitude: -4.9600,
          longitude: -39.0100,
        },
      ];

      setActions(hardcodedActions);
    } catch (error) {
      console.error('Failed to load actions:', error);
      setActions([]);
    } finally {
      setLoading(false);
    }
  };

  const addAction = async (action: CommunityAction) => {
    const newActions = [...actions, action];
    setActions(newActions);

    try {
      await window.storage.set(
        'community-actions',
        JSON.stringify(newActions),
        true
      );
    } catch (error) {
      console.error('Failed to save action:', error);
    }
  };

  const updateAction = async (updatedAction: CommunityAction) => {
    const newActions = actions.map(a =>
      a.id === updatedAction.id ? updatedAction : a
    );
    setActions(newActions);

    try {
      await window.storage.set(
        'community-actions',
        JSON.stringify(newActions),
        true
      );
    } catch (error) {
      console.error('Failed to update action:', error);
    }
  };

  const deleteAction = async (actionId: string) => {
    const newActions = actions.filter(a => a.id !== actionId);
    setActions(newActions);

    try {
      await window.storage.set(
        'community-actions',
        JSON.stringify(newActions),
        true
      );
    } catch (error) {
      console.error('Failed to delete action:', error);
    }
  };

  return {
    actions,
    loading,
    addAction,
    updateAction,
    deleteAction,
    refresh: loadActions,
  };
}
