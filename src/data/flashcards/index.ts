import type { Deck } from "./types";
import { n5Lesson12C } from "./n5-lesson12-c";
import { n5Lesson15Part1 } from "./n5-lesson15-1";
import { n5Lesson15Part6 } from "./n5-lesson15-6";
import { n5Lesson16 } from "./n5-lesson16";
import { n5Lesson17 } from "./n5-lesson17";
import { n5Lesson18 } from "./n5-lesson18";
import { n5Lesson19 } from "./n5-lesson19";
import { n5Lesson20 } from "./n5-lesson20";

export type { Deck, FlashCard } from "./types";

export const decks: Deck[] = [n5Lesson12C, n5Lesson15Part1, n5Lesson15Part6, n5Lesson16, n5Lesson17, n5Lesson18, n5Lesson19, n5Lesson20];

export function getDeckBySlug(slug: string): Deck | undefined {
  return decks.find((d) => d.slug === slug);
}
