/**
 * Public-safe riddles for Riddle Relay. Each riddle lists acceptable answers
 * (matched case-insensitively, trimmed, with a leading article ignored). No
 * personal questions — pure wordplay.
 */
export interface Riddle {
  id: string;
  prompt: string;
  answers: string[];
}

export const RIDDLES: Riddle[] = [
  {
    id: "echo",
    prompt:
      "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
    answers: ["echo"],
  },
  {
    id: "footsteps",
    prompt: "The more you take, the more you leave behind. What am I?",
    answers: ["footsteps", "footprints", "steps"],
  },
  {
    id: "piano",
    prompt: "What has keys but opens no locks?",
    answers: ["piano", "keyboard"],
  },
  {
    id: "clock",
    prompt: "What has hands but cannot clap?",
    answers: ["clock"],
  },
  {
    id: "towel",
    prompt: "What gets wetter the more it dries?",
    answers: ["towel"],
  },
  {
    id: "coin",
    prompt: "What has a head and a tail but no body?",
    answers: ["coin"],
  },
  {
    id: "comb",
    prompt: "What has many teeth but cannot bite?",
    answers: ["comb"],
  },
  {
    id: "age",
    prompt: "What goes up but never comes down?",
    answers: ["age"],
  },
  {
    id: "needle",
    prompt: "What has an eye but cannot see?",
    answers: ["needle"],
  },
  {
    id: "candle",
    prompt:
      "I am tall when I am young, and I am short when I am old. What am I?",
    answers: ["candle"],
  },
];
