import { describe, expect, it } from 'vitest';

import { siteLanguageOf, siteUrl } from './links';

describe('about links', () => {
  it('points each page to its localized path', () => {
    expect(siteUrl('home', 'en')).toBe('https://sanctumrosarium.app/');
    expect(siteUrl('home', 'es')).toBe('https://sanctumrosarium.app/es/');
    expect(siteUrl('help', 'en')).toBe('https://sanctumrosarium.app/help/');
    expect(siteUrl('privacy', 'es')).toBe('https://sanctumrosarium.app/es/privacidad/');
    expect(siteUrl('terms', 'es')).toBe('https://sanctumrosarium.app/es/terminos/');
  });

  it('uses Spanish pages only for Spanish', () => {
    expect(siteLanguageOf('es-MX')).toBe('es');
    expect(siteLanguageOf('en')).toBe('en');
    expect(siteLanguageOf('es-ES')).toBe('es');
    expect(siteLanguageOf('la')).toBe('en');
    expect(siteLanguageOf('pt-BR')).toBe('en');
  });
});
