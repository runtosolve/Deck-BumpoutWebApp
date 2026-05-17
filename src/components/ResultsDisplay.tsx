"use client";

import type { HBeamSelection, LateralSelection } from "@/lib/types";
import { S2IN, D2IN, DBB, SBB } from "@/lib/constants";

export interface DesignResult {
  inputs: { p_psf: number; j_ft: number; W_ft: number };
  a_ft: number;
  L_ft: number;
  hbeam: HBeamSelection;
  lateral: LateralSelection;
  w_carry: number;
  M_carry: number;
  V_carry: number;
  M_hbeam: number;
  V_hbeam: number;
  R_wall: number;
  V_conn_carry: number;
  V_conn_outer: number;
  errors: string[];
  maxForConfig: {
    V_carry: number;
    R_wall: number;
    cellCount: number;
  } | null;
}

const HB_LABELS: Record<HBeamSelection, string> = {
  s2in: "Single 2\" Joist",
  d2in: "Double 2\" (web-to-web)",
  dbb: "Double Box Beam",
  fails: "NOT VIABLE",
};

const LAT_LABELS: Record<LateralSelection, string> = {
  sbb: "Single Box Beam",
  dbb: "Double Box Beam",
  fails: "NOT VIABLE",
};

const HB_CODES: Record<HBeamSelection, string> = {
  s2in: "S2", d2in: "D2", dbb: "DB", fails: "--",
};

const LAT_CODES: Record<LateralSelection, string> = {
  sbb: "B", dbb: "DB", fails: "--",
};

type ColorTier = "green" | "blue" | "grey";

function hbColor(sel: HBeamSelection): ColorTier {
  if (sel === "fails") return "grey";
  if (sel === "dbb") return "blue";
  return "green";
}

function latColor(sel: LateralSelection): ColorTier {
  if (sel === "fails") return "grey";
  if (sel === "dbb") return "blue";
  return "green";
}

function worstColor(a: ColorTier, b: ColorTier): ColorTier {
  if (a === "grey" || b === "grey") return "grey";
  if (a === "blue" || b === "blue") return "blue";
  return "green";
}

const COLOR_STYLES: Record<ColorTier, { bg: string; border: string; text: string; badge: string }> = {
  green: {
    bg: "bg-green-50",
    border: "border-green-500",
    text: "text-green-800",
    badge: "bg-green-600",
  },
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-500",
    text: "text-blue-800",
    badge: "bg-blue-600",
  },
  grey: {
    bg: "bg-gray-100",
    border: "border-gray-400",
    text: "text-black",
    badge: "bg-gray-500",
  },
};

function hbCapacity(sel: HBeamSelection) {
  if (sel === "s2in") return S2IN;
  if (sel === "d2in") return D2IN;
  if (sel === "dbb") return DBB;
  return null;
}

function latCapacity(sel: LateralSelection) {
  if (sel === "sbb") return SBB;
  if (sel === "dbb") return DBB;
  return null;
}

interface ResultsDisplayProps {
  result: DesignResult;
}

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
  const allFail = result.hbeam === "fails" || result.lateral === "fails";
  const overall = worstColor(hbColor(result.hbeam), latColor(result.lateral));
  const cellCode = `${HB_CODES[result.hbeam]}/${LAT_CODES[result.lateral]}`;

  // Errors from validation
  if (result.errors.length > 0) {
    return (
      <div className="space-y-3">
        {result.errors.map((err, i) => (
          <div
            key={i}
            className="flex gap-3 items-start bg-red-50 border-2 border-red-500 rounded-xl px-5 py-4"
            role="alert"
          >
            <span className="text-red-600 text-2xl flex-shrink-0 font-bold">!</span>
            <p className="text-base text-red-800 font-medium">{err}</p>
          </div>
        ))}
      </div>
    );
  }

  const hbStyle = COLOR_STYLES[hbColor(result.hbeam)];
  const latStyle = COLOR_STYLES[latColor(result.lateral)];
  const overallStyle = COLOR_STYLES[overall];

  return (
    <div className="space-y-6">
      {/* Overall status banner */}
      <div
        className={`rounded-xl px-6 py-5 text-center text-white ${overallStyle.badge}`}
        role="status"
        aria-live="polite"
      >
        <p className="text-4xl font-black tracking-wide">{cellCode}</p>
        <p className="text-lg mt-1 opacity-90">
          {allFail
            ? "No viable member combination at this span"
            : overall === "blue"
              ? "Passes — Double Box Beam H-beam required"
              : "All members pass — standard framing"}
        </p>
      </div>

      {/* Assumptions note */}
      <div className="text-sm text-black bg-gray-50 rounded-lg px-4 py-3">
        Assumptions: b = 0 (no overhang), S = W (posts at corners), a = {result.a_ft} ft (worst-case bumpout depth).
        Total H-beam span L = {result.L_ft} ft.
      </div>

      {/* Member cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* H-beam card */}
        <div className={`rounded-xl border-2 p-5 ${hbStyle.bg} ${hbStyle.border}`}>
          <h3 className="text-base font-bold text-black mb-1">H-Beam (Side Brackets)</h3>
          <p className={`text-2xl font-black ${hbStyle.text}`}>
            {HB_LABELS[result.hbeam]}
          </p>
          <p className="text-sm text-black mt-2">
            Code: <span className="font-bold">{HB_CODES[result.hbeam]}</span>
            {result.hbeam === "dbb" && (
              <span className="ml-2 text-blue-700 font-medium">
                — raises deck ~1/8&quot; above plane
              </span>
            )}
          </p>
          {(() => {
            const cap = hbCapacity(result.hbeam);
            return (
              <div className="mt-3 pt-3 border-t border-gray-300 text-sm">
                <div className="grid grid-cols-3 gap-x-2 gap-y-1">
                  <span />
                  <span className="text-black text-xs font-semibold text-right">Demand</span>
                  <span className="text-black text-xs font-semibold text-right">Capacity</span>

                  <span className="text-black">Moment:</span>
                  <span className="font-mono font-semibold text-black text-right">{Math.round(result.M_hbeam).toLocaleString()}</span>
                  <span className="font-mono text-black text-right">{cap ? cap.Mal.toLocaleString() : "—"} ft-lb</span>

                  <span className="text-black">Shear:</span>
                  <span className="font-mono font-semibold text-black text-right">{Math.round(result.V_hbeam).toLocaleString()}</span>
                  <span className="font-mono text-black text-right">{cap ? cap.Va.toLocaleString() : "—"} lbs</span>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Carry / Outer beam card */}
        <div className={`rounded-xl border-2 p-5 ${latStyle.bg} ${latStyle.border}`}>
          <h3 className="text-base font-bold text-black mb-1">Carry Beam &amp; Outer Beam</h3>
          <p className={`text-2xl font-black ${latStyle.text}`}>
            {LAT_LABELS[result.lateral]}
          </p>
          <p className="text-sm text-black mt-2">
            Code: <span className="font-bold">{LAT_CODES[result.lateral]}</span>
            <span className="ml-2">— identical when b = 0</span>
          </p>
          {(() => {
            const cap = latCapacity(result.lateral);
            return (
              <div className="mt-3 pt-3 border-t border-gray-300 text-sm">
                <div className="grid grid-cols-3 gap-x-2 gap-y-1">
                  <span />
                  <span className="text-black text-xs font-semibold text-right">Demand</span>
                  <span className="text-black text-xs font-semibold text-right">Capacity</span>

                  <span className="text-black">Moment:</span>
                  <span className="font-mono font-semibold text-black text-right">{Math.round(result.M_carry).toLocaleString()}</span>
                  <span className="font-mono text-black text-right">{cap ? cap.Mal.toLocaleString() : "—"} ft-lb</span>

                  <span className="text-black">Shear:</span>
                  <span className="font-mono font-semibold text-black text-right">{Math.round(result.V_carry).toLocaleString()}</span>
                  <span className="font-mono text-black text-right">{cap ? cap.Va.toLocaleString() : "—"} lbs</span>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Connection demands — max for this member config */}
      {result.maxForConfig && !allFail && (
        <div className={`rounded-xl border-2 p-5 ${overallStyle.bg} ${overallStyle.border}`}>
          <h3 className="text-base font-bold text-black mb-1">
            Connection Demands for {cellCode}
          </h3>
          <p className="text-sm text-black mb-3">
            Design connections to these values — worst case across
            all {result.maxForConfig.cellCount.toLocaleString()} cells
            that use the {cellCode} configuration.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-sm">
            <div className="bg-white rounded-lg p-4">
              <p className="text-black font-semibold mb-1">Carry/Outer Beam End Reaction</p>
              <p className="font-mono font-bold text-black text-2xl">
                {result.maxForConfig.V_carry.toLocaleString()} lbs
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-black font-semibold mb-1">H-Beam Wall Reaction</p>
              <p className="font-mono font-bold text-black text-2xl">
                {result.maxForConfig.R_wall.toLocaleString()} lbs
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Color legend */}
      <div className="flex flex-wrap gap-4 text-sm text-black">
        <span className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 rounded bg-green-600" /> S2 or D2 (standard)
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 rounded bg-blue-600" /> DB (Double Box Beam required)
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 rounded bg-gray-500" /> Not viable
        </span>
      </div>
    </div>
  );
}
