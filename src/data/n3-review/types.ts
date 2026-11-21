export type Area = "kanji" | "vocab" | "grammar";

export type SourceId = "dm-2111" | "jlpt-1225" | "dm-1411";

export type ReviewCard = {
  /** Progress key in localStorage and the sync gist. Never rename. */
  id: string;
  area: Area;
  source: SourceId;
  title: string;
  tag: string;
  /** Section and question number in the source test, e.g. "Ngữ pháp · câu 7". */
  where: string;
  gist: string;
  /** What the user picked in the test, and the right answer. */
  pick: string;
  ans: string;
  why: string;
  note: string;
  /** [Japanese sentence, Vietnamese translation] */
  examples: [string, string][];
  /** A fresh question on the same point, written for review (not copied from the test). */
  quiz: { q: string; options: string[]; answer: number; explain: string };
};

export const AREA_LABELS: Record<Area, string> = {
  kanji: "Kanji",
  vocab: "Từ vựng",
  grammar: "Ngữ pháp",
};

export const SOURCE_LABELS: Record<SourceId, string> = {
  "dm-2111": "Dungmori 21/11",
  "jlpt-1225": "JLPT 12/2025",
  "dm-1411": "Dungmori 14/11",
};
