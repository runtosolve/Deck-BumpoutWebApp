// ESR-5257 Table 1, 14 Ga, Fy = 50 ksi, ASD method, AISI S100-16

export const E_PSI = 29_500_000; // psi, modulus of elasticity for CFS

export const JOIST_SPACING_FT = 16 / 12; // ft, 16" OC
export const WT_SBB = 5.8; // lb/ft, single box beam self-weight

// H-beam tiers
export const S2IN = { Mal: 4_425, Va: 4_155, Ix: 8.09 };   // Single 2" joist
export const D2IN = { Mal: 8_850, Va: 8_310, Ix: 16.18 };  // Double 2" (web-to-web)
export const DBB  = { Mal: 15_420, Va: 16_460, Ix: 27.52 }; // Double Box Beam

// Lateral tiers (carry beam & outer box beam — identical when b=0)
export const SBB  = { Mal: 7_710, Va: 8_230, Ix: 13.76 };  // Single Box Beam

// Sweep ranges
export const P_VALS = [50, 75, 100, 125, 150, 175, 200] as const;
export const J_MIN = 2;
export const J_MAX = 23;
export const W_MIN = 1;
export const W_MAX = 13;
