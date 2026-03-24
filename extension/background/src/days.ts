import { MAX_STORED_DAYS, STORAGE_KEY, WEEK_DAYS } from './constants';
import type { DayData } from './types';

export async function getAllDays(): Promise<DayData[]> {
  const result = await browser.storage.local.get(STORAGE_KEY);
  const allData: DayData[] = result[STORAGE_KEY] ?? [];
  return allData.map(normalizeDay);
}

export function normalizeDay(raw: DayData & { offlineMs?: number }): DayData {
  return {
    date: raw.date,
    sessions: raw.sessions ?? [],
    offlineMs: raw.offlineMs ?? 0,
  };
}

export async function getTodayData(): Promise<DayData> {
  const today = getDateString(Date.now());
  const all = await getAllDays();
  return all.find((d) => d.date === today) ?? { date: today, sessions: [], offlineMs: 0 };
}

export async function saveDay(day: DayData): Promise<void> {
  const normalized = normalizeDay(day);
  const result = await browser.storage.local.get(STORAGE_KEY);
  const allData: DayData[] = (result[STORAGE_KEY] ?? []).map(normalizeDay);
  const idx = allData.findIndex((d) => d.date === normalized.date);
  if (idx >= 0) allData[idx] = normalized;
  else allData.push(normalized);
  allData.sort((a, b) => a.date.localeCompare(b.date));
  await browser.storage.local.set({ [STORAGE_KEY]: allData.slice(-MAX_STORED_DAYS) });
}

export async function getDayForDate(dateStr: string): Promise<DayData> {
  const all = await getAllDays();
  return all.find((d) => d.date === dateStr) ?? { date: dateStr, sessions: [], offlineMs: 0 };
}

export function getDateString(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Rolling [today-6, …, today] (7 calendar days), oldest first. */
export async function getRollingWeek(): Promise<DayData[]> {
  const all = await getAllDays();
  const map = new Map(all.map((d) => [d.date, d]));
  const out: DayData[] = [];
  const now = new Date();
  const startDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (WEEK_DAYS - 1));
  for (let i = 0; i < WEEK_DAYS; i++) {
    const d = new Date(startDay.getFullYear(), startDay.getMonth(), startDay.getDate() + i);
    const dateStr = getDateString(d.getTime());
    out.push(normalizeDay(map.get(dateStr) ?? { date: dateStr, sessions: [], offlineMs: 0 }));
  }
  return out;
}
