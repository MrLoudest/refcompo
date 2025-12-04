import { formatReference, validateReferenceMetadata } from '../services/formatEngine';
import type { ReferenceMetadata } from '@refcompo/shared';

describe('formatEngine', () => {
  const base: ReferenceMetadata = {
    sourceType: 'journal',
    title: 'A study of testing',
    authors: [{ family: 'Smith', given: 'John' }],
    year: '2024',
    journal: 'Test Journal',
    volume: '12',
    issue: '3',
    pages: '12-18',
    doi: '10.1000/test'
  };

  it('formats APA reference', () => {
    const out = formatReference('apa7', base);
    expect(out.reference).toMatch(/Smith/);
    expect(out.reference).toMatch(/2024/);
    expect(out.reference).toMatch(/Test Journal/);
  });

  it('returns warnings for missing fields', () => {
    const warnings = validateReferenceMetadata({ ...base, year: undefined });
    expect(warnings.some((w) => w.code === 'MISSING_YEAR')).toBe(true);
  });
});


