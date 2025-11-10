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

export function useExtracurricularGroups(pageSize:number = 10) {
  const [groups, setGroups] = useState<ExtracurricularGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState<number | null>(null);

  const loadGroups = useCallback(async (pageNum: number = 0) => {
    try {
      setLoading(true);

      const from = pageNum * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await supabase
        .from(TABLE_NAME)
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) {
        console.error('Erro ao carregar grupos extracurriculares:', error.message);
        return;
      }

      // Set total count only once (on first load)
      if (totalCount === null && count !== null) {
        setTotalCount(count);
      }

      // Convert frequency strings to Duration objects
      const groupsData = (data || []).map(item => ({
        ...item,
        frequency: item.frequency ? parseDuration(item.frequency) : undefined,
      })) as ExtracurricularGroup[];

      setGroups(groupsData);
      setPage(pageNum);
    } catch (err) {
      console.error('Erro inesperado ao carregar grupos extracurriculares:', err);
    } finally {
      setLoading(false);
    }
  }, [pageSize, totalCount]);

  useEffect(() => {
    loadGroups(0);
  }, [loadGroups]);

  const hasNextPage = totalCount !== null && (page + 1) * pageSize < totalCount;
  const hasPreviousPage = page > 0;

  const goToNextPage = useCallback(() => {
    if (hasNextPage) {
      loadGroups(page + 1);
    }
  }, [hasNextPage, page, loadGroups]);

  const goToPreviousPage = useCallback(() => {
    if (hasPreviousPage) {
      loadGroups(page - 1);
    }
  }, [hasPreviousPage, page, loadGroups]);

  const goToPage = useCallback((pageNum: number) => {
    loadGroups(pageNum);
  }, [loadGroups]);

  const refresh = useCallback(() => {
    setPage(0);
    setTotalCount(null);
    loadGroups(0);
  }, [loadGroups]);

  return {
    groups,
    loading,
    page,
    totalCount,
    hasNextPage,
    hasPreviousPage,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    refresh,
  };
}
