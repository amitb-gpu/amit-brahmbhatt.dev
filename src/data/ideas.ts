export interface Idea {
  title: string;
  description: string;
  status: "exploring" | "building" | "shelved";
}

// Seed ideas — edit freely, these are just starters.
export const ideas: Idea[] = [
  {
    title: "Daily options-income dashboard",
    description:
      "Track covered-call / cash-secured-put income against a $50–100/day target, with Greeks and assignment risk at a glance.",
    status: "exploring",
  },
  {
    title: "MARA wheel tracker",
    description:
      "A small tool to manage a wheel strategy on MARA: position state, premium collected, and roll/hold/close decisions.",
    status: "exploring",
  },
];
