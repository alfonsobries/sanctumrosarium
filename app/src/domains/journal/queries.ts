import { useQuery, useQueryClient } from '@tanstack/react-query';

import { appJournal } from './app-journal';

export const journalKeys = {
  all: ['journal'] as const,
  days: (from: string, to: string) => ['journal', 'days', from, to] as const,
  entries: (from: string, to: string) => ['journal', 'entries', from, to] as const,
  totals: ['journal', 'totals'] as const,
  readingCounts: ['journal', 'reading-counts'] as const,
};

export function useJournalDays(from: string, to: string) {
  return useQuery({
    queryKey: journalKeys.days(from, to),
    queryFn: async () => (await appJournal()).days(from, to),
  });
}

export function useJournalEntries(from: string, to: string) {
  return useQuery({
    queryKey: journalKeys.entries(from, to),
    queryFn: async () => (await appJournal()).between(from, to),
  });
}

/** How many times each mystery's Gospel was read, which turns the passage it reads next. */
export function useReadingCounts() {
  return useQuery({
    queryKey: journalKeys.readingCounts,
    queryFn: async () => (await appJournal()).readingCounts(),
  });
}

export function useJournalTotals() {
  return useQuery({
    queryKey: journalKeys.totals,
    queryFn: async () => (await appJournal()).totals(),
  });
}

export function useInvalidateJournal(): () => Promise<void> {
  const client = useQueryClient();
  return () => client.invalidateQueries({ queryKey: journalKeys.all });
}
