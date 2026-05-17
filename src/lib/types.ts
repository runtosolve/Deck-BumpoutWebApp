/** Simplified span table inputs — locked assumptions: b=0, S=W, a=min(4,j) */
export interface SimpleInputs {
  p_psf: number;   // Design load (PSF): 50, 75, 100, 125, 150, 175, 200
  j_ft: number;    // Joist span (ft): 2–23
  W_ft: number;    // Bumpout width / carry beam span (ft): 1–13
}

export type HBeamSelection = 's2in' | 'd2in' | 'dbb' | 'fails';
export type LateralSelection = 'sbb' | 'dbb' | 'fails';

export interface SimpleDesignResult {
  inputs: SimpleInputs;
  a_ft: number;           // Derived: min(4, j)
  L_ft: number;           // Derived: a + j
  hbeam: HBeamSelection;
  lateral: LateralSelection;
  // Carry beam / outer beam demands (identical when b=0)
  w_carry: number;        // plf (UDL on carry/outer beam)
  M_carry: number;        // ft-lb
  V_carry: number;        // lbs
  // H-beam demands
  M_hbeam: number;        // ft-lb
  V_hbeam: number;        // lbs (governing reaction)
  // Connection demands
  R_wall: number;         // lbs — H-beam wall reaction
  V_conn_carry: number;   // lbs — carry beam end reaction at H-beam
  V_conn_outer: number;   // lbs — outer beam end reaction at H-beam (= V_carry when b=0)
  errors: string[];
  // Max connection demands across all cells with the same member config
  maxForConfig: {
    V_carry: number;   // lbs — max hanger download for this config
    R_wall: number;    // lbs — max wall reaction for this config
    cellCount: number; // how many cells share this config
  } | null;
}
