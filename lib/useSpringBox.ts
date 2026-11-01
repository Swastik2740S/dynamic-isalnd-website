"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { COLLAPSE, EXPAND, Spring, type SpringParams } from "./spring";

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export type Box = { w: number; h: number; r?: number; y?: number };

type Group = { w: Spring; h: Spring; r: Spring; y: Spring };

/**
 * Drives width, height, corner radius and vertical offset of an element with
 * springs. Retargeting mid flight keeps velocity. No React state per frame,
 * and the animation frame loop stops as soon as every spring rests.
 */
export function useSpringBox(
  box: Box,
  opts?: { grow?: SpringParams; shrink?: SpringParams },
) {
  const ref = useRef<HTMLDivElement>(null);
  const springs = useRef<Group | null>(null);
  const raf = useRef(0);
  const last = useRef(0);
  const params = useRef<SpringParams>(EXPAND);
  const reduced = useRef(false);

  const paint = () => {
    const el = ref.current;
    const s = springs.current;
    if (!el || !s) return;
    el.style.width = `${Math.max(0, s.w.value)}px`;
    el.style.height = `${Math.max(0, s.h.value)}px`;
    el.style.borderRadius = `${Math.max(0, s.r.value)}px`;
    el.style.transform = `translateY(${s.y.value}px)`;
  };

  const frame = (now: number) => {
    const s = springs.current;
    if (!s) return;
    const dt = (now - last.current) / 1000;
    last.current = now;
    const all = [s.w, s.h, s.r, s.y];
    all.forEach((sp) => sp.step(dt, params.current));
    if (all.every((sp) => sp.resting)) {
      all.forEach((sp) => sp.snap());
      paint();
      raf.current = 0;
      return;
    }
    paint();
    raf.current = requestAnimationFrame(frame);
  };

  useIso(() => {
    const r = box.r ?? Math.min(box.h / 2, 32);
    const y = box.y ?? 0;

    if (!springs.current) {
      springs.current = {
        w: new Spring(box.w),
        h: new Spring(box.h),
        r: new Spring(r),
        y: new Spring(y),
      };
      reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      paint();
      return;
    }

    const s = springs.current;
    const grow = box.w * box.h >= s.w.target * s.h.target;
    params.current = grow ? (opts?.grow ?? EXPAND) : (opts?.shrink ?? COLLAPSE);
    s.w.target = box.w;
    s.h.target = box.h;
    s.r.target = r;
    s.y.target = y;

    if (reduced.current) {
      [s.w, s.h, s.r, s.y].forEach((sp) => sp.snap());
      paint();
      return;
    }
    if (!raf.current) {
      last.current = performance.now();
      raf.current = requestAnimationFrame(frame);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [box.w, box.h, box.r, box.y]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  return ref;
}
