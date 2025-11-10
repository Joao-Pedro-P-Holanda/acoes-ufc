import { ExtracurricularGroup } from '@/interfaces/extracurricular_group';
import { supabase } from '@/supabaseClient';
import type { Duration } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { parse } from 'tinyduration';

const TABLE_NAME = 'extracurricular_group';

/**
 * Converts ISO 8601 duration string to date-fns Duration object
 */
function parseDuration(iso8601Duration?: string): Duration | undefined {
  if (!iso8601Duration) return undefined;
  
  try {
    const parsed = parse(iso8601Duration);
    return {
      years: parsed.years,
      months: parsed.months,
      weeks: parsed.weeks,
      days: parsed.days,
      hours: parsed.hours,
      minutes: parsed.minutes,
      seconds: parsed.seconds,
    };
  } catch (error) {
    console.error('Error parsing duration:', error);
    return undefined;
  }
}

export function useExtracurricularGroup(id?: string) {
  const [group, setGroup] = useState<ExtracurricularGroup | null>(null);
  const [loading, setLoading] = useState(true);

  const loadGroup = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erro ao carregar grupo extracurricular:', error.message);
        setGroup(null);
        return;
      }

      // Convert frequency string to Duration object
      const groupData = {
        ...data,
        frequency: data.frequency ? parseDuration(data.frequency) : undefined,
      } as ExtracurricularGroup;

      setGroup(groupData);
    } catch (err) {
      console.error('Erro inesperado ao carregar grupo extracurricular:', err);
      setGroup(null);
    } finally {
      setLoading(false);
    }
  },[id]);

  useEffect(() => {
    if (id) {
      loadGroup();
    }
  }, [id, loadGroup]);

  const updateGroup = async (updatedGroup: ExtracurricularGroup) => {
    // Convert Duration object back to ISO 8601 string for database
    const { formatISODuration } = await import('date-fns');
    const dataToUpdate = {
      ...updatedGroup,
      frequency: updatedGroup.frequency 
        ? formatISODuration(updatedGroup.frequency)
        : null,
    };

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(dataToUpdate)
      .eq('id', updatedGroup.id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar grupo extracurricular:', error.message);
      throw error;
    }

    if (data) {
      // Convert the returned frequency back to Duration object
      const convertedData = {
        ...data,
        frequency: data.frequency ? parseDuration(data.frequency) : undefined,
      } as ExtracurricularGroup;
      setGroup(convertedData);
    }

    return data;
  };

  const deleteGroup = async (groupId: number) => {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', groupId);

    if (error) {
      console.error('Erro ao deletar grupo extracurricular:', error.message);
      throw error;
    }

    setGroup(null);
  };

  const acceptRequest = async (requestId: string) => {
    // TODO: Implement the logic to accept a request
    // This will be implemented based on your specific requirements
    console.log('Accepting request:', requestId);
    
    // Example implementation:
    // const { error } = await supabase
    //   .from('group_requests')
    //   .update({ status: 'accepted' })
    //   .eq('id', requestId);
    
    // if (error) {
    //   console.error('Erro ao aceitar solicitação:', error.message);
    //   throw error;
    // }
    
    // Refresh the group data after accepting
    await loadGroup();
  };

  return {
    group,
    loading,
    updateGroup,
    deleteGroup,
    acceptRequest,
    refresh: loadGroup,
  };
}
