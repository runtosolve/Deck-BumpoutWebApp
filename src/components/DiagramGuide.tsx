"use client";

export interface DiagramValues {
  j_ft?: string;
  W_ft?: string;
}

interface DiagramGuideProps {
  values?: DiagramValues;
}

export default function DiagramGuide({ values }: DiagramGuideProps) {
  const safeNum = (val: string | undefined, fallback: string): string => {
    const n = parseFloat(val || "");
    return isNaN(n) || n <= 0 ? fallback : String(n);
  };

  const j = safeNum(values?.j_ft, "10");
  const W = safeNum(values?.W_ft, "13");

  const jNum = parseFloat(j);
  const a = Math.min(4, jNum);
  const aStr = Number.isInteger(a) ? String(a) : a.toFixed(1);
  const L = a + jNum;
  const LStr = Number.isInteger(L) ? String(L) : L.toFixed(1);

  const wLabel = `W = ${W} ft — bumpout width`;

  const svgMarkup = `<svg width="100%" viewBox="0 0 720 480" xmlns="http://www.w3.org/2000/svg">

<defs>
<marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
<path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</marker>
</defs>

<!-- HOUSE BODY -->
<rect x="0" y="0" width="680" height="80" style="fill:rgb(38, 38, 36);stroke:rgba(222, 220, 209, 0.3);stroke-width:0.5px;"/>
<text x="340" y="30" text-anchor="middle" style="fill:rgb(250, 249, 245);font-size:14px;font-weight:500;">House Wall</text>

<!-- W dimension (overlaid on house body, white) -->
<line x1="130" y1="60" x2="518" y2="60" stroke="rgb(255, 255, 255)" stroke-width=".5" marker-end="url(#ar)" marker-start="url(#ar)"/>
<text x="324" y="55" text-anchor="middle" style="fill:rgb(255, 255, 255);font-size:12px;font-weight:600;">${wLabel}</text>

<!-- House wall face -->
<line x1="0" y1="80" x2="680" y2="80" style="stroke:rgb(250, 249, 245);stroke-width:3px;opacity:0.35;"/>

<!-- BUMPOUT PLATFORM ZONE -->
<rect x="130" y="80" width="388" height="54" style="fill:rgba(56, 139, 213, 0.1);"/>
<line x1="130" y1="93" x2="518" y2="93" style="stroke:rgba(222, 220, 209, 0.15);stroke-width:0.5px;stroke-dasharray:4px, 3px;"/>
<line x1="130" y1="106" x2="518" y2="106" style="stroke:rgba(222, 220, 209, 0.15);stroke-width:0.5px;stroke-dasharray:4px, 3px;"/>
<line x1="130" y1="119" x2="518" y2="119" style="stroke:rgba(222, 220, 209, 0.15);stroke-width:0.5px;stroke-dasharray:4px, 3px;"/>

<!-- H-BEAM LEFT -->
<rect x="102" y="80" width="28" height="310" rx="2" style="fill:rgb(24, 95, 165);stroke:rgb(12, 68, 124);stroke-width:0.5px;"/>

<!-- H-BEAM RIGHT -->
<rect x="518" y="80" width="28" height="310" rx="2" style="fill:rgb(24, 95, 165);stroke:rgb(12, 68, 124);stroke-width:0.5px;"/>

<!-- CARRY BEAM (ledger position — at bumpout depth a) -->
<rect x="130" y="134" width="388" height="14" rx="2" style="fill:rgb(239, 159, 39);stroke:rgb(186, 117, 23);stroke-width:0.5px;"/>

<!-- JOISTS (from carry beam to box beam) -->
<rect x="150" y="148" width="7" height="242" rx="1" style="fill:rgb(222, 184, 135);stroke:rgb(196, 154, 90);stroke-width:0.5px;"/>
<rect x="190" y="148" width="7" height="242" rx="1" style="fill:rgb(222, 184, 135);stroke:rgb(196, 154, 90);stroke-width:0.5px;"/>
<rect x="230" y="148" width="7" height="242" rx="1" style="fill:rgb(222, 184, 135);stroke:rgb(196, 154, 90);stroke-width:0.5px;"/>
<rect x="270" y="148" width="7" height="242" rx="1" style="fill:rgb(222, 184, 135);stroke:rgb(196, 154, 90);stroke-width:0.5px;"/>
<rect x="310" y="148" width="7" height="242" rx="1" style="fill:rgb(222, 184, 135);stroke:rgb(196, 154, 90);stroke-width:0.5px;"/>
<rect x="350" y="148" width="7" height="242" rx="1" style="fill:rgb(222, 184, 135);stroke:rgb(196, 154, 90);stroke-width:0.5px;"/>
<rect x="390" y="148" width="7" height="242" rx="1" style="fill:rgb(222, 184, 135);stroke:rgb(196, 154, 90);stroke-width:0.5px;"/>
<rect x="430" y="148" width="7" height="242" rx="1" style="fill:rgb(222, 184, 135);stroke:rgb(196, 154, 90);stroke-width:0.5px;"/>
<rect x="470" y="148" width="7" height="242" rx="1" style="fill:rgb(222, 184, 135);stroke:rgb(196, 154, 90);stroke-width:0.5px;"/>
<rect x="510" y="148" width="7" height="242" rx="1" style="fill:rgb(222, 184, 135);stroke:rgb(196, 154, 90);stroke-width:0.5px;"/>

<!-- BOX BEAM (outer) -->
<rect x="102" y="374" width="444" height="18" rx="2" style="fill:rgb(153, 60, 29);stroke:rgb(113, 43, 19);stroke-width:0.5px;"/>
<!-- joist traces through beam -->
<line x1="150" y1="374" x2="150" y2="392" stroke="#DEB887" stroke-width="5" opacity=".28"/>
<line x1="190" y1="374" x2="190" y2="392" stroke="#DEB887" stroke-width="5" opacity=".28"/>
<line x1="230" y1="374" x2="230" y2="392" stroke="#DEB887" stroke-width="5" opacity=".28"/>
<line x1="270" y1="374" x2="270" y2="392" stroke="#DEB887" stroke-width="5" opacity=".28"/>
<line x1="310" y1="374" x2="310" y2="392" stroke="#DEB887" stroke-width="5" opacity=".28"/>
<line x1="350" y1="374" x2="350" y2="392" stroke="#DEB887" stroke-width="5" opacity=".28"/>
<line x1="390" y1="374" x2="390" y2="392" stroke="#DEB887" stroke-width="5" opacity=".28"/>
<line x1="430" y1="374" x2="430" y2="392" stroke="#DEB887" stroke-width="5" opacity=".28"/>
<line x1="470" y1="374" x2="470" y2="392" stroke="#DEB887" stroke-width="5" opacity=".28"/>
<line x1="510" y1="374" x2="510" y2="392" stroke="#DEB887" stroke-width="5" opacity=".28"/>

<!-- DIMENSION LINES -->
<!-- a: house wall to carry beam -->
<line x1="598" y1="80" x2="598" y2="134" stroke="rgb(0, 0, 0)" stroke-width=".5" marker-end="url(#ar)" marker-start="url(#ar)"/>
<line x1="592" y1="80" x2="604" y2="80" stroke="rgb(0, 0, 0)" stroke-width=".5"/>
<line x1="592" y1="134" x2="604" y2="134" stroke="rgb(0, 0, 0)" stroke-width=".5"/>
<text x="612" y="105" style="fill:rgb(0, 0, 0);font-size:12px;font-weight:600;">a = ${aStr} ft</text>
<text x="612" y="117" style="fill:rgb(0, 0, 0);font-size:11px;">(locked)</text>

<!-- j: carry beam to box beam (joist span) -->
<line x1="598" y1="148" x2="598" y2="374" stroke="rgb(0, 0, 0)" stroke-width=".5" marker-end="url(#ar)" marker-start="url(#ar)"/>
<line x1="592" y1="148" x2="604" y2="148" stroke="rgb(0, 0, 0)" stroke-width=".5"/>
<line x1="592" y1="374" x2="604" y2="374" stroke="rgb(0, 0, 0)" stroke-width=".5"/>
<text x="612" y="257" style="fill:rgb(0, 0, 0);font-size:12px;font-weight:600;">j = ${j} ft</text>
<text x="612" y="269" style="fill:rgb(0, 0, 0);font-size:12px;">joist span</text>

<!-- L total (dashed) -->
<line x1="648" y1="80" x2="648" y2="374" stroke="rgb(0, 0, 0)" stroke-width=".5" stroke-dasharray="4 2"/>
<line x1="642" y1="80" x2="654" y2="80" stroke="rgb(0, 0, 0)" stroke-width=".5"/>
<line x1="642" y1="374" x2="654" y2="374" stroke="rgb(0, 0, 0)" stroke-width=".5"/>
<text x="652" y="223" style="fill:rgb(0, 0, 0);font-size:12px;font-weight:600;">L = ${LStr} ft</text>
<text x="652" y="235" style="fill:rgb(0, 0, 0);font-size:11px;">H-beam</text>
<text x="652" y="247" style="fill:rgb(0, 0, 0);font-size:11px;">span</text>

<!-- LABELS -->
<text x="324" y="100" text-anchor="middle" style="fill:rgb(0, 0, 0);font-size:12px;">Bumpout deck platform</text>
<text x="324" y="113" text-anchor="middle" style="fill:rgb(0, 0, 0);font-size:12px;">(${aStr} ft proud of house wall)</text>

<!-- H-beam labels -->
<text x="50" y="238" text-anchor="middle" style="fill:rgb(0, 0, 0);font-size:12px;">H-beam</text>
<line x1="76" y1="236" x2="102" y2="236" stroke="rgb(24, 95, 165)" stroke-width=".5" stroke-dasharray="3 2"/>

<!-- Carry beam -->
<text x="324" y="130" text-anchor="middle" style="fill:rgb(0, 0, 0);font-size:12px;">Carry beam — at bumpout edge, parallel to house</text>

<!-- Joists label -->
<text x="324" y="268" text-anchor="middle" style="fill:rgb(0, 0, 0);font-size:12px;">Joists (16" OC)</text>

<!-- Box beam -->
<text x="55" y="404" text-anchor="end" style="fill:rgb(0, 0, 0);font-size:12px;">Outer box beam</text>
<line x1="58" y1="402" x2="100" y2="384" stroke="rgb(0, 0, 0)" stroke-width=".5" stroke-dasharray="3 2"/>

<!-- Note: b=0, S=W -->
<text x="324" y="412" text-anchor="middle" style="fill:rgb(0, 0, 0);font-size:12px;">b = 0 (no overhang past posts) — S = W (posts at H-beam corners)</text>

<text x="20" y="440" style="fill:rgb(0, 0, 0);font-size:12px;">Plan view (top-down) — schematic, not to scale</text>

<!-- LEGEND -->
<rect x="110" y="454" width="12" height="10" rx="1" style="fill:rgb(24, 95, 165);stroke:rgb(12, 68, 124);stroke-width:0.5px;"/>
<text x="127" y="463" style="fill:rgb(0, 0, 0);font-size:12px;">H-beam</text>
<rect x="210" y="454" width="12" height="10" rx="1" style="fill:rgb(239, 159, 39);stroke:rgb(186, 117, 23);stroke-width:0.5px;"/>
<text x="227" y="463" style="fill:rgb(0, 0, 0);font-size:12px;">Carry beam</text>
<rect x="330" y="454" width="12" height="10" rx="1" style="fill:rgb(222, 184, 135);stroke:rgb(196, 154, 90);stroke-width:0.5px;"/>
<text x="347" y="463" style="fill:rgb(0, 0, 0);font-size:12px;">Joists</text>
<rect x="400" y="454" width="12" height="10" rx="1" style="fill:rgb(153, 60, 29);stroke:rgb(113, 43, 19);stroke-width:0.5px;"/>
<text x="417" y="463" style="fill:rgb(0, 0, 0);font-size:12px;">Box beam</text>
</svg>`;

  return (
    <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6">
      <h3 className="text-xl font-bold text-black mb-4">
        Dimension Guide
      </h3>

      <p className="text-base text-black mb-4">
        Use this diagram to identify your deck dimensions. Only <strong>j</strong> and <strong>W</strong> are needed — the bumpout depth <strong>a</strong> and total span <strong>L</strong> are calculated automatically.
      </p>

      <div className="bg-white rounded-lg p-4 flex items-center justify-center">
        <div
          className="w-full max-w-2xl"
          dangerouslySetInnerHTML={{ __html: svgMarkup }}
        />
      </div>
    </div>
  );
}
