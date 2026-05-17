import {
  SimpleInputs,
  SimpleDesignResult,
  HBeamSelection,
  LateralSelection,
} from './types';
import {
  E_PSI, JOIST_SPACING_FT, WT_SBB,
  S2IN, D2IN, DBB, SBB,
  P_VALS, J_MIN, J_MAX, W_MIN, W_MAX,
} from './constants';
import { validateInputs } from './validation';

// ---------------------------------------------------------------------------
// Deflection: simply-supported UDL, δ = 5wL⁴/(384EI), limit L/240
// ---------------------------------------------------------------------------
function deflUdlOk(w_lbft: number, L_ft: number, Ix: number): boolean {
  const L = L_ft * 12;
  const w = w_lbft / 12;
  const delta = (5 * w * L ** 4) / (384 * E_PSI * Ix);
  return delta <= L / 240;
}

// ---------------------------------------------------------------------------
// H-beam deflection: combined point load + partial UDL, limit L/240
// ---------------------------------------------------------------------------
function deflHbeamOk(
  w_h: number, P: number, a_ft: number, j_ft: number, L_ft: number, Ix: number
): boolean {
  const L = L_ft * 12;
  const a = a_ft * 12;
  const w = w_h / 12;
  const j = j_ft * 12;

  // Point load at x=a: midspan deflection (conservative — uses c=min(a,L-a))
  const c = Math.min(a, L - a);
  const delta_pt = (P * c * (3 * L ** 2 - 4 * c ** 2)) / (48 * E_PSI * Ix);

  // Partial UDL from x=a to x=L (deck trib, half-bay of 16" OC joists)
  const R_A2 = (w * j ** 2) / (2 * L);
  const delta_tr =
    (L / 2 >= a
      ? R_A2 * L ** 3 / 16 + (w * (2 * (L / 2 - a) ** 4 - j ** 4)) / 48
      : R_A2 * L ** 3 / 16 - (w * j ** 4) / 48
    ) / (E_PSI * Ix);

  return (delta_pt + delta_tr) <= L / 240;
}

// ---------------------------------------------------------------------------
// Member selection
// ---------------------------------------------------------------------------
function selHbeam(
  M: number, V: number, w_h: number, P: number, a_ft: number, j_ft: number
): HBeamSelection {
  const L = a_ft + j_ft;
  if (M <= S2IN.Mal && V <= S2IN.Va && deflHbeamOk(w_h, P, a_ft, j_ft, L, S2IN.Ix)) return 's2in';
  if (M <= D2IN.Mal && V <= D2IN.Va && deflHbeamOk(w_h, P, a_ft, j_ft, L, D2IN.Ix)) return 'd2in';
  if (M <= DBB.Mal  && V <= DBB.Va  && deflHbeamOk(w_h, P, a_ft, j_ft, L, DBB.Ix))  return 'dbb';
  return 'fails';
}

function selLateral(
  M: number, V: number, W_ft: number, w_lbft: number
): LateralSelection {
  if (M <= SBB.Mal && V <= SBB.Va && deflUdlOk(w_lbft, W_ft, SBB.Ix)) return 'sbb';
  if (M <= DBB.Mal && V <= DBB.Va && deflUdlOk(w_lbft, W_ft, DBB.Ix)) return 'dbb';
  return 'fails';
}

// ---------------------------------------------------------------------------
// Core loads — b=0, S=W, given (p, j, W, a)
// ---------------------------------------------------------------------------
function loads(p: number, j: number, W: number, a: number) {
  const L = j + a;

  // Carry beam (and outer box beam) — b=0 so both have UDL = p·j/2 + self-wt
  const w_c = (p * j) / 2 + WT_SBB;
  const M_c = (w_c * W ** 2) / 8;
  const V_c = (w_c * W) / 2;

  // H-beam component 1: point load P = V_carry at x=a
  const P_pt = V_c;
  const M_pt = (P_pt * a * j) / L;
  const Rw_pt = (P_pt * j) / L;
  const Rp_pt = (P_pt * a) / L;

  // H-beam component 2: partial UDL from deck (16" OC, half-bay)
  const w_tr = (p * JOIST_SPACING_FT) / 2;
  const Rw_tr = (w_tr * j ** 2) / (2 * L);
  const Rp_tr = (w_tr * j * (2 * L - j)) / (2 * L);
  const M_tr = (w_tr * j ** 2 * (4 * L * a + j ** 2)) / (8 * L ** 2);

  const M_hb = M_pt + M_tr;
  const R_wall = Rw_pt + Rw_tr;
  const R_post = Rp_pt + Rp_tr;
  const V_hb_gov = Math.max(R_wall, R_post);

  return { w_c, M_c, V_c, M_hb, V_hb_gov, R_wall };
}

// ---------------------------------------------------------------------------
// Sweep: max connection demands for a given member configuration
// ---------------------------------------------------------------------------
function maxDemandsForConfig(targetHb: HBeamSelection, targetLat: LateralSelection) {
  let maxV = 0;
  let maxR = 0;
  let count = 0;

  for (const p of P_VALS) {
    for (let j = J_MIN; j <= J_MAX; j++) {
      const a = Math.min(4, j);
      const w_h = (p * JOIST_SPACING_FT) / 2;
      for (let W = W_MIN; W <= W_MAX; W++) {
        const { w_c, M_c, V_c, M_hb, V_hb_gov, R_wall } = loads(p, j, W, a);
        const hb = selHbeam(M_hb, V_hb_gov, w_h, V_c, a, j);
        const lat = selLateral(M_c, V_c, W, w_c);
        if (hb === targetHb && lat === targetLat) {
          count++;
          if (V_c > maxV) maxV = V_c;
          if (R_wall > maxR) maxR = R_wall;
        }
      }
    }
  }

  if (count === 0) return null;
  return { V_carry: Math.round(maxV), R_wall: Math.round(maxR), cellCount: count };
}

// ---------------------------------------------------------------------------
// Public API: design for a single (p, j, W) cell
// ---------------------------------------------------------------------------
export function designSimple(inputs: SimpleInputs): SimpleDesignResult {
  const { p_psf, j_ft, W_ft } = inputs;

  const errors = validateInputs(inputs);
  if (errors.length > 0) {
    return {
      inputs,
      a_ft: 0,
      L_ft: 0,
      hbeam: 'fails',
      lateral: 'fails',
      w_carry: 0,
      M_carry: 0,
      V_carry: 0,
      M_hbeam: 0,
      V_hbeam: 0,
      R_wall: 0,
      V_conn_carry: 0,
      V_conn_outer: 0,
      errors,
      maxForConfig: null,
    };
  }

  const a = Math.min(4, j_ft);
  const w_h = (p_psf * JOIST_SPACING_FT) / 2;
  const { w_c, M_c, V_c, M_hb, V_hb_gov, R_wall } = loads(p_psf, j_ft, W_ft, a);

  const hbeam = selHbeam(M_hb, V_hb_gov, w_h, V_c, a, j_ft);
  const lateral = selLateral(M_c, V_c, W_ft, w_c);

  return {
    inputs,
    a_ft: a,
    L_ft: a + j_ft,
    hbeam,
    lateral,
    w_carry: w_c,
    M_carry: M_c,
    V_carry: V_c,
    M_hbeam: M_hb,
    V_hbeam: V_hb_gov,
    // Connection demands
    R_wall,             // H-beam reaction at house wall (into ledger track)
    V_conn_carry: V_c,  // Carry beam end reaction (download into hanger at H-beam)
    V_conn_outer: V_c,  // Outer beam end reaction (same as carry when b=0)
    errors: [],
    maxForConfig: (hbeam !== 'fails' && lateral !== 'fails')
      ? maxDemandsForConfig(hbeam, lateral)
      : null,
  };
}
