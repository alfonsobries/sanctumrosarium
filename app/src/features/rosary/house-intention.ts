import { localDateOf } from '@/features/rosary/session-store';
import type { KvDriver } from '@/storage/kv';

const KEY = 'house-intention';

type Stored = {
  readonly text: string;
  readonly localDate: string;
};

/**
 * The household intention lives on this device for tonight. It is not a profile
 * and it does not travel (task 041). A new calendar day clears it.
 */
export function loadHouseIntention(
  driver: KvDriver,
  now = new Date(),
): string | undefined {
  const raw = driver.get(KEY);
  if (raw === null) {
    return undefined;
  }
  try {
    const parsed = JSON.parse(raw) as Stored;
    if (
      typeof parsed.text !== 'string' ||
      parsed.text.trim() === '' ||
      parsed.localDate !== localDateOf(now)
    ) {
      return undefined;
    }
    return parsed.text;
  } catch {
    return undefined;
  }
}

export function saveHouseIntention(
  driver: KvDriver,
  text: string,
  now = new Date(),
): void {
  const trimmed = text.trim();
  if (trimmed === '') {
    driver.remove(KEY);
    return;
  }
  driver.set(
    KEY,
    JSON.stringify({ text: trimmed, localDate: localDateOf(now) } satisfies Stored),
  );
}

export function clearHouseIntention(driver: KvDriver): void {
  driver.remove(KEY);
}
