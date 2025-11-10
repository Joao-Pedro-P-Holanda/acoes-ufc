export function normalizeTags(value: unknown): string[] {
  if (!value) return [];

  // já é array
  if (Array.isArray(value)) {
    return value.filter((t) => typeof t === 'string');
  }

  // se for string, tenta parsear JSON -> array ou retorna array com a string
  if (typeof value === 'string') {
    const trimmed = value.trim();

    // tenta JSON.parse (ex: '["a","b"]')
    if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || trimmed.startsWith('"')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.filter((t) => typeof t === 'string');
        }
      } catch {
        // ignore parse error
      }
    }

    // possivelmente string separada por vírgula: "a, b, c"
    if (trimmed.includes(',')) {
      return trimmed.split(',').map(s => s.trim()).filter(s => s.length > 0);
    }

    // fallback: string única
    return [trimmed];
  }

  // outros tipos: tentar converter para string único
  return [String(value)];
}
