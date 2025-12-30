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

      console.log('Iniciando carregamento de ações...');
      let query = supabase.from(TABLE_NAME).select('*');

      if (id) {
        query = query.eq('id', id);
      }

      const { data, error } = await query;

      if (error) {
        // Evita acessar error.message diretamente (pode ser null)
        console.error('Erro ao carregar ações:', error ?? 'Erro desconhecido');
        try {
          console.error('Erro completo:', JSON.stringify(error, null, 2));
        } catch {
          console.error('Erro (não serializável):', error);
        }
        setActions([]);
        return;
      }

      console.log('Ações carregadas com sucesso:', Array.isArray(data) ? data.length : 0);
      const normalized = (Array.isArray(data) ? data : []).map(item => ({
        ...item,
        tags: normalizeTags((item as any).tags),
      })) as CommunityAction[];

      setActions(normalized);
    } catch (err) {
      console.error('Erro inesperado ao carregar ações:', err);
      console.error('Tipo do erro:', err instanceof Error ? err.constructor.name : typeof err);
      console.error('Mensagem:', err instanceof Error ? err.message : String(err));
      if (err instanceof Error && err.stack) {
        console.error('Stack:', err.stack);
      }
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
      console.error('Erro ao adicionar ação:', error ?? 'Erro desconhecido');
      try {
        console.error('Erro completo:', JSON.stringify(error, null, 2));
      } catch {
        console.error('Erro (não serializável):', error);
      }
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
      console.error('Erro ao atualizar ação:', error ?? 'Erro desconhecido');
      try {
        console.error('Erro completo:', JSON.stringify(error, null, 2));
      } catch {
        console.error('Erro (não serializável):', error);
      }
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
      console.error('Erro ao deletar ação:', error ?? 'Erro desconhecido');
      try {
        console.error('Erro completo:', JSON.stringify(error, null, 2));
      } catch {
        console.error('Erro (não serializável):', error);
      }
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
