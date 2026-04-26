/** Pure identity radar math and copy (no React). */

export const AXES = [
  "Dominance",
  "Influence",
  "Steadiness",
  "Conscientiousness",
  "Agility",
  "Pace",
  "Priority",
  "Empathy",
] as const;

export const NATURAL = [0.78, 0.62, 0.71, 0.85, 0.58, 0.72, 0.69, 0.81] as const;
export const ADAPTIVE = [0.65, 0.74, 0.64, 0.79, 0.71, 0.55, 0.82, 0.68] as const;

export const RING_STOPS = [0.2, 0.4, 0.6, 0.8, 1] as const;

export type GapAnalysis = {
  index: number;
  axis: (typeof AXES)[number];
  delta: number;
  nat: number;
  ada: number;
  naturalHigher: boolean;
};

export function angleForIndex(i: number, n: number) {
  return (-90 * Math.PI) / 180 + (i * 2 * Math.PI) / n;
}

export function pointOnAxis(cx: number, cy: number, radius: number, i: number, n: number) {
  const a = angleForIndex(i, n);
  return { x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a) };
}

export function polygonPathD(
  cx: number,
  cy: number,
  values: readonly number[],
  maxR: number,
  progress: number,
) {
  const n = values.length;
  const pts = values.map((v, i) => {
    const a = angleForIndex(i, n);
    const r = v * maxR * progress;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  });
  return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";
}

export function axisRadarLabel(name: (typeof AXES)[number]): string {
  return name === "Pace" ? "PACE" : name.toUpperCase();
}

export function performanceGap(): GapAnalysis {
  let bestI = 0;
  let bestD = 0;
  for (let i = 0; i < AXES.length; i++) {
    const d = Math.abs(NATURAL[i] - ADAPTIVE[i]);
    if (d > bestD) {
      bestD = d;
      bestI = i;
    }
  }
  const nat = NATURAL[bestI];
  const ada = ADAPTIVE[bestI];
  return {
    index: bestI,
    axis: AXES[bestI],
    delta: bestD,
    nat,
    ada,
    naturalHigher: nat > ada,
  };
}

export function verdictLeadAndRest(g: GapAnalysis): { lead: string; rest: string } {
  const d = g.delta.toFixed(2);
  const up = g.naturalHigher ? "Natural" : "Adaptive";
  const down = g.naturalHigher ? "Adaptive" : "Natural";

  if (g.axis === "Pace" && g.naturalHigher) {
    return {
      lead: `Natural Pace is ${d} higher than Adaptive.`,
      rest: " You are consciously decelerating innate decision speed to align with organizational drag. Executive velocity is discounted versus your baseline. High exposure to strategic boredom and downstream calibration error if the role is priced for pace.",
    };
  }
  if (g.axis === "Pace" && !g.naturalHigher) {
    return {
      lead: `Adaptive Pace is ${d} higher than Natural.`,
      rest: " You are overclocking delivery cadence relative to baseline. That can clear short-term blockers, and it raises renewal risk if quality gates or stakeholder alignment cannot hold at this executive velocity.",
    };
  }
  if (g.axis === "Priority") {
    return {
      lead: `${up} Priority exceeds ${down} by ${d}.`,
      rest: " Trade sequencing is mis-stated versus the sovereign record: either you are absorbing scope without a commensurate mandate, or you are signaling deprioritization the org will misread as disengagement. Fix the incentive line before the next review cycle.",
    };
  }
  if (g.axis === "Dominance" || g.axis === "Influence") {
    return {
      lead: `${up} ${g.axis} leads ${down} by ${d}.`,
      rest: " Power and persuasion are not aligned with your shadow trace. That is a political calibration error: you are either buying harmony you cannot afford, or you are forcing control you have not formalized. Close the gap in writing, not in meetings.",
    };
  }
  if (g.axis === "Conscientiousness" || g.axis === "Steadiness") {
    return {
      lead: `${up} ${g.axis} exceeds ${down} by ${d}.`,
      rest: " Operating rigor versus stability is off baseline. If this is deliberate, document the cost (time, throughput, or risk) or finance will treat it as variance without a line item.",
    };
  }
  if (g.axis === "Agility") {
    return {
      lead: `${up} Agility leads ${down} by ${d}.`,
      rest: " Context-switching is elevated versus baseline. That reads as responsiveness until it registers as unreliability on fixed commitments. Cut one parallel thread or convert it to a dated exit.",
    };
  }
  if (g.axis === "Empathy") {
    return {
      lead: `${up} Empathy exceeds ${down} by ${d}.`,
      rest: " Coalition load is mis-weighted versus delivery proof. Empathy without boundary is a liability in commercial seats: you are buying goodwill that will not convert to budget.",
    };
  }
  return {
    lead: `${up} ${g.axis} is ${d} above ${down}.`,
    rest: " Largest calibration error on this scan. Reconcile the delta against role expectations, governance cadence, and what you are willing to have attributed to you on paper.",
  };
}
