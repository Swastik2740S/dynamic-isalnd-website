import type { CSSProperties, ReactNode } from "react";

/* Shared content for the island's shapes. Used by the live demo and by the
   static shape list, so both always show the same thing. */

export const TRACK = { title: "Slow Tide", artist: "Harbor Lights" };

export function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function Art({ size = 26 }: { size?: number }) {
  return (
    <span
      className="iv-art"
      style={{ width: size, height: size, borderRadius: Math.round(size * 0.3) }}
      aria-hidden="true"
    />
  );
}

export function Wave() {
  return (
    <span className="iv-wave" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <i key={i} style={{ "--i": i } as CSSProperties} />
      ))}
    </span>
  );
}

export function Ring({ progress, size = 22, stroke = 3 }: { progress: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,.14)" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--timer)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - Math.max(0, Math.min(1, progress)))}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

export function Battery({ level = 0.64, bolt = false }: { level?: number; bolt?: boolean }) {
  return (
    <svg width="26" height="14" viewBox="0 0 26 14" aria-hidden="true">
      <rect x="0.75" y="0.75" width="21.5" height="12.5" rx="3.5" fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="1.5" />
      <rect x="23" y="4.5" width="2" height="5" rx="1" fill="rgba(255,255,255,.55)" />
      <rect x="2.5" y="2.5" width={Math.max(2, 18 * level)} height="9" rx="2" fill="var(--charge)" />
      {bolt && (
        <path d="M12.6 2.6 8.4 7.6h3l-.7 3.8 4.2-5h-3z" fill="#07080c" />
      )}
    </svg>
  );
}

export function ChatIcon({ size = 26 }: { size?: number }) {
  return (
    <span className="iv-appicon" style={{ width: size, height: size, borderRadius: Math.round(size * 0.28) }} aria-hidden="true">
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="#fff">
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H11l-4.2 3.6c-.6.5-1.5.1-1.5-.7V16A2.5 2.5 0 0 1 4 13.5z" />
      </svg>
    </span>
  );
}

export function MusicView() {
  return (
    <div className="iv iv-music">
      <Art />
      <Wave />
    </div>
  );
}

export function TimerView({ sec, total = 300 }: { sec: number; total?: number }) {
  return (
    <div className="iv iv-timer">
      <Ring progress={sec / total} />
      <span className="iv-time">{fmt(sec)}</span>
    </div>
  );
}

export function ToastView() {
  return (
    <div className="iv iv-toast">
      <span className="iv-toast-l">
        <Battery bolt />
        <span>Charging</span>
      </span>
      <span className="iv-toast-r">64%</span>
    </div>
  );
}

export function PeekView() {
  return (
    <div className="iv iv-peek">
      <Art size={30} />
      <div className="iv-peek-body">
        <ChatIcon size={30} />
        <div className="iv-peek-text">
          <strong>Maya</strong>
          <span>Landing at six, can you grab the keys?</span>
        </div>
      </div>
    </div>
  );
}

export function IdleView() {
  return <div className="iv iv-idle" aria-hidden="true" />;
}

/** A fixed size pill, used where nothing needs to move. */
export function StaticPill({ w, h, children, label }: { w: number; h: number; children?: ReactNode; label: string }) {
  return (
    <div
      className="pill pill-static"
      role="img"
      aria-label={label}
      style={{ width: w, height: h, borderRadius: Math.min(h / 2, 32) }}
    >
      <div className="pill-content">{children}</div>
    </div>
  );
}
