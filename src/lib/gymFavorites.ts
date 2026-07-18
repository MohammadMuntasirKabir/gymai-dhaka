const STORAGE_KEY = "gym-ai:favorites";

export function getFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return new Set(Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : []);
  } catch {
    return new Set();
  }
}

function saveFavorites(ids: Set<string>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)));
}

export function toggleFavorite(id: string): Set<string> {
  const current = getFavorites();
  if (current.has(id)) {
    current.delete(id);
  } else {
    current.add(id);
  }
  saveFavorites(current);
  return current;
}
