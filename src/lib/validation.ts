import { SimpleInputs } from './types';
import { P_VALS, J_MIN, J_MAX, W_MIN, W_MAX } from './constants';

export function validateInputs(inputs: SimpleInputs): string[] {
  const errors: string[] = [];
  const { p_psf, j_ft, W_ft } = inputs;

  if (!(P_VALS as readonly number[]).includes(p_psf)) {
    errors.push(`p_psf (${p_psf}) must be one of: ${P_VALS.join(', ')} PSF`);
  }
  if (j_ft < J_MIN || j_ft > J_MAX || !Number.isInteger(j_ft)) {
    errors.push(`j_ft (${j_ft}) must be a whole number from ${J_MIN} to ${J_MAX} ft`);
  }
  if (W_ft < W_MIN || W_ft > W_MAX || !Number.isInteger(W_ft)) {
    errors.push(`W_ft (${W_ft}) must be a whole number from ${W_MIN} to ${W_MAX} ft`);
  }

  return errors;
}
