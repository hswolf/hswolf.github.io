import type { Deck } from "./types";
import { n5Lesson12C } from "./n5-lesson12-c";
import { n5Lesson15Part1 } from "./n5-lesson15-1";
import { n5Lesson15Part6 } from "./n5-lesson15-6";

export type { Deck, FlashCard } from "./types";

export const decks: Deck[] = [n5Lesson12C, n5Lesson15Part1, n5Lesson15Part6];

export function getDeckBySlug(slug: string): Deck | undefined {
  return decks.find((d) => d.slug === slug);
}
