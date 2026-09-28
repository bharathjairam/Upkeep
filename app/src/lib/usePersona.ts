import { useEffect, useState } from "react";

export function usePersona(key: string, defaultValue: string) {
  const storageKey = `pma_persona_${key}`;
  const [value, setValue] = useState(() => {
    try {
      return localStorage.getItem(storageKey) ?? defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, value);
    } catch {
      // ignore — persona selection just won't persist across reloads
    }
  }, [storageKey, value]);

  return [value, setValue] as const;
}
