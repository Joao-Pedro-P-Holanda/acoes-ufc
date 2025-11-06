import { CommunityAction } from '@/interfaces/community-action';
import { supabase } from '@/supabaseClient';
import { normalizeTags } from '@/utils/normalize-tags';
import { useEffect, useState } from 'react';

const TABLE_NAME = 'CommunityAction';

export function useActions(id?: string) {
  const [actions, setActions] = useState<CommunityAction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActions();
  }, [id]);

  const loadActions = async () => {
    try {
      setLoading(true);

      let query = supabase.from(TABLE_NAME).select('*');

      if (id) {
        query = query.eq('id', id);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao carregar ações:', error.message);
        setActions([]);
        return;
      }

      const normalized = (data || []).map(item => ({
        ...item,
        tags: normalizeTags((item as any).tags),
      })) as CommunityAction[];

      setActions(normalized);
    } catch (err) {
      console.error('Erro inesperado ao carregar ações:', err);
      setActions([]);
    } finally {
      setLoading(false);
    }
  };

  const addAction = async (action: CommunityAction) => {
    const { data, error } = await supabase.from(TABLE_NAME).insert(action).select();
    console.log('Dados inseridos:', action);
    console.log('Resposta do Supabase:', data);
    console.log('Erro do Supabase:', error);

    if (error) {
      console.error('Erro ao adicionar ação:', error.message);
      return;
    }

    if (data) {
      const newAction = data[0];
      console.log('Ação adicionada com sucesso:', data);
      setActions((prev) => [...prev, ...data]);
      return newAction;
    }
  };

  const updateAction = async (updatedAction: CommunityAction) => {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(updatedAction)
      .eq('id', updatedAction.id)
      .select();

    if (error) {
      console.error('Erro ao atualizar ação:', error.message);
      return;
    }

    if (data) {
      setActions((prev) =>
        prev.map((a) => (a.id === updatedAction.id ? data[0] : a))
      );
    }
  };

  const deleteAction = async (actionId: string) => {
    const { error } = await supabase.from(TABLE_NAME).delete().eq('id', actionId);

    if (error) {
      console.error('Erro ao deletar ação:', error.message);
      return;
    }

    setActions((prev) => prev.filter((a) => a.id !== actionId));
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
