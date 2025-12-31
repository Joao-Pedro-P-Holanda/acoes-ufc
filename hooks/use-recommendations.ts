
import { supabase } from '@/supabaseClient';
import { RecommendationWithImage } from '@/types/recommendation';
import { normalizeTags } from '@/utils/normalize-tags';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

const TABLE_NAME = 'media_profile';

type RecommendationRow = {
  id: string | number;
  name: string | null;
  media_username: string | null;
  tags: unknown;
  image_name: string | null;
};

async function getRecommendations(): Promise<RecommendationWithImage[]> {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('id, name, media_username, tags, image_name');

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as RecommendationRow[];

  const mapped = await Promise.all(
    rows.map(async (row) => {
      const imageUrl = row.image_name
        ? supabase.storage.from('imagens-recomendacoes').getPublicUrl(row.image_name).data.publicUrl
        : undefined;

      return {
        id: String(row.id),
        name: row.name ?? '',
        mediaUsername: row.media_username ?? '',
        tags: normalizeTags(row.tags),
        backgroundImage: imageUrl ? { uri: imageUrl } : undefined,
      } satisfies RecommendationWithImage;
    })
  );

  return mapped;
}

export default function useRecommendations() {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendationWithImage[]>([]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const result = await getRecommendations();
        if (!cancelled) setRecommendations(result);
      } catch {
        if (!cancelled) Alert.alert('Falha ao carregar recomendações');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { recommendations, loading };
}
