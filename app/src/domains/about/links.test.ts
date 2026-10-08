import { describe, expect, it } from 'vitest';

import { contactUrl, siteLanguageOf, siteUrl } from './links';

describe('about links', () => {
  it('points each page to its localized path', () => {
    expect(siteUrl('home', 'es')).toBe('https://sanctumrosarium.app/');
    expect(siteUrl('help', 'en')).toBe('https://sanctumrosarium.app/en/help/');
    expect(siteUrl('privacy', 'es')).toBe('https://sanctumrosarium.app/privacidad/');
  });

  it('uses Spanish pages only for Spanish', () => {
    expect(siteLanguageOf('es-MX')).toBe('es');
    expect(siteLanguageOf('en')).toBe('en');
    expect(siteLanguageOf('la')).toBe('en');
  });

  it('builds a mailto with an encoded subject', () => {
    expect(contactUrl('Sanctum Rosarium')).toBe('mailto:alfonso@vexilo.com?subject=Sanctum%20Rosarium');
  });
});
