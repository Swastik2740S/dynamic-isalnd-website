"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSpringBox } from "@/lib/useSpringBox";
import {
  Art,
  ChatIcon,
  IdleView,
  MusicView,
  PeekView,
  Ring,
  TimerView,
  ToastView,
  TRACK,
  fmt,
} from "./IslandViews";

type Mode = "idle" | "music" | "timer" | "peek" | "toast" | "open";
type Tab = "home" | "music" | "timer" | "messages";

const PILL: Record<Exclude<Mode, "open">, { w: number; h: number }> = {
  idle: { w: 124, h: 34 },
  music: { w: 268, h: 40 },
  timer: { w: 232, h: 40 },
  toast: { w: 268, h: 44 },
  peek: { w: 356, h: 60 },
};

const OPEN: Record<Tab, { w: number; h: number }> = {
  home: { w: 440, h: 198 },
  music: { w: 440, h: 224 },
  timer: { w: 440, h: 198 },
  messages: { w: 440, h: 198 },
};

const ACCENT: Record<Mode, string> = {
  idle: "#9aa7ff",
  music: "#ff6b8b",
  timer: "#ffa63d",
  peek: "#4fd6a0",
  toast: "#7ce35b",
  open: "#ff6b8b",
};

const TOUR: Mode[] = ["idle", "music", "peek", "toast", "timer", "music"];
const TIMER_TOTAL = 300;
const STAGE_MAX_W = 456;

const CHIPS: { id: Mode | "tour"; label: string }[] = [
  { id: "tour", label: "Tour" },
  { id: "idle", label: "Idle" },
  { id: "music", label: "Music" },
  { id: "peek", label: "Message" },
  { id: "toast", label: "Charger" },
  { id: "timer", label: "Timer" },
];

export function IslandDemo() {
  const [mode, setMode] = useState<Mode>("music");
  const [tab, setTab] = useState<Tab>("music");
  const [touring, setTouring] = useState(true);
  const [sec, setSec] = useState(252);
  const [running, setRunning] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [volume, setVolume] = useState(62);
  const [seek, setSeek] = useState(38);
  const [messages, setMessages] = useState([
    { id: 1, who: "Maya", text: "Landing at six, can you grab the keys?" },
    { id: 2, who: "Dev", text: "PR is green, merging after lunch." },
  ]);
  const [scale, setScale] = useState(1);
  const [now, setNow] = useState("");
  const lastLive = useRef<Mode>("music");
  const stageRef = useRef<HTMLDivElement>(null);
  const tourIndex = useRef(0);

  const open = mode === "open";

  const box = useMemo(() => {
    const s = open ? OPEN[tab] : PILL[mode as Exclude<Mode, "open">];
    return { w: s.w, h: s.h, r: open ? 32 : undefined };
  }, [mode, tab, open]);
  const pillRef = useSpringBox(box);

  /* Page wide accent follows the island, like the real one tints with album art. */
  useEffect(() => {
    document.documentElement.style.setProperty("--accent", ACCENT[mode]);
  }, [mode]);
  useEffect(
    () => () => {
      document.documentElement.style.removeProperty("--accent");
    },
    [],
  );

  /* Guided tour, until the visitor takes over. */
  useEffect(() => {
    if (!touring) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      tourIndex.current = (tourIndex.current + 1) % TOUR.length;
      const next = TOUR[tourIndex.current];
      if (next === "timer") setSec(252);
      setMode(next);
      if (next !== "idle") lastLive.current = next;
    }, 3200);
    return () => window.clearInterval(id);
  }, [touring]);

  /* The timer ticks only while it is on screen. */
  const timerVisible = mode === "timer" || (open && tab === "timer");
  useEffect(() => {
    if (!timerVisible || !running) return;
    const id = window.setInterval(() => setSec((s) => (s > 0 ? s - 1 : TIMER_TOTAL)), 1000);
    return () => window.clearInterval(id);
  }, [timerVisible, running]);

  useEffect(() => {
    if (!open) return;
    const tick = () => setNow(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }));
    tick();
    const id = window.setInterval(tick, 20000);
    return () => window.clearInterval(id);
  }, [open]);

  /* Keep the largest shape inside narrow screens. */
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setScale(Math.min(1, (entry.contentRect.width - 24) / STAGE_MAX_W));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const choose = useCallback((id: Mode | "tour") => {
    if (id === "tour") {
      tourIndex.current = 0;
      setTouring(true);
      setMode("music");
      return;
    }
    setTouring(false);
    if (id === "timer") setSec(252);
    if (id !== "idle") lastLive.current = id;
    setMode(id);
  }, []);

  const openIsland = () => {
    setTouring(false);
    setTab(lastLive.current === "timer" ? "timer" : "music");
    setMode("open");
  };

  const closeIsland = useCallback(() => {
    setMode(lastLive.current);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeIsland();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeIsland]);

  const label =
    mode === "open"
      ? "Island dashboard"
      : `Island showing ${mode === "peek" ? "a message" : mode === "toast" ? "the charger" : mode}. Press to open the dashboard.`;

  return (
    <div className="stage-wrap">
      <div
        className="stage"
        ref={stageRef}
        onClick={(e) => {
          if (open && e.target === e.currentTarget) closeIsland();
        }}
      >
        <div className="stage-wall" aria-hidden="true" />
        <div className="stage-anchor" style={{ transform: `translateX(-50%) scale(${scale})` }}>
          <div
            ref={pillRef}
            className={`pill${open ? " pill-open" : ""}`}
            role={open ? "dialog" : "button"}
            aria-label={label}
            tabIndex={open ? -1 : 0}
            onClick={() => {
              if (!open) openIsland();
            }}
            onKeyDown={(e) => {
              if (!open && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                openIsland();
              }
            }}
          >
            <div className="pill-content" key={open ? `open-${tab}` : mode}>
              {mode === "idle" && <IdleView />}
              {mode === "music" && <MusicView />}
              {mode === "timer" && <TimerView sec={sec} total={TIMER_TOTAL} />}
              {mode === "toast" && <ToastView />}
              {mode === "peek" && <PeekView />}
              {open && (
                <Dashboard
                  tab={tab}
                  setTab={setTab}
                  sec={sec}
                  running={running}
                  toggleRunning={() => setRunning((r) => !r)}
                  playing={playing}
                  togglePlaying={() => setPlaying((p) => !p)}
                  volume={volume}
                  setVolume={setVolume}
                  seek={seek}
                  setSeek={setSeek}
                  now={now}
                  messages={messages}
                  dismiss={(id) => setMessages((m) => m.filter((x) => x.id !== id))}
                />
              )}
            </div>
          </div>
        </div>

        <p className="stage-hint" aria-live="polite">
          {open ? "Press Esc, or click the desktop, to close" : "Click the island to open it"}
        </p>
      </div>

      <div className="chips" role="group" aria-label="Show the island in a state">
        {CHIPS.map((c) => {
          const active = c.id === "tour" ? touring : !touring && mode === c.id;
          return (
            <button
              key={c.id}
              type="button"
              className={`chip${active ? " chip-on" : ""}`}
              aria-pressed={active}
              onClick={() => choose(c.id)}
            >
              {c.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

type DashProps = {
  tab: Tab;
  setTab: (t: Tab) => void;
  sec: number;
  running: boolean;
  toggleRunning: () => void;
  playing: boolean;
  togglePlaying: () => void;
  volume: number;
  setVolume: (v: number) => void;
  seek: number;
  setSeek: (v: number) => void;
  now: string;
  messages: { id: number; who: string; text: string }[];
  dismiss: (id: number) => void;
};

const TABS: { id: Tab; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "music", label: "Music" },
  { id: "timer", label: "Timer" },
  { id: "messages", label: "Messages" },
];

function Dashboard(p: DashProps) {
  return (
    <div className="dash">
      <div className="dash-tabs" role="tablist" aria-label="Island dashboard">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={p.tab === t.id}
            className={`dash-tab${p.tab === t.id ? " dash-tab-on" : ""}`}
            onClick={() => p.setTab(t.id)}
          >
            {t.label}
            {t.id === "messages" && p.messages.length > 0 && <b className="badge">{p.messages.length}</b>}
          </button>
        ))}
      </div>

      <div className="dash-card" role="tabpanel">
        {p.tab === "home" && <HomeCard {...p} />}
        {p.tab === "music" && <MusicCard {...p} />}
        {p.tab === "timer" && <TimerCard {...p} />}
        {p.tab === "messages" && <MessagesCard {...p} />}
      </div>
    </div>
  );
}

function HomeCard({ now, playing, togglePlaying }: DashProps) {
  return (
    <div className="home">
      <div className="home-clock">
        <span className="home-time">{now || "00:00"}</span>
        <span className="home-sub">Sunday</span>
      </div>
      <div className="home-battery">
        <Ring progress={0.64} size={46} stroke={5} />
        <span>64%</span>
      </div>
      <button type="button" className="home-music" onClick={togglePlaying} aria-label={playing ? "Pause" : "Play"}>
        <Art size={36} />
        <span className="home-music-t">
          <strong>{TRACK.title}</strong>
          <span>{playing ? "Playing" : "Paused"}</span>
        </span>
        <PlayGlyph playing={playing} />
      </button>
    </div>
  );
}

function MusicCard({ playing, togglePlaying, volume, setVolume, seek, setSeek }: DashProps) {
  return (
    <div className="mcard">
      <Art size={84} />
      <div className="mcard-main">
        <div className="mcard-meta">
          <strong>{TRACK.title}</strong>
          <span>{TRACK.artist}</span>
        </div>
        <Slider label="Seek" value={seek} onChange={setSeek} />
        <div className="mcard-controls">
          <button type="button" className="ctl" aria-label="Previous track">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h2v14H6zM20 5v14L9.5 12z" /></svg>
          </button>
          <button type="button" className="ctl ctl-main" aria-label={playing ? "Pause" : "Play"} onClick={togglePlaying}>
            <PlayGlyph playing={playing} />
          </button>
          <button type="button" className="ctl" aria-label="Next track">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 5h2v14h-2zM4 5l10.5 7L4 19z" /></svg>
          </button>
          <span className="mcard-vol">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9zm12.5 3a4 4 0 0 0-2-3.5v7a4 4 0 0 0 2-3.5z" /></svg>
            <Slider label="Volume" value={volume} onChange={setVolume} />
          </span>
        </div>
      </div>
    </div>
  );
}

function TimerCard({ sec, running, toggleRunning }: DashProps) {
  return (
    <div className="tcard">
      <div className="tcard-ring">
        <Ring progress={sec / TIMER_TOTAL} size={96} stroke={8} />
        <span className="tcard-time">{fmt(sec)}</span>
      </div>
      <div className="tcard-side">
        <strong>Tea</strong>
        <span>5 minute countdown</span>
        <button type="button" className="btn-mini" onClick={toggleRunning}>
          {running ? "Pause" : "Resume"}
        </button>
      </div>
    </div>
  );
}

function MessagesCard({ messages, dismiss }: DashProps) {
  if (messages.length === 0) {
    return (
      <div className="empty">
        <strong>No new messages</strong>
        <span>New notifications from your apps will show up here.</span>
      </div>
    );
  }
  return (
    <ul className="msgs">
      {messages.map((m) => (
        <li key={m.id}>
          <ChatIcon size={28} />
          <div className="msgs-t">
            <strong>{m.who}</strong>
            <span>{m.text}</span>
          </div>
          <button type="button" className="x" aria-label={`Dismiss message from ${m.who}`} onClick={() => dismiss(m.id)}>
            <svg width="12" height="12" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </li>
      ))}
    </ul>
  );
}

function PlayGlyph({ playing }: { playing: boolean }) {
  return playing ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /></svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
  );
}

function Slider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <input
      className="slider"
      type="range"
      min={0}
      max={100}
      value={value}
      aria-label={label}
      style={{ "--v": `${value}%` } as React.CSSProperties}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  );
}

