"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSpringBox } from "@/lib/useSpringBox";

type Policy = "tuck" | "top";

const TABS = ["Inbox", "Docs", "Roadmap", "Reviews"];

export function TuckDemo() {
  const [policy, setPolicy] = useState<Policy>("tuck");
  const [revealed, setRevealed] = useState(false);
  const [active, setActive] = useState(0);
  const [blocked, setBlocked] = useState(false);
  const revealT = useRef<number | undefined>(undefined);
  const hideT = useRef<number | undefined>(undefined);
  const frameRef = useRef<HTMLDivElement>(null);

  const tucked = policy === "tuck" && !revealed;

  const box = useMemo(
    () => (tucked ? { w: 96, h: 4, r: 2, y: 0 } : { w: 124, h: 34, y: 8 }),
    [tucked],
  );
  const pillRef = useSpringBox(box);

  useEffect(() => {
    setRevealed(false);
    setBlocked(false);
    window.clearTimeout(revealT.current);
    window.clearTimeout(hideT.current);
  }, [policy]);

  useEffect(
    () => () => {
      window.clearTimeout(revealT.current);
      window.clearTimeout(hideT.current);
    },
    [],
  );

  /* Hold the pointer at the top edge over the island's spot for 0.4 s to bring it back.
     Leave and it tucks again after 0.7 s. A quick tab click never triggers it. */
  const onMove = (e: React.PointerEvent) => {
    if (policy !== "tuck") return;
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = e.clientX - rect.left - rect.width / 2;
    const py = e.clientY - rect.top;
    const inside = Math.abs(px) < 80 && py < (revealed ? 48 : 22);
    if (inside) {
      window.clearTimeout(hideT.current);
      hideT.current = undefined;
      if (!revealed && revealT.current === undefined) {
        revealT.current = window.setTimeout(() => {
          setRevealed(true);
          revealT.current = undefined;
        }, 400);
      }
    } else {
      window.clearTimeout(revealT.current);
      revealT.current = undefined;
      if (revealed && hideT.current === undefined) {
        hideT.current = window.setTimeout(() => {
          setRevealed(false);
          hideT.current = undefined;
        }, 700);
      }
    }
  };

  return (
    <div className="tuck">
      <div className="tuck-switch" role="group" aria-label="When a window is under the island">
        <button type="button" className={`chip${policy === "tuck" ? " chip-on" : ""}`} aria-pressed={policy === "tuck"} onClick={() => setPolicy("tuck")}>
          Tuck away
        </button>
        <button type="button" className={`chip${policy === "top" ? " chip-on" : ""}`} aria-pressed={policy === "top"} onClick={() => setPolicy("top")}>
          Stay on top
        </button>
      </div>

      <div className="tuck-frame" ref={frameRef} onPointerMove={onMove} onPointerLeave={() => policy === "tuck" && revealed && setRevealed(false)}>
        <div className="tuck-chrome">
          <div className="tuck-tabs" role="tablist" aria-label="Browser tabs">
            {TABS.map((t, i) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={active === i}
                className={`tuck-tab${active === i ? " tuck-tab-on" : ""}`}
                onClick={() => {
                  setActive(i);
                  setBlocked(false);
                }}
              >
                {t}
              </button>
            ))}
          </div>
          <span className="tuck-win" aria-hidden="true">
            <i /> <i /> <i />
          </span>
        </div>
        <div className="tuck-page" aria-hidden="true">
          <b />
          <i />
          <i />
          <i className="short" />
        </div>

        <div
          ref={pillRef}
          className={`pill pill-tuck${tucked ? " pill-click-through" : ""}`}
          onClick={() => setBlocked(true)}
          aria-hidden="true"
        />
        {policy === "top" && blocked && <p className="tuck-note" role="status">The island is in the way of the Docs and Roadmap tabs.</p>}
        {policy === "tuck" && !blocked && <p className="tuck-note" role="status">{revealed ? "Island is back. Move away and it tucks again." : "Click any tab. Hold the pointer at the top center to bring the island back."}</p>}
      </div>
    </div>
  );
}
