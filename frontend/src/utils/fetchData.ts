import type { Result } from '../types/result';

export async function fetchData(i: number): Promise<Result> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/${i}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
