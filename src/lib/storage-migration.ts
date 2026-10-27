/**
 * Copies a legacy localStorage key to a renamed key, then removes the legacy one.
 * Never overwrites an existing value under the new key.
 */
export function migrateStorageKey(
  newKey: string,
  legacyKey: string
): string | null {
  try {
    const current = localStorage.getItem(newKey);
    if (current !== null) {
      localStorage.removeItem(legacyKey);
      return current;
    }
    const legacy = localStorage.getItem(legacyKey);
    if (legacy === null) return null;
    localStorage.setItem(newKey, legacy);
    localStorage.removeItem(legacyKey);
    return legacy;
  } catch {
    return null;
  }
}
