/** Constrained deposition conversation: four rounds, no em dashes. */

export const DEPOSITION_STEPS = 4;

const MAX_QUOTE = 100;

function clipAnswer(s: string, max: number): string {
  const t = s.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max).trimEnd()}…`;
}

/**
 * @param completedRounds How many Q/A turns are already on the record (0 before first answer, then 1, 2, 3).
 * Returns the acknowledgement and follow-up for the *next* round, or null when the last round was just finished at the call site.
 */
export function getAckAndFollowUp(
  completedRounds: number,
  lastAnswer: string,
): { ack: string; question: string } | null {
  const p = clipAnswer(lastAnswer, MAX_QUOTE);
  if (completedRounds === 1) {
    return {
      ack: `I have that in the record. You wrote: ${p}`,
      question: `When you name the initiative to demote, what is the single leading indicator you track weekly, and who owns the readout?`,
    };
  }
  if (completedRounds === 2) {
    return {
      ack: `Thanks. You drew the line at: ${p}`,
      question: `If the indicator moved against you for two consecutive weeks, what is the first action you take, and what do you explicitly not do?`,
    };
  }
  if (completedRounds === 3) {
    return {
      ack: `Noted. You framed the constraint as: ${p}`,
      question: `Last pass. In one sentence, what is one truth about your model that a hostile review would be forced to concede?`,
    };
  }
  return null;
}

export function makeAnswerSnippet(s: string, max = 140): string {
  return clipAnswer(s, max);
}
