import { describe, it, expect } from 'vitest';
import { validateInputs } from '../validation';

describe('validateInputs', () => {
  it('accepts valid inputs', () => {
    expect(validateInputs({ p_psf: 50, j_ft: 10, W_ft: 13 })).toEqual([]);
  });

  it('rejects invalid p_psf', () => {
    const errors = validateInputs({ p_psf: 60, j_ft: 10, W_ft: 13 });
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('p_psf');
  });

  it('rejects j_ft out of range', () => {
    expect(validateInputs({ p_psf: 50, j_ft: 1, W_ft: 13 }).length).toBe(1);
    expect(validateInputs({ p_psf: 50, j_ft: 24, W_ft: 13 }).length).toBe(1);
  });

  it('rejects non-integer j_ft', () => {
    expect(validateInputs({ p_psf: 50, j_ft: 10.5, W_ft: 13 }).length).toBe(1);
  });

  it('rejects W_ft out of range', () => {
    expect(validateInputs({ p_psf: 50, j_ft: 10, W_ft: 0 }).length).toBe(1);
    expect(validateInputs({ p_psf: 50, j_ft: 10, W_ft: 14 }).length).toBe(1);
  });

  it('rejects non-integer W_ft', () => {
    expect(validateInputs({ p_psf: 50, j_ft: 10, W_ft: 5.5 }).length).toBe(1);
  });

  it('accepts all valid P_VALS', () => {
    for (const p of [50, 75, 100, 125, 150, 175, 200]) {
      expect(validateInputs({ p_psf: p, j_ft: 10, W_ft: 10 })).toEqual([]);
    }
  });

  it('accepts boundary values', () => {
    expect(validateInputs({ p_psf: 50, j_ft: 2, W_ft: 1 })).toEqual([]);
    expect(validateInputs({ p_psf: 200, j_ft: 23, W_ft: 13 })).toEqual([]);
  });

  it('accumulates multiple errors', () => {
    const errors = validateInputs({ p_psf: 60, j_ft: 0, W_ft: 14 });
    expect(errors.length).toBe(3);
  });
});
