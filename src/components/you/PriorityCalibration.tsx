"use client";

import {
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "framer-motion";

const LEFT = {
  title: "Scope expansion",
  subtitle: "Own a larger surface area; fewer handoffs.",
} as const;
const RIGHT = {
  title: "Craft depth",
  subtitle: "Sharpen execution quality on the core lane.",
} as const;

export function PriorityCalibration() {
  const raw = useMotionValue(50);

  const leftStrength = useTransform(raw, [0, 100], [1, 0.22]);
  const rightStrength = useTransform(raw, [0, 100], [0.22, 1]);

  const leftGlow = useTransform(
    leftStrength,
    (v) => `0 0 0 1px rgba(6, 182, 212, ${0.12 + v * 0.55})`,
  );
  const rightGlow = useTransform(
    rightStrength,
    (v) => `0 0 0 1px rgba(15, 23, 42, ${0.08 + v * 0.22})`,
  );

  const leftBg = useTransform(
    leftStrength,
    (v) => `rgba(255,255,255,${0.35 + v * 0.45})`,
  );
  const rightBg = useTransform(
    rightStrength,
    (v) => `rgba(255,255,255,${0.35 + v * 0.45})`,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <GoalCard
          title={LEFT.title}
          subtitle={LEFT.subtitle}
          emphasis={leftStrength}
          borderGlow={leftGlow}
          panelBg={leftBg}
          accent="cyan"
        />
        <GoalCard
          title={RIGHT.title}
          subtitle={RIGHT.subtitle}
          emphasis={rightStrength}
          borderGlow={rightGlow}
          panelBg={rightBg}
          accent="slate"
        />
      </div>

      <div className="glass-overlay rounded-none p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mono-label text-[var(--color-secondary)]">
              pairwise weight
            </p>
            <p className="mt-2 text-sm font-normal text-[var(--color-secondary)]">
              Slide to calibrate urgency. The opposing card dims; the active card
              picks up tension and glow.
            </p>
          </div>
          <div className="w-full md:max-w-md">
            <div className="flex items-center justify-between pb-2">
              <span className="mono-label text-[12px] text-[var(--color-blue)]">
                {LEFT.title}
              </span>
              <span className="mono-label text-[12px] text-[var(--color-secondary)]">
                {RIGHT.title}
              </span>
            </div>
            <div className="relative min-h-[28px]">
              <input
                type="range"
                min={0}
                max={100}
                defaultValue={50}
                className="priority-slider absolute inset-0 w-full cursor-pointer"
                aria-label="Priority calibration between goals"
                onChange={(e) => raw.set(Number(e.target.value))}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function GoalCard({
  title,
  subtitle,
  emphasis,
  borderGlow,
  panelBg,
  accent,
}: {
  title: string;
  subtitle: string;
  emphasis: MotionValue<number>;
  borderGlow: MotionValue<string>;
  panelBg: MotionValue<string>;
  accent: "cyan" | "slate";
}) {
  return (
    <motion.div
      style={{
        boxShadow: borderGlow,
        backgroundColor: panelBg,
      }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.995 }}
      transition={{ type: "spring", stiffness: 520, damping: 34 }}
      className="rounded-none border border-[var(--color-border)] p-5"
    >
      <motion.div style={{ opacity: emphasis }}>
        <span
          className={
            accent === "cyan"
              ? "mono-label text-[var(--color-blue)]"
              : "mono-label text-[var(--color-secondary)]"
          }
        >
          goal
        </span>
        <h3 className="mt-3 text-base font-bold tracking-tight text-[var(--color-primary)]">
          {title}
        </h3>
        <p className="mt-2 text-sm font-normal leading-relaxed text-[var(--color-secondary)]">
          {subtitle}
        </p>
      </motion.div>
    </motion.div>
  );
}
