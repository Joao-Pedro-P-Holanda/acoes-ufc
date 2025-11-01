import { CommunityAction } from '@/interfaces/community-action';
import { useState, useEffect } from 'react';
import { storage } from '@/utils/storage';

const STORAGE_KEY = 'community-actions';

export function useActions(id: string | undefined = undefined) {
  const [actions, setActions] = useState<CommunityAction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActions();
  }, []);

  const loadActions = async () => {
    try {
      setLoading(true);
      // Try to load from storage first
      let storedActions = await storage.get<CommunityAction[]>(STORAGE_KEY);

      if (storedActions && storedActions.length > 0) {
        if (id) {
          storedActions = storedActions.filter((value) => value.id == id)
        }
        setActions(storedActions);
      }
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
      await storage.set(STORAGE_KEY, newActions);
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
      await storage.set(STORAGE_KEY, newActions);
    } catch (error) {
      console.error('Failed to update action:', error);
    }
  };

  const deleteAction = async (actionId: string) => {
    const newActions = actions.filter(a => a.id !== actionId);
    setActions(newActions);

    try {
      await storage.set(STORAGE_KEY, newActions);
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
