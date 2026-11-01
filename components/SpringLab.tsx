"use client";

import { useMemo, useState } from "react";
import { metrics, stepResponse } from "@/lib/spring";
import { useSpringBox } from "@/lib/useSpringBox";

const W = 520;
const H = 190;
const PAD = { l: 8, r: 8, t: 14, b: 22 };
const SECONDS = 1.0;
const Y_MAX = 1.4;

export function SpringLab() {
  const [response, setResponse] = useState(0.4);
  const [damping, setDamping] = useState(0.74);
  const [wide, setWide] = useState(false);

  const params = useMemo(() => ({ response, damping }), [response, damping]);
  const samples = useMemo(() => stepResponse(params, SECONDS), [params]);
  const m = useMemo(() => metrics(samples), [samples]);

  const x = (t: number) => PAD.l + (t / SECONDS) * (W - PAD.l - PAD.r);
  const y = (v: number) => H - PAD.b - (Math.min(v, Y_MAX) / Y_MAX) * (H - PAD.t - PAD.b);
  const path = samples.map((s, i) => `${i ? "L" : "M"}${x(s.t).toFixed(1)} ${y(s.x).toFixed(1)}`).join(" ");

  const box = useMemo(() => ({ w: wide ? 340 : 110, h: wide ? 46 : 34 }), [wide]);
  const ref = useSpringBox(box, { grow: params, shrink: params });

  return (
    <div className="lab">
      <div className="lab-plot">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Spring step response curve" className="lab-svg">
          <line x1={PAD.l} x2={W - PAD.r} y1={y(1)} y2={y(1)} className="lab-target" />
          <line x1={PAD.l} x2={W - PAD.r} y1={y(0)} y2={y(0)} className="lab-axis" />
          <path d={path} className="lab-curve" />
          <text x={W - PAD.r} y={y(1) - 6} textAnchor="end" className="lab-label">target</text>
          <text x={PAD.l} y={H - 5} className="lab-label">0 ms</text>
          <text x={W - PAD.r} y={H - 5} textAnchor="end" className="lab-label">{Math.round(SECONDS * 1000)} ms</text>
        </svg>
        <dl className="lab-read">
          <div>
            <dt>Settles in</dt>
            <dd>{m.settleMs === null ? "over 1 s" : `${m.settleMs} ms`}</dd>
          </div>
          <div>
            <dt>Overshoot</dt>
            <dd>{m.overshoot < 0.05 ? "none" : `${m.overshoot.toFixed(1)}%`}</dd>
          </div>
        </dl>
      </div>

      <div className="lab-controls">
        <label className="lab-field">
          <span>Response <output>{response.toFixed(2)} s</output></span>
          <input
            type="range"
            className="slider"
            min={0.15}
            max={0.9}
            step={0.01}
            value={response}
            style={{ "--v": `${((response - 0.15) / 0.75) * 100}%` } as React.CSSProperties}
            onChange={(e) => setResponse(Number(e.target.value))}
          />
        </label>
        <label className="lab-field">
          <span>Damping <output>{damping.toFixed(2)}</output></span>
          <input
            type="range"
            className="slider"
            min={0.3}
            max={1.2}
            step={0.01}
            value={damping}
            style={{ "--v": `${((damping - 0.3) / 0.9) * 100}%` } as React.CSSProperties}
            onChange={(e) => setDamping(Number(e.target.value))}
          />
        </label>
        <div className="lab-presets">
          <button type="button" className="chip" onClick={() => { setResponse(0.4); setDamping(0.74); }}>Pill opens</button>
          <button type="button" className="chip" onClick={() => { setResponse(0.3); setDamping(1); }}>Pill closes</button>
          <button type="button" className="chip" onClick={() => { setResponse(0.6); setDamping(0.35); }}>Wobbly</button>
        </div>
      </div>

      <div className="lab-rig">
        <div className="lab-track">
          <div ref={ref} className="pill pill-lab" aria-hidden="true" />
        </div>
        <button type="button" className="btn btn-primary btn-sm" onClick={() => setWide((w) => !w)}>
          {wide ? "Release back" : "Release"}
        </button>
      </div>
    </div>
  );
}
