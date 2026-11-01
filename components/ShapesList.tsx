import { IdleView, MusicView, PeekView, StaticPill, ToastView, Art, Ring } from "./IslandViews";

const SHAPES = [
  {
    name: "Idle",
    text: "A small black capsule. Nothing is happening, so nothing is drawn.",
    pill: (
      <StaticPill w={124} h={34} label="Idle pill">
        <IdleView />
      </StaticPill>
    ),
  },
  {
    name: "Compact",
    text: "Music or a timer is live. Album art sits on the left and a waveform on the right, driven by the real audio level and tinted with the artwork.",
    pill: (
      <StaticPill w={268} h={40} label="Compact pill with music">
        <MusicView />
      </StaticPill>
    ),
  },
  {
    name: "Toast",
    text: "The charger goes in, the battery runs low, your headphones connect. A short pop, then it settles back.",
    pill: (
      <StaticPill w={268} h={44} label="Toast pill for the charger">
        <ToastView />
      </StaticPill>
    ),
  },
  {
    name: "Peek",
    text: "A message arrives. The pill stretches to show the app icon, sender and preview, keeps your album art on the left, then shrinks into a bubble beside the island.",
    pill: (
      <StaticPill w={356} h={60} label="Peek pill showing a message">
        <PeekView />
      </StaticPill>
    ),
  },
  {
    name: "Dashboard",
    text: "Click the island. A row of tabs sits on top: Home, Music, Timer, one tab per app with waiting notifications, and Settings. One card shows at a time and the island springs to fit it.",
    pill: (
      <StaticPill w={440} h={96} label="Dashboard preview">
        <div className="mini-dash">
          <Art size={56} />
          <div className="mini-dash-t">
            <strong>Slow Tide</strong>
            <span>Harbor Lights</span>
          </div>
          <Ring progress={0.62} size={44} stroke={5} />
        </div>
      </StaticPill>
    ),
  },
];

export function ShapesList() {
  return (
    <ol className="shapes">
      {SHAPES.map((s) => (
        <li key={s.name} className="shape">
          <div className="shape-stage">{s.pill}</div>
          <div className="shape-copy">
            <h3>{s.name}</h3>
            <p>{s.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
