export type PaceAnswer = "immediate" | "analyze";
export type PriorityAnswer = "logic" | "morale";

export type PersonalityAnswers = {
  pace: PaceAnswer;
  priority: PriorityAnswer;
};

export type DiscQuadrant = "D" | "I" | "S" | "C";

export function computeDiscVerdict(answers: PersonalityAnswers): {
  quadrant: DiscQuadrant;
  verdictLine: string;
} {
  const { pace, priority } = answers;
  if (pace === "immediate" && priority === "morale") {
    return {
      quadrant: "I",
      verdictLine:
        "You are an Initiator (High-Pace, People-Oriented). You likely excel at rallying teams around new ideas.",
    };
  }
  if (pace === "immediate" && priority === "logic") {
    return {
      quadrant: "D",
      verdictLine:
        "You are a Driver (High-Pace, Task-Oriented). You likely excel at cutting through ambiguity to ship decisive outcomes.",
    };
  }
  if (pace === "analyze" && priority === "logic") {
    return {
      quadrant: "C",
      verdictLine:
        "You are an Analyst (Deliberate, Task-Oriented). You likely excel at structuring analysis that holds under executive scrutiny.",
    };
  }
  return {
    quadrant: "S",
    verdictLine:
      "You are a Steady Partner (Deliberate, People-Oriented). You likely excel at sustaining alignment when pressure runs high.",
  };
}
