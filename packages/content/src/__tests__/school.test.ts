import { describe, expect, it } from 'vitest';

import { schoolPages } from '../school';

describe('school pages', () => {
  it('never cites an internal repo document to the reader', () => {
    for (const page of schoolPages) {
      for (const language of ['es', 'en'] as const) {
        expect(page.source[language].name).not.toMatch(/dossier/i);
        for (const block of page.text[language].blocks) {
          expect(block.cite ?? '').not.toMatch(/dossier/i);
        }
      }
    }
  });

  it('covers the six pages of the school in order', () => {
    expect(schoolPages.map((page) => page.id)).toEqual([
      'what-it-is',
      'history',
      'method',
      'promises',
      'indulgences',
      'the-object',
    ]);
  });

  it('every page carries a source and both languages', () => {
    for (const page of schoolPages) {
      for (const language of ['es', 'en'] as const) {
        expect(page.source[language].name.length).toBeGreaterThan(0);
        const text = page.text[language];
        expect(text.title.length).toBeGreaterThan(0);
        expect(text.lead.length).toBeGreaterThan(0);
        expect(text.blocks.length).toBeGreaterThan(2);
      }
    }
  });

  it('statements of doctrine or tradition carry a visible citation', () => {
    for (const page of schoolPages) {
      for (const language of ['es', 'en'] as const) {
        for (const block of page.text[language].blocks) {
          if (block.kind === 'magisterium' || block.kind === 'tradition') {
            expect(
              block.cite,
              `${page.id}/${language}: ${block.text.slice(0, 40)}`,
            ).toBeDefined();
          }
        }
      }
    }
  });

  it('the promises page never speaks in guarantee language', () => {
    const page = schoolPages.find((candidate) => candidate.id === 'promises')!;
    for (const language of ['es', 'en'] as const) {
      const whole = page.text[language].blocks.map((block) => block.text).join(' ');
      expect(whole).not.toMatch(
        /garantiza que (recibirás|obtendrás)|guarantees (that )?you/i,
      );
      expect(whole).toMatch(/tradición piadosa|pious tradition/i);
      expect(whole).toMatch(/Alano de la Roche|Alan de la Roche/);
    }
  });

  it('the indulgences page cites concession 17 and never grants', () => {
    const page = schoolPages.find((candidate) => candidate.id === 'indulgences')!;
    for (const language of ['es', 'en'] as const) {
      const cites = page.text[language].blocks.map((block) => block.cite ?? '').join(' ');
      expect(cites).toMatch(/17/);
      const whole = page.text[language].blocks.map((block) => block.text).join(' ');
      expect(whole).not.toMatch(/has ganado|ya es tuya|you have (earned|gained)/i);
    }
  });

  it('magisterium, liturgy and tradition are distinguished per block', () => {
    const kinds = new Set(
      schoolPages.flatMap((page) =>
        page.text.es.blocks.map((block) => block.kind ?? 'note'),
      ),
    );
    expect(kinds.has('magisterium')).toBe(true);
    expect(kinds.has('tradition')).toBe(true);
  });
});
