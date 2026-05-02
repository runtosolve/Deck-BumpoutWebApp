import { describe, it, expect } from 'vitest';
import { designSimple } from '../calculations';

describe('designSimple', () => {
  it('returns errors for invalid inputs', () => {
    const result = designSimple({ p_psf: 60, j_ft: 10, W_ft: 13 });
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.hbeam).toBe('fails');
  });

  it('derives a = min(4, j)', () => {
    const r1 = designSimple({ p_psf: 50, j_ft: 10, W_ft: 13 });
    expect(r1.a_ft).toBe(4);

    const r2 = designSimple({ p_psf: 50, j_ft: 3, W_ft: 5 });
    expect(r2.a_ft).toBe(3);
  });

  it('derives L = a + j', () => {
    const r = designSimple({ p_psf: 50, j_ft: 10, W_ft: 13 });
    expect(r.L_ft).toBe(14);
  });

  // Sanity check from Julia: p=50, j=10, a=4, W=13 → D2/B
  it('matches Julia sanity check: p=50 j=10 W=13 → d2in/sbb', () => {
    const r = designSimple({ p_psf: 50, j_ft: 10, W_ft: 13 });
    expect(r.errors).toEqual([]);
    expect(r.hbeam).toBe('d2in');
    expect(r.lateral).toBe('sbb');
  });

  // From CSV p=50: j=2 W=13 → S2/B
  it('p=50 j=2 W=13 → s2in/sbb', () => {
    const r = designSimple({ p_psf: 50, j_ft: 2, W_ft: 13 });
    expect(r.hbeam).toBe('s2in');
    expect(r.lateral).toBe('sbb');
  });

  // From CSV p=50: j=15 W=13 → DB/DB
  it('p=50 j=15 W=13 → dbb/dbb', () => {
    const r = designSimple({ p_psf: 50, j_ft: 15, W_ft: 13 });
    expect(r.hbeam).toBe('dbb');
    expect(r.lateral).toBe('dbb');
  });

  // From CSV p=50: j=20 W=13 → -- (fails)
  it('p=50 j=20 W=13 → fails', () => {
    const r = designSimple({ p_psf: 50, j_ft: 20, W_ft: 13 });
    expect(r.hbeam === 'fails' || r.lateral === 'fails').toBe(true);
  });

  // From CSV p=100: j=5 W=13 → S2/B
  it('p=100 j=5 W=13 → s2in/sbb', () => {
    const r = designSimple({ p_psf: 100, j_ft: 5, W_ft: 13 });
    expect(r.hbeam).toBe('s2in');
    expect(r.lateral).toBe('sbb');
  });

  // From CSV p=100: j=9 W=13 → DB/DB
  it('p=100 j=9 W=13 → dbb/dbb', () => {
    const r = designSimple({ p_psf: 100, j_ft: 9, W_ft: 13 });
    expect(r.hbeam).toBe('dbb');
    expect(r.lateral).toBe('dbb');
  });

  // From CSV p=100: j=14 W=13 → -- (fails)
  it('p=100 j=14 W=13 → fails', () => {
    const r = designSimple({ p_psf: 100, j_ft: 14, W_ft: 13 });
    expect(r.hbeam === 'fails' || r.lateral === 'fails').toBe(true);
  });

  // Small W should pass more easily
  it('p=100 j=23 W=1 → dbb/sbb', () => {
    const r = designSimple({ p_psf: 100, j_ft: 23, W_ft: 1 });
    expect(r.errors).toEqual([]);
    expect(r.hbeam).toBe('dbb');
    expect(r.lateral).toBe('sbb');
  });

  // From CSV p=50: j=9 W=13 → D2/B (first row that upgrades from S2)
  it('p=50 j=9 W=13 → d2in/sbb', () => {
    const r = designSimple({ p_psf: 50, j_ft: 9, W_ft: 13 });
    expect(r.hbeam).toBe('d2in');
    expect(r.lateral).toBe('sbb');
  });

  // From CSV p=50: j=8 W=13 → S2/B
  it('p=50 j=8 W=13 → s2in/sbb', () => {
    const r = designSimple({ p_psf: 50, j_ft: 8, W_ft: 13 });
    expect(r.hbeam).toBe('s2in');
    expect(r.lateral).toBe('sbb');
  });

  // From CSV p=100: j=8 W=13 → D2/DB
  it('p=100 j=8 W=13 → d2in/dbb', () => {
    const r = designSimple({ p_psf: 100, j_ft: 8, W_ft: 13 });
    expect(r.hbeam).toBe('d2in');
    expect(r.lateral).toBe('dbb');
  });

  // From CSV p=50: j=17 W=5 → D2/B
  it('p=50 j=17 W=5 → d2in/sbb', () => {
    const r = designSimple({ p_psf: 50, j_ft: 17, W_ft: 5 });
    expect(r.errors).toEqual([]);
    expect(r.hbeam).toBe('d2in');
    expect(r.lateral).toBe('sbb');
  });

  it('returns valid structure for all fields', () => {
    const r = designSimple({ p_psf: 50, j_ft: 10, W_ft: 10 });
    expect(r).toHaveProperty('inputs');
    expect(r).toHaveProperty('a_ft');
    expect(r).toHaveProperty('L_ft');
    expect(r).toHaveProperty('hbeam');
    expect(r).toHaveProperty('lateral');
    expect(r).toHaveProperty('errors');
  });
});
