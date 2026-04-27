"use client";

import { animate, motion } from "framer-motion";
import { ParentSize } from "@visx/responsive";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useDiagnosticFocus } from "@/context/DiagnosticFocusContext";
import {
  ADAPTIVE,
  AXES,
  NATURAL,
  performanceGap,
  pointOnAxis,
  polygonPathD,
  verdictLeadAndRest,
  type GapAnalysis,
} from "@/lib/identityRadarModel";
import { cn } from "@/lib/cn";

export function IdentityRadar({
  auditPercent = 40,
  showPanel = true,
}: {
  auditPercent?: number;
  showPanel?: boolean;
}) {
  const uid = useId().replace(/:/g, "");
  const [revealPulse, setRevealPulse] = useState(false);
  const [progress, setProgress] = useState(0);

  const {
    setLeadAxis,
    setHoverAxis,
    clearHoverDebounced,
    hoverAxis,
    radarLedgerPulseTick,
    youLedgerActiveRatio,
  } = useDiagnosticFocus();

  const adaptivePolygonValues = useMemo(() => {
    const r = Math.min(1, Math.max(0, youLedgerActiveRatio));
    const center = 0.52;
    return ADAPTIVE.map((v) => v * r + (1 - r) * center);
  }, [youLedgerActiveRatio]);

  const ledgerPulseRef = useRef(0);
  useEffect(() => {
    if (radarLedgerPulseTick === 0) return;
    if (radarLedgerPulseTick === ledgerPulseRef.current) return;
    ledgerPulseRef.current = radarLedgerPulseTick;
    setRevealPulse(true);
    const id = window.setTimeout(() => setRevealPulse(false), 850);
    return () => clearTimeout(id);
  }, [radarLedgerPulseTick]);

  useEffect(() => {
    const ctrl = animate(0, 1, {
      type: "spring",
      stiffness: 118,
      damping: 15,
      mass: 0.85,
      onUpdate: (v) => setProgress(v),
    });
    return () => ctrl.stop();
  }, []);

  const gap = useMemo(() => performanceGap(), []);
  const verdictParts = useMemo(() => verdictLeadAndRest(gap), [gap]);

  const labelFocusIndex = useMemo(() => {
    if (!hoverAxis) return gap.index;
    const i = (AXES as readonly string[]).indexOf(hoverAxis);
    return i >= 0 ? i : gap.index;
  }, [hoverAxis, gap.index]);

  useEffect(() => {
    setLeadAxis(gap.axis);
  }, [gap.axis, setLeadAxis]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex h-full min-h-0 flex-col gap-1 text-left"
    >
      <div className="relative h-[min(340px,72vw)] w-full max-w-[460px]">
        <div className="absolute inset-0 overflow-hidden">
          <ParentSize>
            {({ width, height }) =>
              width > 0 && height > 0 ? (
                <RadarCanvas
                  width={width}
                  height={height}
                  progress={progress}
                  gap={gap}
                  gradSuffix={uid}
                  labelFocusIndex={labelFocusIndex}
                  setHoverAxis={setHoverAxis}
                  clearHoverDebounced={clearHoverDebounced}
                  revealPulse={revealPulse}
                  adaptivePolygonValues={adaptivePolygonValues}
                />
              ) : null
            }
          </ParentSize>
        </div>
      </div>

      {showPanel ? (
        <div className="flex flex-col gap-3 pt-2">
          <div>
            <p className="label-card m-0">{gap.axis}</p>
            <p className="inter-sm m-0 mt-1">
              Performance gap · Δ {gap.delta.toFixed(2)} ·{" "}
              {gap.naturalHigher ? "Natural above adaptive" : "Adaptive above natural"}
            </p>
          </div>
          <div className="border-t border-[var(--color-border)] pt-4">
            <p className="label-card m-0 mb-2">{"Auditor's verdict"}</p>
            <p
              className="m-0 text-[13px] leading-relaxed"
              style={{ fontFamily: "var(--font-sans)", color: "var(--color-primary)" }}
            >
              <span style={{ fontWeight: 600 }}>{verdictParts.lead}</span>
              <span style={{ fontWeight: 300 }}>{verdictParts.rest}</span>
            </p>
          </div>
        </div>
      ) : null}
    </motion.div>
  );
}

const AXIS_LABELS: Record<string, string> = {
  Conscientiousness: "CONSC.",
  Steadiness: "STEADY",
};

function axisDisplayLabel(name: string): string {
  return AXIS_LABELS[name] ?? name.toUpperCase();
}

const RING_RADII = [1, 0.75, 0.5, 0.25] as const;
const RING_STROKES = ["#E8E8E8", "#ECECEC", "#F0F0F0", "#F4F4F4"] as const;

function RadarCanvas({
  width,
  height,
  progress,
  gap,
  gradSuffix,
  labelFocusIndex,
  setHoverAxis,
  clearHoverDebounced,
  revealPulse,
  adaptivePolygonValues,
}: {
  width: number;
  height: number;
  progress: number;
  gap: GapAnalysis;
  gradSuffix: string;
  labelFocusIndex: number;
  setHoverAxis: (axis: string | null) => void;
  clearHoverDebounced: () => void;
  revealPulse: boolean;
  adaptivePolygonValues: readonly number[];
}) {
  const cx = width / 2;
  const cy = height / 2;
  const maxR = Math.min(width, height) * 0.36;
  const n = AXES.length;

  const gradId = `dv-grad-${gradSuffix}`;
  const haloId = `dv-halo-${gradSuffix}`;
  const amberHaloId = `dv-halo-amber-${gradSuffix}`;

  const adaptiveD = polygonPathD(cx, cy, adaptivePolygonValues, maxR, progress);

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Identity radar posture analysis"
      onPointerLeave={(e) => {
        const rt = e.relatedTarget;
        if (!(rt instanceof Node) || !e.currentTarget.contains(rt)) {
          clearHoverDebounced();
        }
      }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0071E3" />
          <stop offset="100%" stopColor="#30D158" />
        </linearGradient>
        <radialGradient id={haloId}>
          <stop offset="0%" stopColor="rgba(0,113,227,0.10)" />
          <stop offset="100%" stopColor="rgba(0,113,227,0)" />
        </radialGradient>
        <radialGradient id={amberHaloId}>
          <stop offset="0%" stopColor="rgba(255,159,10,0.10)" />
          <stop offset="100%" stopColor="rgba(255,159,10,0)" />
        </radialGradient>
      </defs>

      {/* Guide rings */}
      {RING_RADII.map((t, i) => (
        <circle
          key={t}
          cx={cx}
          cy={cy}
          r={t * maxR}
          fill="none"
          stroke={RING_STROKES[i]}
          strokeWidth={0.5}
          vectorEffect="non-scaling-stroke"
        />
      ))}

      {/* Spokes */}
      {AXES.map((_, i) => {
        const outer = pointOnAxis(cx, cy, maxR, i, n);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={outer.x}
            y2={outer.y}
            stroke="#F0F0F0"
            strokeWidth={0.5}
            vectorEffect="non-scaling-stroke"
          />
        );
      })}

      {/* Axis labels */}
      {AXES.map((label, i) => {
        const labelPos = pointOnAxis(cx, cy, maxR + 26, i, n);
        const isFlagged = i === gap.index;
        const isFocused = i === labelFocusIndex && !isFlagged;
        const fill = isFlagged ? "#FF9F0A" : isFocused ? "#0071E3" : "#86868B";
        return (
          <g key={label}>
            <text
              x={labelPos.x}
              y={labelPos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              pointerEvents="none"
              fill={fill}
              style={{
                fontFamily: "var(--font-sans), -apple-system, sans-serif",
                fontSize: 11,
                fontWeight: isFlagged || isFocused ? 500 : 400,
                letterSpacing: "0.05em",
              }}
            >
              {axisDisplayLabel(label)}
            </text>
            <circle
              cx={labelPos.x}
              cy={labelPos.y}
              r={22}
              fill="transparent"
              pointerEvents="all"
              style={{ cursor: "default" }}
              onPointerEnter={() => setHoverAxis(label)}
            >
              <title>{label}</title>
            </circle>
          </g>
        );
      })}

      {/* Data polygon — gradient fill + stroke */}
      <g className={cn(revealPulse && "identity-radar-cyan-reveal-pulse")}>
        <path
          d={adaptiveD}
          fill={`url(#${gradId})`}
          fillOpacity={0.08}
          stroke={`url(#${gradId})`}
          strokeWidth={1}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </g>

      {/* Natural trace — ghost reference */}
      <path
        d={polygonPathD(cx, cy, NATURAL, maxR, progress)}
        fill="none"
        stroke="#D2D2D7"
        strokeWidth={0.5}
        strokeDasharray="3 3"
        strokeOpacity={0.6}
        vectorEffect="non-scaling-stroke"
      />

      {/* Nodes at each axis vertex */}
      {AXES.map((_, i) => {
        const pt = pointOnAxis(
          cx,
          cy,
          adaptivePolygonValues[i] * maxR * progress,
          i,
          n,
        );
        const isFlagged = i === gap.index;
        const isStrong = !isFlagged && adaptivePolygonValues[i] > 0.65;

        if (isFlagged) {
          return (
            <g key={i}>
              <circle cx={pt.x} cy={pt.y} r={10} fill={`url(#${amberHaloId})`} />
              <circle cx={pt.x} cy={pt.y} r={3.5} fill="#FF9F0A" />
            </g>
          );
        }
        if (isStrong) {
          return (
            <g key={i}>
              <circle cx={pt.x} cy={pt.y} r={12} fill={`url(#${haloId})`} />
              <circle cx={pt.x} cy={pt.y} r={4} fill={`url(#${gradId})`} />
            </g>
          );
        }
        return <circle key={i} cx={pt.x} cy={pt.y} r={2.5} fill="#D2D2D7" />;
      })}
    </svg>
  );
}
