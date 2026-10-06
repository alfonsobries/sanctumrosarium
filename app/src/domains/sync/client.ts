import { route as ziggyRoute, type Config } from 'ziggy-js';

import type { SyncResultData, TokenData, UserData } from './api.gen';
import { Ziggy } from './ziggy.gen';

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

type Fetch = typeof fetch;

export type ApiClientOptions = {
  baseUrl: string;
  token: () => Promise<string | null>;
  fetch?: Fetch;
};

/** Thin typed client over the API; URLs come from the generated route map. */
export class ApiClient {
  private readonly fetch: Fetch;

  constructor(private readonly options: ApiClientOptions) {
    this.fetch = options.fetch ?? globalThis.fetch.bind(globalThis);
  }

  private url(name: string, params?: Record<string, string>): string {
    return ziggyRoute(name, params, true, { ...Ziggy, url: this.options.baseUrl, port: null } as Config);
  }

  private async request<T>(method: string, url: string, body?: unknown): Promise<T> {
    const token = await this.options.token();
    const response = await this.fetch(url, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(token === null ? {} : { Authorization: `Bearer ${token}` }),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });

    if (!response.ok) {
      throw new ApiError(response.status, await response.text());
    }

    return (response.status === 204 ? undefined : await response.json()) as T;
  }

  signIn(provider: 'apple' | 'google', identityToken: string, device: string, name?: string): Promise<TokenData> {
    return this.request('POST', this.url('api.auth.identity', { provider }), {
      identityToken,
      device,
      ...(name === undefined ? {} : { name }),
    });
  }

  signOut(): Promise<void> {
    return this.request('DELETE', this.url('api.auth.logout'));
  }

  me(): Promise<UserData> {
    return this.request('GET', this.url('api.me.show'));
  }

  updateMe(changes: Partial<Pick<UserData, 'name' | 'locale' | 'preferences'>>): Promise<UserData> {
    return this.request('PATCH', this.url('api.me.update'), changes);
  }

  deleteAccount(): Promise<void> {
    return this.request('DELETE', this.url('api.me.destroy'));
  }

  sync(body: { cursor: string | null; prayers: unknown[] }): Promise<SyncResultData> {
    return this.request('POST', this.url('api.sync'), body);
  }
}
