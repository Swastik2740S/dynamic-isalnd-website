// A damped harmonic oscillator with SwiftUI style parameters
// (response in seconds, damping as a fraction of critical damping).
// Same model the Windows app uses, integrated in fixed 1/480 s steps.

export type SpringParams = { response: number; damping: number };

export const EXPAND: SpringParams = { response: 0.4, damping: 0.74 };
export const COLLAPSE: SpringParams = { response: 0.3, damping: 1 };

const STEP = 1 / 480;

export class Spring {
  value: number;
  target: number;
  velocity = 0;

  constructor(value: number) {
    this.value = value;
    this.target = value;
  }

  step(dt: number, p: SpringParams) {
    const w = (2 * Math.PI) / p.response;
    const k = w * w;
    const c = 2 * p.damping * w;
    let remaining = Math.min(dt, 0.1);
    while (remaining > 1e-9) {
      const s = Math.min(STEP, remaining);
      const a = -k * (this.value - this.target) - c * this.velocity;
      this.velocity += a * s;
      this.value += this.velocity * s;
      remaining -= s;
    }
  }

  get resting() {
    return Math.abs(this.velocity) < 0.02 && Math.abs(this.value - this.target) < 0.02;
  }

  snap() {
    this.value = this.target;
    this.velocity = 0;
  }
}

export type Sample = { t: number; x: number };

/** Step response from 0 to 1, sampled about every 1/60 s. */
export function stepResponse(p: SpringParams, seconds = 1.2): Sample[] {
  const s = new Spring(0);
  s.target = 1;
  const out: Sample[] = [{ t: 0, x: 0 }];
  const perSample = 8;
  const total = Math.round(seconds / STEP);
  for (let i = 1; i <= total; i++) {
    s.step(STEP, p);
    if (i % perSample === 0) out.push({ t: i * STEP, x: s.value });
  }
  return out;
}

export function metrics(samples: Sample[]) {
  let peak = 0;
  let lastOutside = 0;
  for (const { t, x } of samples) {
    if (x > peak) peak = x;
    if (Math.abs(x - 1) > 0.02) lastOutside = t;
  }
  const last = samples[samples.length - 1].t;
  return {
    overshoot: Math.max(0, peak - 1) * 100,
    settleMs: lastOutside >= last - 0.02 ? null : Math.round((lastOutside + 1 / 60) * 1000),
  };
}
