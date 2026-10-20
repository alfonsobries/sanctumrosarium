import { beforeEach, describe, expect, it, vi } from 'vitest';

const permissions = vi.hoisted(() => ({ current: {} as Record<string, unknown> }));

vi.mock('expo-notifications', () => ({
  setNotificationHandler: vi.fn(),
  getPermissionsAsync: vi.fn(() => Promise.resolve(permissions.current)),
  IosAuthorizationStatus: { PROVISIONAL: 3 },
}));

import { permissionState } from './notifications';

describe('permissionState', () => {
  beforeEach(() => {
    permissions.current = {};
  });

  it('can still ask when Android says denied before it ever asked', async () => {
    permissions.current = { status: 'denied', canAskAgain: true };
    await expect(permissionState()).resolves.toBe('undetermined');
  });

  it('sends a refusal to Settings', async () => {
    permissions.current = { status: 'denied', canAskAgain: false };
    await expect(permissionState()).resolves.toBe('denied');
  });

  it('counts quiet iOS delivery as allowed', async () => {
    permissions.current = { status: 'undetermined', canAskAgain: true, ios: { status: 3 } };
    await expect(permissionState()).resolves.toBe('granted');
  });
});
