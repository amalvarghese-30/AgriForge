import { useEffect, useState, useCallback } from "react";

const KEY = "agriforge.recently-viewed.v1";
const MAX = 8;

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function useRecentlyViewed() {
  const [ids, setIds] = useState<string[]>(() => read());

  useEffect(() => {
    const onStorage = () => setIds(read());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const track = useCallback((id: string) => {
    if (typeof window === "undefined" || !id) return;
    const cur = read().filter((x) => x !== id);
    const next = [id, ...cur].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
    setIds(next);
  }, []);

  const clear = useCallback(() => {
    localStorage.removeItem(KEY);
    setIds([]);
  }, []);

  return { ids, track, clear };
}